package com.example.thin_client.model

data class Game(
    val username: String,
    val nbVictories: Int,
    val time: Int,
    val mode: String,
    val score: Array<Int>,
    val users: ArrayList<Public>,
    val diff: String
)

data class GameStats(
    val gamesPlayed: Int = 0,
    val gamesWon: Int = 0,
    val totalGameTime: Int = 0,
    val allGames: ArrayList<GameHistory> = arrayListOf()
)

data class GameHistory(
    val date: String,
    val time: Int,
    val gameMode: String,
    val scoreClassic: ArrayList<Int>,
    val usersPlayedWith: ArrayList<Public>,
    val difficulty: String
)

data class GamePoint(val name: String, val team: Int, val guesser: String)

data class GameUserPoint(val team: Int, val guesser: String)

data class BotMessage(val lobbyName: String, val state: Int, val sender: String)