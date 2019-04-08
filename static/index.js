
  document.addEventListener("DomContentLoaded", () => {
      var socket = io.connect(location.protocol + "//" + document.domain + ":" + location.port);

      alert("qui!");
      socket.on("connect", () => {
          document.querySelectorAll("button").forEach(button => {
              button.onclick = () => {
                  alert("lancio emit");
                  socket.emit("evento");
              };
          });
      });

      socket.on("registrato", () => {
        document.querySelector("body").innerHTML += "registrato!";
      });
  });

