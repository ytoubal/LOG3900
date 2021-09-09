package com.example.thin_client.fragment

import android.app.AlertDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.core.view.isVisible
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.activityViewModels
import com.example.thin_client.ChatSocket
import com.example.thin_client.R
import com.example.thin_client.helper.AvatarHelper
import com.example.thin_client.model.*
import com.example.thin_client.view_model.UserViewModel
import com.google.android.material.snackbar.Snackbar
import com.google.gson.Gson
import io.socket.emitter.Emitter

class LobbyFragment(private val lobby: Lobby) : Fragment() {

    private lateinit var startGame: Button
    private val user: UserViewModel by activityViewModels()

    private lateinit var team1Button: Button
    private lateinit var team2Button: Button
    private lateinit var team1AddBotButton: Button
    private lateinit var team2AddBotButton: Button

    private lateinit var teams: Array<Pair<TextView, ImageView>>

    private lateinit var player1_team1username: TextView
    private lateinit var player2_team1username: TextView
    private lateinit var player1_team2username: TextView
    private lateinit var player2_team2username: TextView
    private lateinit var player1_team1avatar: ImageView
    private lateinit var player2_team1avatar: ImageView
    private lateinit var player1_team2avatar: ImageView
    private lateinit var player2_team2avatar: ImageView

    private lateinit var player1_username: TextView
    private lateinit var player2_username: TextView
    private lateinit var player3_username: TextView
    private lateinit var player4_username: TextView
    private lateinit var player1_avatar: ImageView
    private lateinit var player2_avatar: ImageView
    private lateinit var player3_avatar: ImageView
    private lateinit var player4_avatar: ImageView

    private var botsLeft =
        arrayListOf("Botliver", "YanisBot", "NhienBot", "Botlice", "YuhanBot", "CharlesBot")
    var bots = arrayListOf(
        "Botliver",
        "YanisBot",
        "NhienBot",
        "Botlice",
        "YuhanBot",
        "CharlesBot",
        "Virtual Player 1",
        "Virtual Player 2"
    )
    var team1HasBot = false
    var team2HasBot = false

    private lateinit var playerUsernames: Array<TextView>
    private lateinit var playerAvatars: Array<ImageView>
    private var teamPlayers1: Array<String> = Array(2) { "" }
    private var teamPlayers2: Array<String> = Array(2) { "" }
    private val socket = ChatSocket()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_lobby, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        startGame = view.findViewById(R.id.startGameButton)
        startGame.visibility = View.GONE
        startGame.isEnabled = false

        activity?.findViewById<ImageButton>(R.id.ic_tutorial)?.visibility = View.GONE
        activity?.findViewById<ImageButton>(R.id.ic_leaderboard)?.visibility = View.GONE
        activity?.findViewById<ImageButton>(R.id.ic_profile)?.visibility = View.GONE
        activity?.findViewById<ImageButton>(R.id.ic_settings)?.visibility = View.GONE

        socket.init()

        activity?.findViewById<ImageButton>(R.id.ic_back)?.setOnClickListener {
            if (user.userConnection.username.equals(lobby.owner)) {
                val builder = AlertDialog.Builder(context)
                val dialog = builder
                    .setTitle(context?.getString(R.string.quit_lobby_label))
                    .setMessage(context?.getString(R.string.quit_lobby_question))
                    .setPositiveButton(
                        context?.getString(R.string.cancel), null)
                    .setNegativeButton(
                        context?.getString(R.string.leave_chat)
                    ) { _, _ ->
                        quitLobby()
                        socket.socket.emit(
                            "quit-lobby",
                            Gson().toJson(LobbyUser(lobby.name, user.userPublic))
                        )
                        if (user.userConnection.username.equals(lobby.owner))
                            socket.socket.emit("delete-lobby", lobby.name)
                    }
                    .create()

                dialog.show()
                dialog.getButton(AlertDialog.BUTTON_NEGATIVE)
                    .setBackgroundColor(resources.getColor(R.color.dark_middle_blue, null))
                dialog.getButton(AlertDialog.BUTTON_NEGATIVE)
                    .setTextColor(resources.getColor(R.color.white, null))
                dialog.getButton(AlertDialog.BUTTON_POSITIVE)
                    .setBackgroundColor(resources.getColor(R.color.red, null))
                dialog.getButton(AlertDialog.BUTTON_POSITIVE)
                    .setTextColor(resources.getColor(R.color.white, null))
            } else {
                quitLobby()
                socket.socket.emit(
                    "quit-lobby",
                    Gson().toJson(LobbyUser(lobby.name, user.userPublic))
                )
            }

        }
        player1_team1username = view.findViewById(R.id.team1player1_username)
        player1_team1avatar = view.findViewById(R.id.team1player1_avatar)
        player2_team1username = view.findViewById(R.id.team1player2_username)
        player2_team1avatar = view.findViewById(R.id.team1player2_avatar)
        player1_team2username = view.findViewById(R.id.team2player1_username)
        player1_team2avatar = view.findViewById(R.id.team2player1_avatar)
        player2_team2username = view.findViewById(R.id.team2player2_username)
        player2_team2avatar = view.findViewById(R.id.team2player2_avatar)

