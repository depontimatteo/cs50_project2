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

channels = ["default"]
channel_selected = "default"


@app.route("/")
def index():
     title = "Flack"
     return render_template("index.html", title=title, channels=channels)

@socketio.on("send message")
<<<<<<< .merge_file_KHHPax
def socket_response(data):
     json_string = data["json"]
     json_object = json.loads(json_string);
     ts = time.gmtime()
     json_object["timestamp"] = time.strftime("%Y-%m-%d %H:%M:%S", ts)
     json_string = json.dumps(json_object)
     emit("broadcast message", {"json": json_string }, broadcast=True)
=======
def send_message(data):
     json = data["json"]
     emit("broadcast message", {"json": json }, broadcast=True)

@socketio.on("add channel")
def add_channel(data):
     json_str = data["json"]
     json_obj = json.loads(json_str)
     if(json_obj['channel_name'] not in channels):
          channels.append(json_obj['channel_name'])
          emit("add channel", {"json": json_str }, broadcast=True)

@socketio.on("channel selected")
def channel_selected(data):
     json_str = data["json"]
     json_obj = json.loads(json_str)
     channel_selected = json_obj['channel_selected']
>>>>>>> .merge_file_ik7Iu6
