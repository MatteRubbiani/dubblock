const BASE_URL = "https://dubblocksite.herokuapp.com/";
const BLOCK_H_W_RATIO = 0.15;
const coloriPedine = ["#3cb556", "#95c62c", "#f5d131", "#f29513", "#f23513", "#13f2a4", "#13bbf2", "#9d13f2", "f213c9", "#111869"]
const CELLA_H_W_RATIO = 2/3;

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