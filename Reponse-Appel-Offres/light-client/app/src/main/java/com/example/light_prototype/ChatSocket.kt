package com.example.light_prototype

import android.util.Log
import com.example.light_prototype.model.Message
import com.google.gson.Gson
import io.socket.client.IO
import io.socket.client.Socket
import io.socket.emitter.Emitter

object ChatSocket {

    var socket = IO.socket("https://painseau.herokuapp.com/")


    fun init() {
        socket.on(Socket.EVENT_CONNECT, onConnect)
        socket.on(Socket.EVENT_CONNECT_ERROR, onConnectError)
        socket.connect()
        Log.d("waiting", "waiting to connect")
    }

    fun sendMessage(message: Message) {
        var gson = Gson()
        var jMessage = gson.toJson(message)
        socket.emit("send-message", jMessage)
    }

    private var onConnectError = Emitter.Listener {
        Log.d("sadddd", it[0].toString())
    }
    var onConnect = Emitter.Listener {
        //After getting a Socket.EVENT_CONNECT which indicate socket has been connected to server,
        //send userName and roomName so that they can join the room.
        Log.d("connect", "connected")
    }
}
