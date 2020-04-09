const BASE_URL = "https://dubblocksite.herokuapp.com/";
const BLOCK_H_W_RATIO = 0.15;
const coloriPedine = ["#000000", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]

function createUser(){
    var tag = window.location.href.split("/")[window.location.href.split("/").length-1].split("?")[0];
    $.ajax({
        url: BASE_URL+"create_user/"+tag,
        type: "post",
        contentType: "application/json",
        dataType: "json",
        success: (data)=>{
            window.localStorage.setItem("UserId", data);
            window.localStorage.setItem("TagLobby", tag);
        },
        error: (jq)=>{console.log(jq)}
    })
}

function setTagLobby(){
    let tag = window.location.href.split("/")[window.location.href.split("/").length-1].split("?")[0];
    localStorage.setItem("TagLobby", tag);
}