        team1AddBotButton = view.findViewById(R.id.team1_add_bot_button)
        team2AddBotButton = view.findViewById(R.id.team2_add_bot_button)
        team1AddBotButton.text = context?.getString(R.string.add_bot)
        team2AddBotButton.text = context?.getString(R.string.add_bot)


        teams = arrayOf(
            Pair(player1_team1username, player1_team1avatar),
            Pair(player2_team1username, player2_team1avatar),
            Pair(player1_team2username, player1_team2avatar),
            Pair(player2_team2username, player2_team2avatar)
        )

        team1Button = view.findViewById(R.id.joinTeam1)
        team2Button = view.findViewById(R.id.joinTeam2)

        player1_username = view.findViewById(R.id.player1_username)
        player1_avatar = view.findViewById(R.id.player1_avatar)
        player2_username = view.findViewById(R.id.player2_username)
        player2_avatar = view.findViewById(R.id.player2_avatar)
        player3_username = view.findViewById(R.id.player3_username)
        player3_avatar = view.findViewById(R.id.player3_avatar)
        player4_username = view.findViewById(R.id.player4_username)
        player4_avatar = view.findViewById(R.id.player4_avatar)
        playerUsernames =
            arrayOf(player1_username, player2_username, player3_username, player4_username)
        playerAvatars = arrayOf(player1_avatar, player2_avatar, player3_avatar, player4_avatar)

        updateUsers()

        if (user.userPublic.username == lobby.owner) {
            startGame.visibility = View.VISIBLE
        }

        startGame.setOnClickListener {
            socket.socket.emit(
                "start-game",
                Gson().toJson(LobbyGame(lobby.name, lobby.rounds, lobby.difficulty))
            )
        }

        team1Button.setOnClickListener {
            socket.socket.emit(
                "join-team",
                Gson().toJson(
                    TeamPlayer(
                        user.userPublic.username,
                        user.userPublic.avatar,
                        true,
                        lobby.name
                    )
                )
            )
        }

        team2Button.setOnClickListener {
            socket.socket.emit(
                "join-team",
                Gson().toJson(
                    TeamPlayer(
                        user.userPublic.username,
                        user.userPublic.avatar,
                        false,
                        lobby.name
                    )
                )
            )
        }

        team1AddBotButton.setOnClickListener {
            //team1AddBotButton.isEnabled = false
            if (!team1HasBot) {
                team1HasBot = true
                val bot = botsLeft[(0 until botsLeft.size).random()]
                botsLeft.remove(bot)
                socket.socket.emit(
                    "join-lobby",
                    Gson().toJson(LobbyUser(lobby.name, Public(bot, "virtual_player")))
                )
                socket.socket.emit(
                    "join-team",
                    Gson().toJson(TeamPlayer(bot, "virtual_player", true, lobby.name))
                )
                team1AddBotButton.text = context?.getString(R.string.remove_bot)
            } else {
                team1HasBot = false
                if (bots.contains(teamPlayers1[0])) {
                    socket.socket.emit(
                        "quit-lobby",
                        Gson().toJson(
                            LobbyUser(
                                lobby.name,
                                Public(teamPlayers1[0], "virtual_player")
                            )
                        )
                    )
                    botsLeft.add(teamPlayers1[0])
                } else {
                    socket.socket.emit(
                        "quit-lobby",
                        Gson().toJson(
                            LobbyUser(
                                lobby.name,
                                Public(teamPlayers1[1], "virtual_player")
                            )
                        )
                    )
                    botsLeft.add(teamPlayers1[1])
                }
                team1AddBotButton.text = context?.getString(R.string.add_bot)
            }
        }

