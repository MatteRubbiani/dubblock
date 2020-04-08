var match;
var numeroCorsie = 5;
var numeroLivelli = 8;
var width = 400;
var height = 500;

$(document).ready(()=>{
    match = new Match(0, "match_example", numeroCorsie, numeroLivelli, width, height);
    match.createElement();
    match.appendCorsie();
    match.appendLivelli();
    for(let i=0; i<numeroLivelli*4; i++){
        match.appendBlock({livello: Math.floor(Math.random()*numeroLivelli), corsia: Math.floor(Math.random()*numeroCorsie)});
    }
    var t = setInterval(moveRandom, 100)
})

function moveRandom(){
    if(!match.moving){
        try{
            match.moveBlock({livello: Math.floor(Math.random()*numeroLivelli), corsia: Math.floor(Math.random()*numeroCorsie)}, {livello: Math.floor(Math.random()*numeroLivelli), corsia: Math.floor(Math.random()*numeroCorsie)})
        } catch(e){console.log(e); moveRandom();}
    }
}

function creaLobby(){
    $.ajax({
        url: BASE_URL+"create_lobby",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        success: (data)=>{
            window.localStorage.setItem("TagLobby", data[0]);
            window.localStorage.setItem("UserId", data[1]);
            window.location = data[0];
        },
        error: (jq)=>{console.log(jq)}
    })
}

function joinLobby(){
    var tag = $("#tag_lobby").val();
    $.ajax({
        url: BASE_URL+"create_user/"+tag,
        type: "post",
        contentType: "application/json",
        dataType: "json",
        success: (data)=>{
            window.localStorage.setItem("TagLobby", tag);
            window.localStorage.setItem("UserId", data);
            window.location = tag;
        },
        error: (jq)=>{
            if(jq.status == 432){
                $("#error").show()
            } else{
                console.log(jq);
            }
        }
    })
}