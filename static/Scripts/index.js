
    

document.addEventListener("DOMContentLoaded", () => {

    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    let socket = io.connect(location.protocol + "//" + document.domain + ":" + location.port);

    document.querySelector('#save_username').onclick = () => {
        let username = localStorage.getItem('username');
        localStorage.setItem('username', document.querySelector('#username_p').value);
        document.querySelector('#username_p').style.display = "none";
        document.querySelector('#save_username').style.display = "none";
        document.querySelector('#username').innerHTML = "Welcome, " + localStorage.getItem('username');
    }

    //alert("qui!");
    socket.on("connect", () => {
        document.querySelector("#send").onclick = () => {
            //alert("lancio emit");
            message = document.querySelector('#message_p').value;
            document.querySelector('#message_p').value = '';
            let json = '{ "message":"'+message+'", "username":"'+localStorage.getItem('username')+'"}';
            socket.emit("send message", {"json": json});
        };

        document.querySelector("#add_channel").onclick = () => {
            //alert("lancio emit");
            channel_name = document.querySelector('#channel_name_p').value;
            document.querySelector('#channel_name_p').value = '';
            let json = '{ "channel_name":"'+channel_name+'" }';
            socket.emit("add channel", {"json": json});
        };

        $("#channels").on("click", "a.channel_item", function() {
            $(".channel_item").removeClass("channel_selected");
            $(this).addClass("channel_selected");
            let json = '{ "channel_selected":"'+$(this).attr("id")+'" }';
            document.querySelector("#board").innerHTML=''
            localStorage.setItem('channel_selected', $(this).attr("id"));
            socket.emit("channel selected", {"json": json});
        });


    });

    socket.on("broadcast message", data => {
        let json = JSON.parse(data.json)
        let channel_selected = localStorage.getItem('channel_selected');

        document.querySelector("#board").innerHTML +=   '<div class="row">'+
                                                            '<div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xs-12">'+
                                                                '<span name="user_message" id="user_message">('+json[channel_selected].timestamp+')&nbsp;<strong>'+json[channel_selected].username+'</strong>:&nbsp;'+json[channel_selected].message+'</span>'+
                                                            '</div>'+
                                                        '</div>';
    });

    socket.on("add channel", data => {
        let json = JSON.parse(data.json)

        document.querySelector("#channels").innerHTML +=   '<a id="'+json.channel_name+'" class="list-group-item list-group-item-action bg-light channel_item">'+json.channel_name+'</a>';
    });

    socket.on("channel present", data => {
        alert("the channel is already present, please change name")
    });

    socket.on("channel last messages", data => {
        let messages_list = []
        messages_list = JSON.parse(data.json)
        
        messages_list.map(obj => {

            document.querySelector("#board").innerHTML +=   '<div class="row">'+
                '<div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xs-12">'+
                    '<span name="user_message" id="user_message">('+obj.timestamp+')&nbsp;<strong>'+obj.username+'</strong>:&nbsp;'+obj.message+'</span>'+
                '</div>'+
            '</div>';
        })

    });


    if (!localStorage.getItem('username')){
        localStorage.setItem('username', '');
    } else {
        document.querySelector('#username_p').style.display = "none";
        document.querySelector('#save_username').style.display = "none";
        document.querySelector('#username').innerHTML = "Welcome, " + localStorage.getItem('username');
    }
    
    if (!localStorage.getItem('channel_selected')){
        localStorage.setItem('channel_selected', 'default');
    } else {
        $(".channel_item").removeClass("channel_selected");

        if(document.querySelector('#' + localStorage.getItem('channel_selected'))){
            $("#"+localStorage.getItem('channel_selected')).addClass("channel_selected");
        }
        else{
            $('#default').addClass("channel_selected");
            localStorage.setItem('channel_selected', 'default');
        }
        
    }

    let json = '{ "channel_selected":"'+localStorage.getItem('channel_selected')+'" }';
    socket.emit("channel selected", {"json": json});
    

});

