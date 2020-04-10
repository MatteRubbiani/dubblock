class Match{
    constructor(id, parentId, numeroCorsie, numeroLivelli, width, height){
        this.id = id;
        this.parentId = parentId;
        this.elementId = "match_"+id;
        this.className = "match";
        this.cellClassName = "cell";

        this.width = width;
        this.height = height;

        this.blocks = (new Array(numeroLivelli)).fill().map(function(){ return new Array(numeroCorsie).fill(false);});

        this.numeroCorsie = numeroCorsie;
        this.corsie = [];
        this.widthCorsia = width/this.numeroCorsie;

        this.numeroLivelli = numeroLivelli;
        this.livelli = [];
        this.heightLivello = height/this.numeroLivelli;

        this.moving = false;
    }

    createElement(){
        let div = document.createElement("div");
        div.id  = this.elementId;
        div.className = this.className;
        div.style.width = this.width+"px";
        div.style.height = this.height+"px";

        for(let l=0; l<this.numeroLivelli; l++){
            for(let c=0; c<this.numeroCorsie; c++){
                let cell = document.createElement("div");
                cell.id = l+"-"+c+"-cell";
                cell.className = this.cellClassName;
                cell.style.width = this.widthCorsia-2+"px";
                cell.style.height = this.heightLivello-2+"px";
                div.appendChild(cell);
            }
        }
        document.getElementById(this.parentId).appendChild(div);
    }

    appendBlock(newBlock){
        if(!this.blocks[newBlock.livello][newBlock.corsia]){
            var n = new Block(newBlock.id, this.elementId, newBlock.livello, newBlock.corsia, this.widthCorsia, this.heightLivello);
            this.blocks[newBlock.livello][newBlock.corsia] = n;
            n.displayBlock();
        }
    }

    removeBlock(position){
        document.getElementById(this.elementId).removeChild(document.getElementById(this.blocks[position.livello][position.corsia].elementId));
        this.blocks[position.livello][position.corsia] = false;
    }

    moveBlock(departure, arrival){
        try{
            if(!this.blocks[arrival.livello][arrival.corsia]){
                this.moving = true;
                const m = (departure.livello-arrival.livello)*this.heightLivello/(departure.corsia-arrival.corsia)/this.widthCorsia;
                const verso = (departure.corsia-arrival.corsia > 0) ? -1 : 1;
                var partenza = document.getElementById(this.blocks[departure.livello][departure.corsia].elementId);
                if(!partenza) throw "Departure doesn't exist"
                var t = setInterval(()=>{
                    if(m!=0 && Math.abs(m)!=Infinity){
                        if(Number(partenza.style.top.replace("px", ""))*Math.sign(m)*verso >= (arrival.livello+1)*this.heightLivello*Math.sign(m)*verso && Number(partenza.style.left.replace("px", ""))*verso >= arrival.corsia*this.widthCorsia*verso){
                            clearInterval(t);
                            this.removeBlock(departure);
                            this.appendBlock(arrival);
                            this.moving = false;
                        }
                    } else if(m==0){
                        if(Number(partenza.style.left.replace("px", ""))*verso >= arrival.corsia*this.widthCorsia*verso){
                            clearInterval(t);
                            this.removeBlock(departure);
                            this.appendBlock(arrival);
                            this.moving = false;
                        }
                    } else if(Math.abs(m)==Infinity){
                        if(Number(partenza.style.top.replace("px", ""))*Math.sign(m) >= (arrival.livello+1)*this.heightLivello*Math.sign(m)){
                            clearInterval(t);
                            this.removeBlock(departure);
                            this.appendBlock(arrival);
                            this.moving = false;
                        }
                    }
                    if(Math.abs(m)!=Infinity){
                        partenza.style.top = Number(partenza.style.top.replace("px", ""))+m*verso+"px";
                        partenza.style.left = Number(partenza.style.left.replace("px", ""))+verso+"px";
                    } else {
                        partenza.style.top = Number(partenza.style.top.replace("px", ""))+Math.sign(m)+"px";
                    }
                }, 10)
            } else{
                throw "Destination alredy taken";
            }
        } catch(e) {this.moving = false;}
    }

    updateBlocks(newBlocks){
        var departure;
        var arrival;
        try{
            for(let l=0; l<this.blocks.length; l++){
                for(let c=0; c<this.blocks[l].length; c++){
                    if(this.blocks[l][c]==false && newBlocks[l][c]){
                        arrival = {corsia: c, livello: l};
                    } else if(this.blocks[l][c]!=false && !newBlocks[l][c]){
                        departure = {corsia: c, livello: l};
                    }
                }
            }
        } catch(e){console.log(e); return undefined;}
        if(departure!=null && arrival!=null){
            this.moveBlock(departure, arrival);
        }
    }
}

