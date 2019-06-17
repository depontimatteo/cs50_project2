import os
import json
import time
from flask import Flask, render_template, session
from flask_session import Session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

title = "Flack"


@app.route("/")
def index():
     title = "Flack"
     return render_template("index.html", title=title)

@socketio.on("send message")
def socket_response(data):
     json_string = data["json"]
     json_object = json.loads(json_string);
     ts = time.gmtime()
     json_object["timestamp"] = time.strftime("%Y-%m-%d %H:%M:%S", ts)
     json_string = json.dumps(json_object)
     emit("broadcast message", {"json": json_string }, broadcast=True)
