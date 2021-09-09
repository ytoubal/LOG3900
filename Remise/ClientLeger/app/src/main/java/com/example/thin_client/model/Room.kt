package com.example.thin_client.model

data class Room(
    var name: String,
    var history: ArrayList<Message>? = null,
    var admin: String? = null,
    var isAdmin: Boolean? = null,
    var isJoined: Boolean = false,
    var notification: Int = 0,
    var isLobby: Boolean = false
)

data class QuitRoom(val username: String, val room: String)