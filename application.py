import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

title = "Flack"


@app.route("/")
def index():
     title = "Flack"
     return render_template("index.html", title=title)

@socketio.on("evento")
def socket_response(data):
     message = data["message"]
     emit("registrato", {"message": message})
