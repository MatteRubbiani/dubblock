class Match {
    constructor(id, parentId, numeroCorsie, numeroLivelli, width, height) {
        this.id = id;
        this.parentId = parentId;
        this.elementId = "match_" + id;
        this.className = "match";
        this.cellClassName = "cell";
        this.divOfWinnersClassName = "winners";

        this.width = width;
        this.height = height;

        this.blocks = (new Array(numeroLivelli)).fill().map(function () { return new Array(numeroCorsie).fill(false); });

        this.numeroCorsie = numeroCorsie;
        this.corsie = [];
        this.widthCorsia = width / this.numeroCorsie;

        this.numeroLivelli = numeroLivelli;
        this.livelli = [];
        this.heightLivello = height / this.numeroLivelli;

        this.moving = false;
    }

    createElement() {
        let div = document.createElement("div");
        div.id = this.elementId;
        div.className = this.className;
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";

        for (let l = 0; l < this.numeroLivelli; l++) {
            for (let c = 0; c < this.numeroCorsie; c++) {
                let cell = document.createElement("div");
                cell.id = l + "-" + c + "-cell";
                cell.className = this.cellClassName;
                cell.style.width = this.widthCorsia - 2 + "px";
                cell.style.height = this.heightLivello - 2 + "px";
                cell.ondrop = (ev) => {
                    ev.preventDefault();
                    ev.target.style.borderStyle = "solid";
                    ev.target.style.borderSpacing = "0px";
                    var livello = Number(ev.target.id.split("-")[0]);
                    var corsia = Number(ev.target.id.split("-")[1]);
                    var livello_iniziale = ev.dataTransfer.getData("livello");
                    var corsia_iniziale = ev.dataTransfer.getData("corsia");

                    if (ev.dataTransfer.getData("idPedina") != "") {
                        var id = ev.dataTransfer.getData("idPedina");
                        if (livello == livello_iniziale || (ev.dataTransfer.getData("forwardAllowed") != "false" && livello == Number(livello_iniziale) + 1 && corsia == corsia_iniziale)) {
                            ev.target.appendChild(document.getElementById(id));
                            $.ajax({
                                url: BASE_URL + "move_pedina/" + localStorage.getItem("UserId"),
                                type: "post",
                                contentType: "application/json",
                                dataType: "json",
                                data: JSON.stringify({ corsia: corsia, livello: livello }),
                                error: (jq) => { console.log(jq) },
                                complete: () => {
                                    $(".cell").css("background-color", "white");
                                    $(".cell").css("border-color", "black");
                                    $(".block").css("border-color", "black");
                                }
                            })
                        }
                    } else {
                        var id = ev.dataTransfer.getData("idBlocco");
                        if (livello >= livello_iniziale && this.blocks[livello][corsia] == false) {
                            $.ajax({
                                url: BASE_URL + "move_blocco/" + localStorage.getItem("UserId") + "/" + id,
                                type: "post",
                                contentType: "application/json",
                                dataType: "json",
                                data: JSON.stringify({ corsia: corsia, livello: livello }),
                                error: (jq) => { console.log(jq) },
                                complete: () => {
                                    $(".cell").css("background-color", "white");
                                    $(".cell").css("border-color", "black");
                                    $(".block").css("border-color", "black");
                                }
                            })
                        }
                    }

                };
                cell.ondragover = (ev) => {
                    ev.preventDefault();
                }
                cell.ondragenter = (ev) => {
                    if (ev.target.className == "cell") {
                        ev.target.style.borderStyle = "dashed";
                        ev.target.style.borderSpacing = "10px";
                    }
                }
                cell.ondragleave = (ev) => {
                    ev.target.style.borderStyle = "solid";
                    ev.target.style.borderSpacing = "0px";
                }
                div.appendChild(cell);
            }
        }
        document.getElementById(this.parentId).appendChild(div);
    }

    createDivOfWinners() {
        let div = document.createElement("div");
        div.className = this.divOfWinnersClassName;
        div.style.width = this.width+"px";
        div.ondrop = (ev) => {
            ev.preventDefault();
            if (ev.dataTransfer.getData("idPedina") != "") {
                if (ev.dataTransfer.getData("livello") == this.numeroLivelli - 1) {
                    if (ev.dataTransfer.getData("forwardAllowed") != "false") {
                        ev.target.appendChild(document.getElementById(ev.dataTransfer.getData("idPedina")));
                        ev.target.style.borderColor = document.getElementById(ev.dataTransfer.getData("idPedina")).style.backgroundColor;
                        alert("You won");
                    }
                }
            }
        }
        div.ondragover = (ev) => {
            ev.preventDefault();
        }
        document.getElementById(this.parentId).appendChild(div);
    }

    appendBlock(newBlock) {
        if (!this.blocks[newBlock.livello][newBlock.corsia]) {
            var n = new Block(newBlock.id, newBlock.livello, newBlock.corsia);
            this.blocks[newBlock.livello][newBlock.corsia] = n;
            n.displayBlock();
        }
    }

    removeBlock(position) {
        document.getElementById(position.livello + "-" + position.corsia + "-cell").removeChild(document.getElementById(this.blocks[position.livello][position.corsia].elementId));
        this.blocks[position.livello][position.corsia] = false;
    }

    moveBlock(departure, arrival) {
        try {
            if (!this.blocks[arrival.livello][arrival.corsia]) {
                arrival.id = this.blocks[departure.livello][departure.corsia].id;
                this.moving = true;
                const m = (departure.livello - arrival.livello) * this.heightLivello / (departure.corsia - arrival.corsia) / this.widthCorsia;
                const verso = (departure.corsia - arrival.corsia > 0) ? -1 : 1;
                var partenza = document.getElementById(this.blocks[departure.livello][departure.corsia].elementId);
                if (!partenza) throw "Departure doesn't exist"
                var repetions = 0;
                var t = setInterval(() => {
                    if (Math.abs(m) != Infinity) {
                        if (repetions >= this.widthCorsia * Math.abs(departure.corsia - arrival.corsia)) {
                            clearInterval(t);
                            this.removeBlock(departure);
                            this.appendBlock(arrival);
                            this.moving = false;
                        }
                    } else {
                        if (repetions >= this.heightLivello * Math.abs(departure.livello - arrival.livello)) {
                            clearInterval(t);
                            this.removeBlock(departure);
                            this.appendBlock(arrival);
                            this.moving = false;
                        }
                    }
                    if (Math.abs(m) != Infinity) {
                        partenza.style.bottom = Number(partenza.style.bottom.replace("px", "")) - m * verso + "px";
                        partenza.style.left = Number(partenza.style.left.replace("px", "")) + verso + "px";
                    } else {
                        partenza.style.bottom = Number(partenza.style.bottom.replace("px", "")) + Math.sign(m) + "px";
                    }
                    repetions++;
                }, 10)
            } else {
                throw "Destination alredy taken";
            }
        } catch (e) { this.moving = false; }
    }

    updateBlocks(newBlocks) {
        var departure;
        var arrival;
        try {
            for (let l = 0; l < this.blocks.length; l++) {
                for (let c = 0; c < this.blocks[l].length; c++) {
                    if (this.blocks[l][c] == false && newBlocks[l][c]) {
                        arrival = { corsia: c, livello: l };
                    } else if (this.blocks[l][c] != false && !newBlocks[l][c]) {
                        departure = { corsia: c, livello: l };
                    }
                }
            }
        } catch (e) { console.log(e); return undefined; }
        if (departure != null && arrival != null) {
            this.moveBlock(departure, arrival);
        }
    }
}

