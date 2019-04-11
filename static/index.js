
  document.addEventListener("DOMContentLoaded", () => {
      var socket = io.connect(location.protocol + "//" + document.domain + ":" + location.port);

      alert("qui!");
      socket.on("connect", () => {
          document.querySelectorAll("button").forEach(button => {
              button.onclick = () => {
                  alert("lancio emit");
                  message = "Websocket client connected";
                  socket.emit("evento", {"message": message});
              };
          });
      });

      socket.on("registrato", data => {
        document.querySelector("body").innerHTML += "${data.message}";
      });
  });

