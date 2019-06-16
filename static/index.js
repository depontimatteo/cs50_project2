
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

        document.querySelector("#add_channel").onclick = () => {
            //alert("lancio emit");
            channel_name = document.querySelector('#channel_name_p').value;
            var json = '{ "channel_name":"'+channel_name+'" }';
            socket.emit("add channel", {"json": json});
        };

        document.querySelector(".channel_item").onclick = () => {
            alert("ciao");
            $(".channel_item").removeClass("channel_selected");
            $(this).addClass("channel_selected");
            var json = '{ "channel_selected":"'+$(this).id+'" }';
            socket.emit("channel selected", {"json": json});
        };

    });

    socket.on("broadcast message", data => {
        var json = JSON.parse(data.json)

        document.querySelector("#board").innerHTML +=   '<div class="row">'+
                                                            '<div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xs-12">'+
                                                                '<span name="user_message" id="user_message"><strong>'+json.username+'</strong>:&nbsp;'+json.message+'</span>'+
                                                            '</div>'+
                                                        '</div>';
    });

    socket.on("add channel", data => {
        var json = JSON.parse(data.json)

        document.querySelector("#channels").innerHTML +=   '<a id="'+json.channel_name+'" class="list-group-item list-group-item-action bg-light channel_item">'+json.channel_name+'</a>';
    });
});

