var interval;
var match;

$(document).ready(()=>{
    if(localStorage.getItem("UserId")==null) createUser();
    if(localStorage.getItem("TagLobby")==null) setTagLobby();
    interval = setInterval(loadInfo, 100);
})

function loadInfo(){
    if(localStorage.getItem("UserId")!=null){
        $.ajax({
            url: BASE_URL+"get/"+localStorage.getItem("UserId"),
            type: "get",
            contentType: "application/json",
            dataType: "json",
            success: (data)=>{
                /*
                {
                    blocchi: [{corsia: int, id: int, livello: int}...{}],
                    griglia: {corsie: int, livelli: int, status: int},
                    users: [{corsia: null(se non sei tu), id: int, is_playing: boolean, livello: int, pedina_number: int, jolly_reveal: int, jolly_earthquake: int}...{}]
                }
                */
                for(let user of data.users){
                    new Player(user.id, data.users.indexOf(user)+1, "players", user.pedina_number, user.is_playing, user.corsia, user.livello, user.jolly_reveal, user.jolly_earthquake).appendToListOfPlayers();
                }
                if(match==null){
                    match = new Match(0, "match_parent", data.griglia.corsie, data.griglia.livelli, 200, 800);
                    match.createElement();
                    match.appendCorsie();
                    match.appendLivelli();
                }
            }
        })
    } else{
        createUser();
    }
}