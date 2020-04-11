var interval;
var match;
var players = [];

$(document).ready(() => {
    if (localStorage.getItem("UserId") == null) createUser();
    if (localStorage.getItem("TagLobby") == null) setTagLobby();
    if (localStorage.getItem("TagLobby") != getTagLobby()) createUser();
    interval = setInterval(loadInfo, 100);
})

function loadInfo() {
    if (localStorage.getItem("UserId") != null) {
        if (match == null || !match.moving) {
            $.ajax({
                url: BASE_URL + "get/" + localStorage.getItem("UserId"),
                type: "get",
                contentType: "application/json",
                dataType: "json",
                success: (data) => {
                    let map = new Array(data.griglia.livelli).fill(1);
                    if (match == null) {
                        let dimensions = getGridDimensions(data.griglia.corsie, data.griglia.livelli)
                        match = new Match(0, "match_parent", data.griglia.corsie, data.griglia.livelli, dimensions[0], dimensions[1]);
                        match.createElement();
                        match.createDivOfWinners();
                        for (let blocco of data.blocchi) match.appendBlock(blocco);
                    } else {
                        let newBlocks = (new Array(data.griglia.livelli)).fill().map(function () { return new Array(data.griglia.corsie).fill(false); });
                        for (let blocco of data.blocchi) newBlocks[blocco.livello][blocco.corsia] = true;
                        match.updateBlocks(newBlocks);
                    }
                    if (JSON.stringify(players) == "[]") {
                        for (let user of data.users) {
                            let p = new Player(user.id, data.users.indexOf(user) + 1, "players", user.pedina_number, user.is_playing, user.corsia, user.livello, user.jolly_reveal, user.jolly_earthquake);
                            p.appendToListOfPlayers();
                            map = p.showLivello(match, map);
                            players.push(p);
                        }
                    } else {
                        for (let i = 0; i < players.length; i++) {
                            players[i] = new Player(data.users[i].id, i + 1, "players", data.users[i].pedina_number, data.users[i].is_playing, data.users[i].corsia, data.users[i].livello, data.users[i].jolly_reveal, data.users[i].jolly_earthquake);
                            players[i].updatePlayer();
                            map = players[i].showLivello(match, map);
                        }
                    }
                }
            })
        }
    } else {
        createUser();
    }
}

function passaIlTurno(){
    $.ajax({
        url: BASE_URL + "passa/" + localStorage.getItem("UserId"),
        type: "post",
        contentType: "application/json",
        dataType: "json",
        error: (jq) => { console.log(jq) }
    })
}

function jollyEarthquake(){
    $.ajax({
        url: BASE_URL + "jolly_earthquake/" + localStorage.getItem("UserId"),
        type: "post",
        contentType: "application/json",
        dataType: "json",
        error: (jq) => { console.log(jq) }
    })
}

function jollyReveal(){
    
}
