
if (!localStorage.getItem('username')){
    localStorage.setItem('username', '');
} else {
    document.querySelector('#username_p').style.display = "none";
    document.querySelector('#username').innerHTML = localStorage.getItem('username');
}

$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});
    

document.addEventListener("DOMContentLoaded", () => {
    var socket = io.connect(location.protocol + "//" + document.domain + ":" + location.port);

    document.querySelector('#save_username').onclick = () => {
        let username = localStorage.getItem('username');
        localStorage.setItem('username', document.querySelector('#username_p').value);
        document.querySelector('#username_p').style.display = "none";
        document.querySelector('#username').innerHTML = localStorage.getItem('username');
    }

    alert("qui!");
    socket.on("connect", () => {
        document.querySelector("#registra_websocket").onclick = () => {
            //alert("lancio emit");
            message = "Websocket client connected";
            socket.emit("evento", {"message": message});
        };
    });

    socket.on("registrato", data => {
        alert("registrato");
        document.querySelector("#check_websocket").innerHTML += data.message;
    });
});