        team2AddBotButton.setOnClickListener {
            if (!team2HasBot) {
                team2HasBot = true
                val bot = botsLeft[(0 until botsLeft.size).random()]
                botsLeft.remove(bot)
                socket.socket.emit(
                    "join-lobby",
                    Gson().toJson(LobbyUser(lobby.name, Public(bot, "virtual_player")))
                )
                socket.socket.emit(
                    "join-team",
                    Gson().toJson(TeamPlayer(bot, "virtual_player", false, lobby.name))
                )
                team2AddBotButton.text = context?.getString(R.string.remove_bot)
            } else {
                team2HasBot = false
                if (bots.contains(teamPlayers2[0])) {
                    socket.socket.emit(
                        "quit-lobby",
                        Gson().toJson(
                            LobbyUser(
                                lobby.name,
                                Public(teamPlayers2[0], "virtual_player")
                            )
                        )
                    )
                    botsLeft.add(teamPlayers2[0])
                } else {
                    socket.socket.emit(
                        "quit-lobby",
                        Gson().toJson(
                            LobbyUser(
                                lobby.name,
                                Public(teamPlayers2[1], "virtual_player")
                            )
                        )
                    )
                    botsLeft.add(teamPlayers2[1])
                }
                team2AddBotButton.text = context?.getString(R.string.add_bot)
            }
        }

        if (lobby.owner.equals(user.userPublic.username)) {
            team1AddBotButton.isEnabled = true
            team2AddBotButton.isEnabled = true
        } else {
            team1AddBotButton.isVisible = false
            team2AddBotButton.isVisible = false
            team1AddBotButton.isEnabled = false
            team2AddBotButton.isEnabled = false
        }

//        socket.socket.on("user-joined", onUserJoin)
        socket.socket.on("join-lobby", onUserJoin)
        socket.socket.on("teams-info", onTeamsInfo)
        socket.socket.emit("join-lobby", Gson().toJson(LobbyUser(lobby.name, user.userPublic)))

        socket.socket.on("quit-lobby", onUserQuit)
        socket.socket.on("start-game", onStartGame)

        socket.socket.on("join-team", onTeamJoin)
        socket.socket.on("delete-lobby", onLobbyDeleted)

        if (!lobby.owner.equals(user.userConnection.username)) {
            socket.socket.on("teams-info", onTeamsInfo)
        }

