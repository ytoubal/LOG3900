package com.example.light_prototype.model

enum class MessageType(val value: Int) {
    MESSAGE_OWN(0),
    MESSAGE_OTHER(1),
    USER_JOIN(2),
    USER_LEAVE(3)
}