class Block{
    constructor(id, parentId, livelloId, corsiaId, widthCorsia, heightLivello){
        this.id = id;
        this.parentId = parentId;
        this.elementId = "block_"+this.id;
        this.className = "block"

        this.height = widthCorsia*BLOCK_H_W_RATIO;
        this.widthCorsia = widthCorsia;
        this.heightLivello = heightLivello;

        this.livelloId = livelloId;
        this.corsiaId = corsiaId;
    }

    displayBlock(){
        try{
            var block = document.createElement("div");
            block.id = this.elementId;
            block.className = this.className;
            block.style.top = this.heightLivello*(this.livelloId+1)-this.height/2+"px";
            block.style.left = this.corsiaId*this.widthCorsia+1+"px";
            block.style.width = this.widthCorsia+"px";
            block.style.height = this.height+"px";
            document.getElementById(this.parentId).appendChild(block);
        } catch(e){console.log(e);}
    }
}

class Player{
    constructor(id, number, listId, colorId, isPlaying, corsia, livello, jollyReveal, jollyEarthquake){
        this.id = id;
        this.listId = listId;
        this.listElementId = "list_element_player_"+id;
        this.frecciaLivelloId = "player_"+id+"_is_here";
        this.livelloPId = "livello_label_"+id;
        this.jollyRevealPId = "jolly_reveal_label_"+id;
        this.jollyEarthquakePId = "jolly_earthquake_label_"+id;

        this.listPClassName = "player"
        this.otherPlayerInfoClassName = "player_info";
        this.arrowClassName = "player_position_arrow";
        this.pedinaClassName = "pedina"

        this.pInnerHTML = "Giocatore "+number;
        if(corsia!=null) this.pInnerHTML+=" (Tu)";
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

    appendToListOfPlayers(){
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
        livello.innerHTML = this.livelloInnerHTML+(this.livello+1);

        let reveal = document.createElement("p");
        reveal.id = this.jollyRevealPId;
        reveal.className = this.otherPlayerInfoClassName;
        reveal.innerHTML = this.jollyRevealInnerHTML+this.jollyReveal;

        let earthquake = document.createElement("p");
        earthquake.id = this.jollyEarthquakePId;
        earthquake.className = this.otherPlayerInfoClassName;
        earthquake.innerHTML = this.jollyEarthquakeInnerHTML+this.jollyEarthquake;

        div.appendChild(p);
        div.appendChild(livello);
        div.appendChild(reveal);
        div.appendChild(earthquake);

        div.onmouseover = ()=>{
            p.style.fontWeight = 900;
            for(let node of div.childNodes) node.style.display = "block";
        };

        div.onmouseout = ()=>{
            p.style.fontWeight = "normal";
            for(let node of div.childNodes) {
                if(node != p){
                    node.style.display = "none";
                }
            }
        };

        try{
            document.getElementById(this.listId).removeChild(document.getElementById(this.listElementId));
        }catch(e){}
        document.getElementById(this.listId).appendChild(div);

        if(this.isPlaying){
            $("#who_plays span").html(this.pInnerHTML);
            $("#who_plays span").css("color", coloriPedine[this.colorId]);
            if(this.id == localStorage.getItem("UserId")) this.isYourTurn();
            else $("#who_plays p p").hide();
        }
    }

    updatePlayer(){
        let livello = document.getElementById(this.livelloPId);
        livello.innerHTML = this.livelloInnerHTML+this.livello;

        let reveal = document.getElementById(this.jollyRevealPId);
        reveal.innerHTML = this.jollyRevealInnerHTML+this.jollyReveal;

        let earthquake = document.getElementById(this.jollyEarthquakePId);
        earthquake.innerHTML = this.jollyEarthquakeInnerHTML+this.jollyEarthquake;

        if(this.isPlaying){
            $("#who_plays span").html(this.pInnerHTML);
            $("#who_plays span").css("color", coloriPedine[this.colorId]);
            if(this.id == localStorage.getItem("UserId")) this.isYourTurn();
            else $("#who_plays p p").hide();
        }
    }

    showLivello(match, map){
        let arrow = document.createElement("p");
        arrow.id = this.frecciaLivelloId;
        arrow.className = (this.corsia==null) ? this.arrowClassName : this.pedinaClassName;
        if(this.corsia != null){
            arrow.style.width = match.widthCorsia-20+"px";
            arrow.style.height = match.heightLivello-20+"px";
            arrow.style.left = match.widthCorsia*this.corsia+Number(arrow.style.width.replace("px", ""))/2+5+"px";
            arrow.style.top = match.heightLivello*this.livello-Number(arrow.style.height.replace("px", ""))/2+5+"px";
        } else{
            arrow.style.right = -35*map[this.livello]+"px";
            arrow.style.top = match.heightLivello*this.livello+5+"px";
        }
        arrow.style.backgroundColor = coloriPedine[this.colorId];

        try{
            document.getElementById(match.parentId).removeChild(document.getElementById(this.frecciaLivelloId));
        } catch(e){}
        document.getElementById(match.parentId).appendChild(arrow);
        if(this.corsia==null) map[this.livello]++;
        return map;
    }

    isYourTurn(){
        $("#who_plays p p").show();
        // let pedina = document.getElementById(this.frecciaLivelloId);
        // pedina.ondrop = (event)=>{

        // }
    }
}

class PlayerPrepartita{
    constructor(id, color, isMe){
        this.id = id;
        this.parentId = "players";
        this.elementId = "player_"+id;
        this.className = "player";

        this.isMe = isMe;
        this.color = color;

        this.isMeClassName = "its_me";
        this.isMeLabel = "Tu";
    }