        createChat()
    }

    private var onUserJoin = Emitter.Listener {
        val userPublic = Gson().fromJson(it[0].toString(), Public::class.java)
        activity?.runOnUiThread {
            if (lobby.owner.equals(user.userConnection.username))
                onSendTeamsInfo()
            if (!userPublic.username.equals(user.userPublic.username)
                    || (userPublic.username.equals(user.userPublic.username)
                            && !user.userPublic.username.equals(lobby.owner))) {
                lobby.users.add(userPublic)
                playerUsernames[lobby.users.size - 1].text = userPublic.username
                val avatarNull = if (userPublic.avatar != null) userPublic.avatar else ""
                playerAvatars[lobby.users.size - 1].setImageResource(AvatarHelper.getAvatarId(avatarNull))
            }
        }
    }

    private var onUserQuit = Emitter.Listener {
        val user = it[0].toString()
        if (lobby.owner.equals(user)) {
            quitLobby()
        }
        activity?.runOnUiThread {
            val indexUser =
                lobby.users.indexOfFirst { userToRemove -> userToRemove.username.equals(user) }
            if (indexUser != -1) {
                lobby.users.removeAt(indexUser)
                val team1Index = teamPlayers1.indexOfFirst { playerName -> playerName.equals(user) }
                val team2Index = teamPlayers2.indexOfFirst { playerName -> playerName.equals(user) }
                if (team1Index != -1) {
                    teamPlayers1[team1Index] = ""
                    teams[team1Index].first.text = ""
                    teams[team1Index].second.setImageResource(AvatarHelper.getAvatarId(""))

                } else if (team2Index != -1) {
                    teamPlayers2[team2Index] = ""
                    teams[team2Index + 2].first.text = ""
                    teams[team2Index + 2].second.setImageResource(AvatarHelper.getAvatarId(""))
                }
                updateUsers()
                setJoinButtons()
                checkNumberOfPlayers()
            }
        }
    }

    private var onTeamsInfo = Emitter.Listener {
        socket.socket.off("teams-info")
        var teamPlayers = Gson().fromJson(it[0].toString(), Array<String>::class.java).toList()
        activity?.runOnUiThread {
            teamPlayers1[0] = teamPlayers[0]
            teamPlayers1[1] = teamPlayers[1]
            teamPlayers2[0] = teamPlayers[2]
            teamPlayers2[1] = teamPlayers[3]

            for ((i, player) in teamPlayers.withIndex()) {

                val playerPublic = lobby.users.find { user -> user.username.equals(player) }

                teams[i].first.text = playerPublic?.username ?: ""
                teams[i].second.setImageResource(
                    AvatarHelper.getAvatarId(
                        playerPublic?.avatar ?: ""
                    )
                )
            }

            setJoinButtons()
        }
    }

    private fun setJoinButtons() {
        team1Button.isEnabled = false
        team2Button.isEnabled = false
        if (teamPlayers2.contains("") && !teamPlayers2.contains(user.userConnection.username)) {
            team2Button.isEnabled = true
        }

        if (teamPlayers1.contains("") && !teamPlayers1.contains(user.userConnection.username)) {
            team1Button.isEnabled = true
        }
    }

    private fun onSendTeamsInfo() {
        val teams = arrayListOf<String>()
        teams.addAll(teamPlayers1)
        teams.addAll(teamPlayers2)
        socket.socket.emit("teams-info", Gson().toJson(teams))
    }

    private var onStartGame = Emitter.Listener {
        val words = Gson().fromJson(it[0].toString(), Array<String>::class.java)
        val hint = Gson().fromJson(it[1].toString(), Array<Array<String>>::class.java)
        socket.socket.off()
        startGame(words, hint)
    }

    private var onLobbyDeleted = Emitter.Listener {
        quitLobby()
    }

    fun quitLobby() {
        activity?.runOnUiThread {
            view?.post {
                val fm: FragmentManager = parentFragmentManager
                val roomFragment = fm.findFragmentByTag("rooms") as RoomFragment
                roomFragment.lobbyRoom = null

                fm.beginTransaction().remove(fm.findFragmentByTag("chat" + lobby.name)!!).commit()

                for (room in roomFragment.rooms) {
                    if (fm.findFragmentByTag("chat" + room.name) != null
                        && fm.findFragmentByTag("chat" + room.name)?.isVisible!!
                    ) {
                        fm.beginTransaction()
                            .hide(fm.findFragmentByTag("chat" + room.name) as ChatFragment).commit()
                        break
                    }
                }

                if (!roomFragment.isVisible) {
                    fm.beginTransaction().show(roomFragment).commit()
                }

                roomFragment.rooms.removeAt(0)
                roomFragment.notifyItemToRecyclerView()
                fm.beginTransaction().replace(R.id.main_fragment, LobbyMenuFragment()).commit()
            }
        }
    }

    private fun updateUsers() {
        for (i in 0..3) {
            playerUsernames[i].text = ""
            playerAvatars[i].setImageResource(AvatarHelper.getAvatarId(""))
        }

        for ((i, player) in lobby.users.withIndex()) {
            playerUsernames[i].text = player.username
            playerAvatars[i].setImageResource(AvatarHelper.getAvatarId(player.avatar))
        }
    }

    private fun startGame(words: Array<String>, hints: Array<Array<String>>) {
        view?.post {
            if (bots.contains(teamPlayers1[0]) || bots.contains(teamPlayers1[1])) {
                team1HasBot = true
            }
            if (bots.contains(teamPlayers2[0]) || bots.contains(teamPlayers2[1])) {
                team2HasBot = true
            }
            val fm: FragmentManager = parentFragmentManager
            val teams = arrayListOf<String>()
            teams.addAll(teamPlayers1)
            teams.addAll(teamPlayers2)
            val game = GameFragment(lobby, teams, words, hints, team1HasBot, team2HasBot)
            fm.beginTransaction().replace(R.id.main_fragment, game, "game").commit()
        }
    }

    private var onTeamJoin = Emitter.Listener {
        activity?.runOnUiThread {
            val player = Gson().fromJson(it[0].toString(), TeamPlayer::class.java)

            if (player.isTeam1 && teamPlayers1.contains("")) {
                val indexTeam2 =
                    teams.indexOfFirst { newPlayer -> player.playerName.equals(newPlayer.first.text) }
                if (indexTeam2 != -1) {
                    teams[indexTeam2].first.text = ""
                    teams[indexTeam2].second.setImageResource(AvatarHelper.getAvatarId(""))
                    teamPlayers2[indexTeam2 - 2] = ""
                }
                val team1Index = if (teams[0].first.text.equals("")) 0 else 1
                teams[team1Index].first.text = player.playerName
                teams[team1Index].second.setImageResource(AvatarHelper.getAvatarId(player.playerAvatar))
                teamPlayers1[team1Index] = player.playerName
                team2Button.isEnabled = false
                team1Button.isEnabled = false

                if (teamPlayers1.contains("") && !teamPlayers1.contains(user.userConnection.username)) {
                    team1Button.isEnabled = true
                }

                if (teamPlayers2.contains("") && !teamPlayers2.contains(user.userConnection.username)) {
                    team2Button.isEnabled = true
                }
            } else if (teamPlayers2.contains("")) {
                val indexTeam1 =
                    teams.indexOfFirst { newPlayer -> player.playerName.equals(newPlayer.first.text) }
                if (indexTeam1 != -1) {
                    teams[indexTeam1].first.text = ""
                    teams[indexTeam1].second.setImageResource(AvatarHelper.getAvatarId(""))
                    teamPlayers1[indexTeam1] = ""
                }
                val team2Index = if (teams[2].first.text.equals("")) 0 else 1
                teams[team2Index + 2].first.text = player.playerName
                teams[team2Index + 2].second.setImageResource(AvatarHelper.getAvatarId(player.playerAvatar))
                teamPlayers2[team2Index] = player.playerName
                team2Button.isEnabled = false
                team1Button.isEnabled = false

                if (teamPlayers2.contains("") && !teamPlayers2.contains(user.userConnection.username)) {
                    team2Button.isEnabled = true
                }

                if (teamPlayers1.contains("") && !teamPlayers1.contains(user.userConnection.username)) {
                    team1Button.isEnabled = true
                }
            }
            checkNumberOfPlayers()
        }
    }

    private fun createChat() {
        val roomLobby = Room(lobby.name, isLobby = true)
        roomLobby.history = arrayListOf()

        val fm: FragmentManager = parentFragmentManager

        if (fm.findFragmentByTag("rooms") != null) {
            val roomFragment = fm.findFragmentByTag("rooms") as RoomFragment
            roomFragment.rooms.add(roomLobby)
            roomFragment.addItemToRecyclerView()

            roomFragment.lobbyRoom = roomLobby

            if (roomFragment.isVisible) {
                fm.beginTransaction().hide((roomFragment))
            } else {
                for (room in roomFragment.rooms) {
                    if (fm.findFragmentByTag("chat" + room.name) != null) {
                        fm.beginTransaction().hide(fm.findFragmentByTag("chat" + room.name)!!)
                            .commit()
                    }
                }
            }
            user.userConnection.rooms.add(roomLobby.name)
            roomFragment.onJoinRoomClicked(activity?.findViewById(R.id.chat_container)!!, -1)
        }
    }

    fun checkNumberOfPlayers() {
        startGame.isEnabled = !(teamPlayers1.contains("") || teamPlayers2.contains(""))
        team1AddBotButton.isEnabled = teamPlayers1.contains("") || team1HasBot
        team2AddBotButton.isEnabled = teamPlayers2.contains("") || team2HasBot
    }

    private fun displaySnackbarMessage(message: String) {
        val snackbar = Snackbar.make(requireView(), message, Snackbar.LENGTH_SHORT)
        snackbar.setTextColor(activity?.getColor(R.color.black)!!)
        snackbar.show()
    }
}