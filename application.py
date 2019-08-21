import os
import json
import time
import collections
import pprint
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

global channels
global channel_selected

messages_sent = collections.deque(maxlen=100)
channels = { "default": messages_sent }

@app.route("/")
def index():
     title = "Flack"
     session["channel_in_use"] = "default"
     return render_template("index.html", title=title, channels=channels)

@socketio.on("send message")
def send_message(data):
     json_string = data["json"]
     json_object = json.loads(json_string)
     ts = time.gmtime()
     print ("channel ",session["channel_in_use"])
     json_message = {}
     json_message[session["channel_in_use"]] = {'timestamp': time.strftime("%Y-%m-%d %H:%M:%S", ts), 'username': json_object["username"], 'message': json_object["message"]}
     
     messages_list = channels.get(session["channel_in_use"])
     print(messages_list)
     messages_list.append(json_message[session["channel_in_use"]])
     print(messages_list)
     channels[session["channel_in_use"]] = messages_list

     pprint.pprint(channels)

     json_string = json.dumps(json_message)
     emit("broadcast message", {"json": json_string }, broadcast=True)

@socketio.on("add channel")
def add_channel(data):
     json_str = data["json"]
     json_obj = json.loads(json_str)
     if(json_obj['channel_name'] not in channels.keys()):
          channels[json_obj['channel_name']] = messages_sent
          pprint.pprint(channels)
          emit("add channel", {"json": json_str }, broadcast=True)
     else:
          emit("channel present")

@socketio.on("channel selected")
def channel_selected(data):
     json_str = data["json"]
     json_obj = json.loads(json_str)
     session["channel_in_use"] = json_obj['channel_selected']
     print ("channel ",session["channel_in_use"])
     messages_list_deque = channels.get(session["channel_in_use"])
     print(messages_list_deque)
     if(messages_list_deque is not None):
          message_list = list(messages_list_deque)
          print(message_list)
          json_channels_string = json.dumps(message_list)
          emit("channel last messages", {"json": json_channels_string }, broadcast=True)