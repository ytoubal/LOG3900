package com.example.light_prototype.model

class Message(m: String, s: User, time: String="", messageType: MessageType = MessageType.MESSAGE_OWN) {
    var message: String = m
    var sender: User = s
    var timestamp: String = time
    var messageType: MessageType = messageType
}