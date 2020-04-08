var players = [];
var interval;
var pedineDisponibili = new Array(coloriPedine.length);
for(let i=0; i<pedineDisponibili.length; i++) pedineDisponibili[i] = coloriPedine[i];


$(document).ready(()=>{
    if(localStorage.getItem("TagLobby")==null){
        localStorage.setItem("TagLobby", window.location.href.split("/")[window.location.href.split("/").length-1].split("?")[0])
    }
    interval = setInterval(loadInfo, 100);
})

function loadInfo(){
    if(localStorage.getItem("UserId")!=null){
        $.ajax({
            url: BASE_URL+"get_ready_players/"+localStorage.getItem("UserId"),
            type: "get",
            contentType: "application/json",
            dataType: "json",
            success: (data)=>{
                for(let i=0; i<pedineDisponibili.length; i++) pedineDisponibili[i] = coloriPedine[i];
                for(let user of players) user.removePlayer();
                players = [];
                let isIn = false;
                for(let user of data){
                    let p = new PlayerPrepartita(user.id, coloriPedine[user.pedina_number], user.id==localStorage.getItem("UserId"));
                    if(user.id==localStorage.getItem("UserId")){
                        isIn = true;
                    }
                    if(isIn){
                        $("#join").html("Esci");
                        $("#join").prop("onclick", null).off("click");
                        $("#join").click(()=>{exitPrepartita()});
                    } else{
                        $("#join").html("Entra");
                        $("#join").prop("onclick", null).off("click");
                        $("#join").click(()=>{popupPedine()});
                    }
                    players.push(p);
                    p.appendPlayer();
                    pedineDisponibili[user.pedina_number] = null;
                }
            },
            error: (jq)=>{
                if(jq.status == 401){
                    window.location.reload();
                } else console.log(jq)
            }
        })
    } else{
        createUser()
    }
}

function createUser(){
    $.ajax({
        url: BASE_URL+"create_user/"+localStorage.getItem("TagLobby"),
        type: "post",
        contentType: "application/json",
        dataType: "json",
        success: (data)=>{
            window.localStorage.setItem("UserId", data);
        },
        error: (jq)=>{console.log(jq)}
    })
}

function popupPedine(){
    var pedine = [];
    for(let i=0; i<coloriPedine.length; i++){
        try{
            document.getElementById("pedina_"+i).parentNode.removeChild(document.getElementById("pedina_"+i));
        }catch(e){}
        pedine.push(new SceltaPedina(i, pedineDisponibili[i], "lista_pedine"));
        pedine[i].appendPedina(pedineDisponibili[i]!=null);
    }
    $("#choose_pedina_popup").show()
}

function exitPrepartita(){
    $.ajax({
        url: BASE_URL+"leave_partita/"+localStorage.getItem("UserId"),
        type: "post",
        contentType: "application/json",
        dataType: "json",
        error: (jq)=>{console.log(jq)}
    })
}

function popupSettings(){
    $.ajax({
        url: BASE_URL+"start_partita/"+localStorage.getItem("UserId"),
        type: "get",
        contentType: "application/json",
        dataType: "json",
        success: (data)=>{
            var numeroCorsie = new Input("#numero_corsie", 2, data.corsie);
            var numeroLivelli = new Input("#numero_livelli", 1, data.livelli);
            var numeroBlocchi = new Input("#numero_blocchi", 1, data.blocchi);
            $("#up_corsie").click(()=>{numeroCorsie.increase()});
            $("#down_corsie").click(()=>{numeroCorsie.decrease()});
            $("#up_livelli").click(()=>{numeroLivelli.increase()});
            $("#down_livelli").click(()=>{numeroLivelli.decrease()});
            $("#up_blocchi").click(()=>{numeroBlocchi.increase()});
            $("#down_blocchi").click(()=>{numeroBlocchi.decrease()});

            $("#settings_popup").show();
        },
        error: (jq)=>{console.log(jq)}
    })
}