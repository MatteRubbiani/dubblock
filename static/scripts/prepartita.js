var players;
var interval;
$(document).ready(()=>{
    if(localStorage.getItem("TagLobby")==null){
        localStorage.setItem("TagLobby", window.location.href.split("/")[window.location.href.split("/").length-1].split("?")[0])
    }
    interval = setInterval(loadInfo, 100);
})

function loadInfo(){
    if(localStorage.getItem("UserId")!=null){
        $.ajax({
            url: "get/"+localStorage.getItem("UserId"),
            type: "get",
            contentType: "application/json",
            dataType: "json",
            success: (data)=>{

            },
            error: (jq)=>{console.log(jq)}
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