class Block {
    constructor(id, livelloId, corsiaId) {
        this.id = id;
        this.elementId = "block_" + this.id;
        this.className = "block"

        this.livello = livelloId;
        this.corsia = corsiaId;
    }

    displayBlock() {
        try {
            let block = document.createElement("div");
            block.id = this.elementId;
            block.className = this.className;
            document.getElementById(this.livello + "-" + this.corsia + "-cell").appendChild(block);
        } catch (e) { console.log(e); }
    }
}

class Player {
    constructor(id, number, listId, colorId, isPlaying, corsia, livello, jollyReveal, jollyEarthquake) {
        this.id = id;
        this.listId = listId;
        this.listElementId = "list_element_player_" + id;
        this.frecciaLivelloId = "player_" + id + "_is_here";
        this.livelloPId = "livello_label_" + id;
        this.jollyRevealPId = "jolly_reveal_label_" + id;
        this.jollyEarthquakePId = "jolly_earthquake_label_" + id;

        this.listPClassName = "player"
        this.otherPlayerInfoClassName = "player_info";
        this.arrowClassName = "player_position_arrow";
        this.pedinaClassName = "pedina"

        this.pInnerHTML = "Giocatore " + number;
        if (corsia != null) this.pInnerHTML += " (Tu)";
        this.livelloInnerHTML = "Livello: ";
        this.jollyRevealInnerHTML = "Jolly rivelazione rimanenti: ";
        this.jollyEarthquakeInnerHTML = "Jolly terremoto rimanenti: ";

        this.colorId = colorId;
        this.isPlaying = isPlaying;

        this.corsia = corsia;
        this.livello = livello;
        this.jollyReveal = jollyReveal;
        this.jollyEarthquake = jollyEarthquake;
    }

