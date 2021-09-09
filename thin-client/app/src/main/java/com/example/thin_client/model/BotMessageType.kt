package com.example.thin_client.model

enum class BotMessageType(val value: Int) {
    GameStart(0),
    WrongGuess(1),
    RightGuess(2)
}