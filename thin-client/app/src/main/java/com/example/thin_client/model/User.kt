package com.example.thin_client.model

//TODO refactor

data class User(val username: String, var room: String = "232")

data class UserInfo(val connection: Connection, val public: Public, val private: Private)

data class Connection(
    var username: String,
    var password: String,
    var socketId: String = "",
    var isConnected: Boolean = false,
    var rooms: ArrayList<String> = arrayListOf()
)

data class Public(
    var username: String,
    var avatar: String,
    var pointsXP: Int = 0,
    var album: Array<Drawing> = arrayOf(),
    var border: String = "border0",
    var title: String = ""
)

data class Private(
    var firstName: String,
    var lastName: String,
    val gameStats: GameStats,
    val connections: ArrayList<Array<String>>? = null
)

data class UserLeaderboard(val user: Public, val rank: Int, val isOwnUser: Boolean)

class UserUpdate(
    val username: String,
    val firstName: String,
    val lastName: String,
    val avatar: String,
    val border: String,
    val title: String
)

data class Drawing(val drawing: String, val word: String)