    appendPlayer(){
        var div = document.createElement("div");
        div.id = this.elementId;
        div.className = this.className;
        div.style.backgroundColor = this.color;
        if(this.isMe){
            let p = document.createElement("p");
            p.className = this.isMeClassName;
            p.innerHTML = this.isMeLabel;
            div.appendChild(p);
        }
        document.getElementById(this.parentId).appendChild(div);
    }

    removePlayer(){
        document.getElementById(this.parentId).removeChild(document.getElementById(this.elementId));
    }
}

class SceltaPedina{
    constructor(id, color, parentId){
        this.id = id;
        this.parentId = parentId;
        this.elementId = "pedina_"+id;
        this.className = "player";

        this.color = color;
    }

    appendPedina(clickable){
        var div = document.createElement("div");
        div.id = this.elementId;
        div.className = this.className;
        div.style.backgroundColor = this.color;
        if(clickable){
        var context = this;
            div.onclick = ()=>{
                context.joinPrepartita(context.id);
            }
        }
        document.getElementById(this.parentId).appendChild(div);
    }

    removePedina(){
        document.getElementById(this.parentId).removeChild(document.getElementById(this.elementId));
    }

    joinPrepartita(color){
        $.ajax({
            url: BASE_URL+"join_prepartita/"+localStorage.getItem("UserId"),
            type: "post",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({pedina_number: color}),
            success: ()=>{
                $("#choose_pedina_popup").hide();
                $("#inizia_wrapper").show();
            },
            error: (jq)=>{console.log(jq)}
        })
    }
}

class Input{
    constructor(id, minValue, defaultValue){
        this.id = id;
        this.minValue = minValue;
        $(id).html(defaultValue)
    }

    increase(){
        var val = Number($(this.id).html());
        $(this.id).html(val+1);
    }

    decrease(){
        var val = Number($(this.id).html());
        if(val>this.minValue) $(this.id).html(val-1);
    }
}
