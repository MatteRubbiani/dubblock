var interval;

$(document).ready(()=>{
    interval = setInterval(loadInfo, 100);

    new Player(0, 1, "players", 3, false, 0, 5, 2, 0).appendToListOfPlayers();
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
        }
    })
}