    appendToListOfPlayers() {
        let div = document.createElement("div");
        div.id = this.listElementId;
        div.style.width = "fit-content";

        let p = document.createElement("p");
        p.className = this.listPClassName;
        p.innerHTML = this.pInnerHTML;
        p.style.color = coloriPedine[this.colorId];

        let livello = document.createElement("p");
        livello.id = this.livelloPId;
        livello.className = this.otherPlayerInfoClassName;
        livello.innerHTML = this.livelloInnerHTML + (this.livello + 1);

        let reveal = document.createElement("p");
        reveal.id = this.jollyRevealPId;
        reveal.className = this.otherPlayerInfoClassName;
        reveal.innerHTML = this.jollyRevealInnerHTML + this.jollyReveal;

        let earthquake = document.createElement("p");
        earthquake.id = this.jollyEarthquakePId;
        earthquake.className = this.otherPlayerInfoClassName;
        earthquake.innerHTML = this.jollyEarthquakeInnerHTML + this.jollyEarthquake;

        div.appendChild(p);
        div.appendChild(livello);
        div.appendChild(reveal);
        div.appendChild(earthquake);

        div.onmouseover = () => {
            p.style.fontWeight = 900;
            for (let node of div.childNodes) node.style.display = "block";
        };

        div.onmouseout = () => {
            p.style.fontWeight = "normal";
            for (let node of div.childNodes) {
                if (node != p) {
                    node.style.display = "none";
                }
            }
        };

        try {
            document.getElementById(this.listId).removeChild(document.getElementById(this.listElementId));
        } catch (e) { }
        document.getElementById(this.listId).appendChild(div);

        if (this.isPlaying) {
            $("#who_plays span").html(this.pInnerHTML);
            $("#who_plays span").css("color", coloriPedine[this.colorId]);
        }
    }

    updatePlayer() {
        try {
            let livello = document.getElementById(this.livelloPId);
            livello.innerHTML = this.livelloInnerHTML + this.livello;

            let reveal = document.getElementById(this.jollyRevealPId);
            reveal.innerHTML = this.jollyRevealInnerHTML + this.jollyReveal;

            let earthquake = document.getElementById(this.jollyEarthquakePId);
            earthquake.innerHTML = this.jollyEarthquakeInnerHTML + this.jollyEarthquake;

            if (this.isPlaying) {
                $("#who_plays span").html(this.pInnerHTML);
                $("#who_plays span").css("color", coloriPedine[this.colorId]);
            }
        } catch (e) { console.log(e); this.appendToListOfPlayers(); }
    }

    showLivello(match, map) {
        try {
            document.getElementById(this.frecciaLivelloId).parentNode.removeChild(document.getElementById(this.frecciaLivelloId));
        } catch (e) { }

        let arrow = document.createElement("p");
        arrow.id = this.frecciaLivelloId;
        arrow.className = (this.corsia == null) ? this.arrowClassName : this.pedinaClassName;
        arrow.style.backgroundColor = coloriPedine[this.colorId];
        if (this.corsia != null) {
            document.getElementById(this.livello + "-" + this.corsia + "-cell").appendChild(arrow);
            if (this.isPlaying) this.isYourTurn(match)
            else {
                $("#rules").hide();
                $(".buttons").hide();
            }
        } else {
            arrow.style.right = -35 * map[this.livello] + "px";
            arrow.style.top = match.heightLivello * this.livello + 5 + "px";
            document.getElementById(match.parentId).appendChild(arrow);
            map[this.livello]++;
        }

        return map;
    }

