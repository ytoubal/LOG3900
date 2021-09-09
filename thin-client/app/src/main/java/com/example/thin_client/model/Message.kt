package com.example.thin_client.model

class Message(
    m: String,
    s: String,
    time: String = "",
    messageType: MessageType = MessageType.MESSAGE_OWN,
    room: String = "rooooooom",
    avatar: String = ""
) {
    var message: String = m
    var sender: String = s
    var timestamp: String = time
    var messageType: MessageType = messageType
    var room: String = room
    var avatar: String = avatar
}