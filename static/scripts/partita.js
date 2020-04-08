var interval;

$(document).ready(()=>{
    interval = setInterval(loadInfo, 100);
})

function loadInfo(){
    $.ajax({
        url: BASE_URL+"get/"+localStorage.getItem("UserId"),
        type: "get",
        contentType: "application/json",
        dataType: "json",
        success: (data)=>{
            /*
            {
                blocchi: [{corsia: int, id: int, livello: int}...{}],
                griglia: {corsia: int, livelli: int, status: int},
                users: [{corsia: null(se non sei tu), id: int, is_playing: boolean, livello: int, pedina_number: int, jolly_reveal: int, jolly_earthquake: int}...{}]
            }
            */
           for(let user of data.users){
                new Player(user.id, data.users.indexOf(user)+1, "players", user.pedina_number, user.is_playing, user.corsia, user.livello, user.jolly_reveal, user.jolly_earthquake).appendToListOfPlayers();
           }
        }
    })
}