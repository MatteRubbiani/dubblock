var interval;
var match;

$(document).ready(()=>{
    if(localStorage.getItem("UserId")==null) createUser();
    if(localStorage.getItem("TagLobby")==null) setTagLobby();
    interval = setInterval(loadInfo, 100);
})

function getGridDimensions(corsie, livelli){
  var cellHeight = 3
  var cellWidth = 2
  var rawHeight = livelli * cellHeight
  var rawWidth = corsie * cellWidth
  var availableWidth = $(window).width() * 0.5
  var availableHeight = $(window).height() * 0.6
  var heightRatio = rawHeight / availableHeight
  var widthRatio = rawWidth / availableWidth
  if (widthRatio > heightRatio){
    width = availableWidth
    height = width * rawHeight / rawWidth
  }else {
    height = availableHeight
    width = height * rawWidth / rawHeight
  }
  return [width, height]
}
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
                    dimensions = getGridDimensions(data.griglia.corsie, data.griglia.livelli)
                    match = new Match(0, "match_parent", data.griglia.corsie, data.griglia.livelli, dimensions[0], dimensions[1]);
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
