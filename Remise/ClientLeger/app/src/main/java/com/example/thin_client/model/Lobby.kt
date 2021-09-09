package com.example.thin_client.model

data class Lobby(
    val name: String,
    val owner: String,
    val difficulty: String,
    var users: ArrayList<Public> = arrayListOf(),
    val rounds: Int
)

data class LobbyUser(val name: String, val user: Public)

data class TeamPlayer(
    val playerName: String,
    val playerAvatar: String,
    val isTeam1: Boolean,
    val lobbyName: String
)

data class LobbyGame(val name: String, val rounds: Int, val difficulty: String)