class Match{
    constructor(id, parentId, numeroCorsie, numeroLivelli, width, height){
        this.id = id;
        this.parentId = parentId;
        this.elementId = "match_"+id;
        this.className = "match";

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
        var div = document.createElement("div");
        div.id  = this.elementId;
        div.className = this.className;
        div.style.width = this.width+"px";
        div.style.height = this.height+"px";
        document.getElementById(this.parentId).appendChild(div);
    }

    appendCorsie(){
        for(let i=0; i<this.numeroCorsie; i++){
            this.corsie.push(new Corsia(i, this.elementId, this.widthCorsia, this.height));
            this.corsie[i].display();
        }
    }

    appendLivelli(){
        for(let i=0; i<this.numeroLivelli; i++){
            this.livelli.push(new Livello(i, this.elementId, this.width, this.heightLivello));
            this.livelli[i].display();
        }
    }

    appendBlock(newBlock){
        if(!this.blocks[newBlock.livello][newBlock.corsia]){
            var n = new Block(newBlock.livello+","+newBlock.corsia, this.elementId, newBlock.livello, newBlock.corsia, this.widthCorsia, this.heightLivello);
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
}

class Corsia{
    constructor(id, parentId, width, height){
        this.id = id
        this.parentId = parentId;
        this.elementId  = "corsia_"+id;
        this.className = "corsia";
        this.width = width;
        this.height = height;
    }

    display(){
        try{
            var corsia = document.createElement("div");
            corsia.id = this.elementId;
            corsia.className = this.className;
            corsia.style.width = this.width+"px"
            corsia.style.height = this.height+"px"
            corsia.style.left = this.id*this.width  + "px";
            corsia.style.top = "0px";
            document.getElementById(this.parentId).appendChild(corsia);
        } catch(e){console.log(e)}
    }
}

class Livello{
    constructor(id, parentId, width, height){
        this.id = id
        this.parentId = parentId;
        this.elementId  = "livello_"+id;
        this.className = "livello";
        this.width = width;
        this.height = height;
    }

    display(){
        try{
            var livello = document.createElement("div");
            livello.id = this.elementId;
            livello.className = this.className;
            livello.style.width = this.width+"px"
            livello.style.height = this.height+"px"
            livello.style.left = "0px";
            livello.style.top = this.id*this.height  + "px";
            document.getElementById(this.parentId).appendChild(livello);
        } catch(e){console.log(e)}
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

        this.listPClassName = "player"
        this.otherPlayerInfoClassName = "player_info";

        this.pInnerHTML = "Giocatore "+number;

        this.colorId = colorId;
        this.isPlaying = isPlaying;
        
        this.corsia = corsia;
        this.livello = livello;
        this.jollyReveal = jollyReveal;
        this.jollyEarthquake = jollyEarthquake;
    }

    appendToListOfPlayers(){
        let div = document.createElement("div");
        div.id = this.elementId;
        div.style.width = "fit-content";

        let p = document.createElement("p");
        p.className = this.listPClassName;
        p.innerHTML = this.pInnerHTML;
        p.style.color = coloriPedine[this.colorId];

        let livello = document.createElement("p");
        livello.className = this.otherPlayerInfoClassName;
        livello.innerHTML = "Livello: "+this.livello;

        let reveal = document.createElement("p");
        reveal.className = this.otherPlayerInfoClassName;
        reveal.innerHTML = "Jolly rivelazione rimanenti: "+this.jollyReveal;

        let earthquake = document.createElement("p");
        earthquake.className = this.otherPlayerInfoClassName;
        earthquake.innerHTML = "Jolly terremoto rimanenti: "+this.jollyEarthquake;

        div.appendChild(p);
        div.appendChild(livello);
        div.appendChild(reveal);
        div.appendChild(earthquake);

        div.onmouseover = ()=>{
            p.style.fontWeight = 700;
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
            document.getElementById(this.listId).removeChild(document.getElementById(this.elementId));
        }catch(e){}
        document.getElementById(this.listId).appendChild(div);
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
        var val = Number($(id).html());
        $(id).html(val++);
    }

    decrease(){
        var val = Number($(id).html());
        if(val>this.minValue) $(id).html(val--);
    }
}