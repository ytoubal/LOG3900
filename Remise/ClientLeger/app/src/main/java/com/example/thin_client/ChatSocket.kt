package com.example.thin_client

import com.example.thin_client.model.Constants
import com.example.thin_client.model.Message
import com.google.gson.Gson
import io.socket.client.IO


class ChatSocket {

    var socket = IO.socket(Constants.URL)

    fun init() {
        socket.connect()
    }

    fun sendMessage(message: Message) {
        var gson = Gson()
        var jMessage = gson.toJson(message)
        socket.emit("send-message", jMessage)
    }
}
