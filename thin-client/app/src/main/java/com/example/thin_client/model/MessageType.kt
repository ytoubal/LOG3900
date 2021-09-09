package com.example.thin_client.model

enum class MessageType(val value: Int) {
    MESSAGE_OWN(0),
    MESSAGE_OTHER(1),
    USER_JOIN(2),
    USER_LEAVE(3),
    LOAD_MESSAGES(4),
    MESSAGE_OWN_CORRECT(5),
    MESSAGE_OWN_WRONG(6),
    BOT_MESSAGE(7)
}