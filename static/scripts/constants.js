const BASE_URL = "https://dubblocksite.herokuapp.com/";
const BLOCK_H_W_RATIO = 0.15;
const coloriPedine = ["#3cb556", "#95c62c", "#f5d131", "#f29513", "#f23513", "#13f2a4", "#13bbf2", "#9d13f2", "f213c9", "#111869"]
const CELLA_H_W_RATIO = 2/3;
const maxGridWidth = 0.6;
const maxGridHeight = 0.6;

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

function deleteUser(){
    $.ajax({
        url: BASE_URL+"delete_user/"+localStorage.getItem("UserId"),
        type: "delete",
        contentType: "application/json",
        dataType: "json",
        error: (jq)=>{console.log(jq)}
    })
}

function setTagLobby(){
    let tag = window.location.href.split("/")[window.location.href.split("/").length-1].split("?")[0];
    localStorage.setItem("TagLobby", tag);
}

function getTagLobby(){
    return window.location.href.split("/")[window.location.href.split("/").length-1].split("?")[0];
}

function getGridDimensions(corsie, livelli){
    let availableWidth = $(window).width() * maxGridWidth;
    let availableHeight = $(window).height() * maxGridHeight;

    let width = availableWidth/corsie-2*corsie;
    let height = width*CELLA_H_W_RATIO;
    let gridHeight = (height+2)*livelli;

    let height1 = availableHeight/livelli-2*livelli;
    let width1 = height1/CELLA_H_W_RATIO;

    if(gridHeight<availableHeight){
        return [width, height];
    } else{
        return [width1, height1];
    }
}