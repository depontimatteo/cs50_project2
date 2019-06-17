
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

    //alert("qui!");
    socket.on("connect", () => {
        document.querySelector("#send").onclick = () => {
            //alert("lancio emit");
            message = document.querySelector('#message_p').value;
            var json = '{ "message":"'+message+'", "username":"'+localStorage.getItem('username')+'"}';
            socket.emit("send message", {"json": json});
        };
    });

    socket.on("broadcast message", data => {
        var json = JSON.parse(data.json)

        document.querySelector("#board").innerHTML +=   '<div class="row">'+
                                                            '<div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xs-12">'+
                                                                '<span name="user_message" id="user_message">('+json.timestamp+')&nbsp;<strong>'+json.username+'</strong>:&nbsp;'+json.message+'</span>'+
                                                            '</div>'+
                                                        '</div>';
    });
});