    isYourTurn(match) {
        $("#rules").show();
        $(".buttons").show();
        this.updateButtons();
        let pedina = document.getElementById(this.frecciaLivelloId);
        $(".cell").css("background-color", "rgba(0, 0, 0, 0.2)");
        for (let c = 0; c < match.numeroCorsie; c++) {
            $("#" + this.livello + "-" + c + "-cell").css("background-color", "white");
            $("#" + this.livello + "-" + c + "-cell").css("border-color", coloriPedine[this.colorId]);
        }
        if ($("#" + this.livello + "-" + this.corsia + "-cell").children().length == 1) {
            $("#" + (this.livello + 1) + "-" + this.corsia + "-cell").css("background-color", "white");
            $("#" + (this.livello + 1) + "-" + this.corsia + "-cell").css("border-color", coloriPedine[this.colorId]);
        }
        pedina.draggable = true;
        pedina.ondragstart = (ev) => {
            ev.dataTransfer.setData("forwardAllowed", $("#" + this.livello + "-" + this.corsia + "-cell").children().length == 1);
            ev.dataTransfer.setData("idPedina", ev.target.id);
            ev.dataTransfer.setData("livello", this.livello);
            ev.dataTransfer.setData("corsia", this.corsia);
        }

        let blocks = document.getElementsByClassName("block");
        for (let b of blocks) {
            b.draggable = false;
            b.ondragstart = () => { return false; }
        }
        for (let l = this.livello; l < match.numeroLivelli; l++) {
            for (let c = 0; c < match.numeroCorsie; c++) {
                try {
                    let block = document.getElementById(match.blocks[l][c].elementId)
                    block.style.borderColor = coloriPedine[this.colorId];
                    block.draggable = true;
                    block.ondragstart = (ev) => {
                        ev.dataTransfer.setData("idBlocco", ev.target.id.split("_")[1]);
                        ev.dataTransfer.setData("livello", l);
                        ev.dataTransfer.setData("corsia", c);
                    }
                } catch (e) { }
            }
        }
    }

    updateButtons(){
        $("#numero_reveal").html(this.jollyReveal);
        $("#numero_earthquake").html(this.jollyEarthquake);
    }
}

class PlayerPrepartita {
    constructor(id, color, isMe) {
        this.id = id;
        this.parentId = "players";
        this.elementId = "player_" + id;
        this.className = "player";

        this.isMe = isMe;
        this.color = color;

        this.isMeClassName = "its_me";
        this.isMeLabel = "Tu";
    }

    appendPlayer() {
        var div = document.createElement("div");
        div.id = this.elementId;
        div.className = this.className;
        div.style.backgroundColor = this.color;
        if (this.isMe) {
            let p = document.createElement("p");
            p.className = this.isMeClassName;
            p.innerHTML = this.isMeLabel;
            div.appendChild(p);
        }
        document.getElementById(this.parentId).appendChild(div);
    }

    removePlayer() {
        document.getElementById(this.parentId).removeChild(document.getElementById(this.elementId));
    }
}

class SceltaPedina {
    constructor(id, color, parentId) {
        this.id = id;
        this.parentId = parentId;
        this.elementId = "pedina_" + id;
        this.className = "player";

        this.color = color;
    }

    appendPedina(clickable) {
        var div = document.createElement("div");
        div.id = this.elementId;
        div.className = this.className;
        div.style.backgroundColor = this.color;
        if (clickable) {
            var context = this;
            div.onclick = () => {
                context.joinPrepartita(context.id);
            }
        }
        document.getElementById(this.parentId).appendChild(div);
    }

    removePedina() {
        document.getElementById(this.parentId).removeChild(document.getElementById(this.elementId));
    }

    joinPrepartita(color) {
        $.ajax({
            url: BASE_URL + "join_prepartita/" + localStorage.getItem("UserId"),
            type: "post",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({ pedina_number: color }),
            success: () => {
                $("#choose_pedina_popup").hide();
                $("#inizia_wrapper").show();
            },
            error: (jq) => { console.log(jq) }
        })
    }
}

class Input {
    constructor(id, minValue, defaultValue) {
        this.id = id;
        this.minValue = minValue;
        $(id).html(defaultValue)
    }

    increase() {
        var val = Number($(this.id).html());
        $(this.id).html(val + 1);
    }

    decrease() {
        var val = Number($(this.id).html());
        if (val > this.minValue) $(this.id).html(val - 1);
    }
}
