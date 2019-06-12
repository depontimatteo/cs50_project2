import os
import json
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

@socketio.on("send message")
def socket_response(data):
     json = data["json"]
     emit("broadcast message", {"json": json }, broadcast=True)
