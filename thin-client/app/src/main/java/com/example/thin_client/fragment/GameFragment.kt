package com.example.thin_client.fragment

import android.annotation.SuppressLint
import android.graphics.Color
import android.media.MediaPlayer
import android.os.Bundle
import android.os.CountDownTimer
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.activityViewModels
import com.example.thin_client.ChatSocket
import com.example.thin_client.R
import com.example.thin_client.dialog.CountDownDialog
import com.example.thin_client.dialog.GameSummaryDialog
import com.example.thin_client.dialog.LevelUpDialog
import com.example.thin_client.helper.AvatarHelper
import com.example.thin_client.helper.LevelHelper
import com.example.thin_client.model.*
import com.example.thin_client.view_model.UserViewModel
import com.google.gson.Gson
import io.socket.emitter.Emitter
import nl.dionsegijn.konfetti.KonfettiView
import nl.dionsegijn.konfetti.models.Shape
import nl.dionsegijn.konfetti.models.Size


class GameFragment(
    val lobby: Lobby,
    val teamComp: ArrayList<String>,
    val words: Array<String>,
    val hints: Array<Array<String>>,
    val team1HasBot: Boolean,
    val team2HasBot: Boolean,
    val isTutorial: Boolean = false
) : Fragment() {

    private val user: UserViewModel by activityViewModels()
    lateinit var currentRoundView: TextView
    lateinit var timerView: TextView
    lateinit var currentWordView: TextView
    lateinit var currentRoleView: TextView
    lateinit var currentScoreView: TextView
    private lateinit var game_message: TextView
    private lateinit var teams: Array<Pair<TextView, ImageView>>
    private lateinit var player1_team1username: TextView
    private lateinit var player2_team1username: TextView
    private lateinit var player1_team2username: TextView
    private lateinit var player2_team2username: TextView
    private lateinit var player1_team1avatar: ImageView
    private lateinit var player2_team1avatar: ImageView
    private lateinit var player1_team2avatar: ImageView
    private lateinit var player2_team2avatar: ImageView
    private lateinit var askHint: Button
    private var teams_public: ArrayList<Public> = arrayListOf()

    var currentRound = 1
    var currentTries = getNumberOfTries()
    var teamNumber: Int = 0
    var teamPosition: Int = 0
    lateinit var currentRole: Role
    private lateinit var previousRole: Role
    private var gameSeconds: Int = 0
    private lateinit var timer: CountDownTimer
    private lateinit var roundTimer: CountDownTimer
    private lateinit var replyTimer: CountDownTimer
    lateinit var drawFragment: DrawFragment
    private var maxRound = lobby.rounds
    private var maxTries = getNumberOfTries()
    var score = arrayOf(0, 0)
    private var isWordGuessed = false
    private val roundDuration = getRoundDuration()
    private val replyDuration = 10000L
    private var currentTeamHasBot = false
    private var currentHint = 0
    val socket = ChatSocket()

    private lateinit var viewKonfetti: KonfettiView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_game, container, false)
    }

    @SuppressLint("ResourceAsColor")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        currentRoundView = activity?.findViewById(R.id.game_current_round)!!
        timerView = activity?.findViewById(R.id.game_current_timer)!!
        currentWordView = activity?.findViewById(R.id.game_current_word)!!
        currentRoleView = activity?.findViewById(R.id.game_current_role)!!
        currentScoreView = activity?.findViewById(R.id.game_score)!!
        game_message = view.findViewById(R.id.game_message)

        player1_team1username = view.findViewById(R.id.team1player1_username)
        player1_team1avatar = view.findViewById(R.id.team1player1_avatar)
        player2_team1username = view.findViewById(R.id.team1player2_username)
        player2_team1avatar = view.findViewById(R.id.team1player2_avatar)
        player1_team2username = view.findViewById(R.id.team2player1_username)
        player1_team2avatar = view.findViewById(R.id.team2player1_avatar)
        player2_team2username = view.findViewById(R.id.team2player2_username)
        player2_team2avatar = view.findViewById(R.id.team2player2_avatar)
        askHint = view.findViewById(R.id.ask_hint_game_button)
        askHint.visibility = View.GONE
        askHint.setOnClickListener {
            view.post {
                val fm: FragmentManager = parentFragmentManager
                val index = ((teamNumber - 1) * 2) + ((teamPosition + 1) % 2)
                val botName = teamComp[index]
                val message = Message(
                    hints[currentRound - 1][currentHint++],
                    botName,
                    room = lobby.name,
                    avatar = "virtual_player"
                )
                val lobbyChat = fm.findFragmentByTag("chat" + lobby.name)
                if (lobbyChat != null) {
                    message.messageType = MessageType.MESSAGE_OTHER
                    (lobbyChat as ChatFragment).addItemToRecyclerView(message)
                }
            }
            activity?.runOnUiThread {
                askHint.isEnabled = currentHint != hints[currentRound - 1].size - 1
            }
        }

        viewKonfetti = view.findViewById(R.id.viewKonfetti)

        teams = arrayOf(
            Pair(player1_team1username, player1_team1avatar),
            Pair(player2_team1username, player2_team1avatar),
            Pair(player1_team2username, player1_team2avatar),
            Pair(player2_team2username, player2_team2avatar)
        )

        for ((i, teamPlayer) in teamComp.withIndex()) {
            val player = lobby.users.find { user -> user.username.equals(teamPlayer) }
            if (player != null && player.username.equals(user.userPublic.username)) {
                teamNumber = if (i < 2) 1 else 2
                teamPosition = i % 2
            }
            if (player != null) teams_public.add(player)
            teams[i].first.text = player?.username ?: ""
            teams[i].second.setImageResource(AvatarHelper.getAvatarId(player?.avatar ?: ""))
        }

        drawFragment = childFragmentManager.fragments[0] as DrawFragment
        drawFragment.socket = socket

        if (!isTutorial) {
            activity?.findViewById<ImageButton>(R.id.ic_back)?.visibility = View.GONE
            if (teamNumber == 1) {
                if (team1HasBot) {
                    currentTeamHasBot = true
                    currentRole = Role.Guessing
                    previousRole = Role.Guessing
                } else {
                    currentRole = if (teamPosition == 0) Role.HumanDrawing else Role.Guessing
                    previousRole =
                        if (currentRole == Role.HumanDrawing) Role.Guessing else Role.HumanDrawing
                }
            } else {
                if (team2HasBot) {
                    currentTeamHasBot = true
                    currentRole = Role.Spectating
                    previousRole = Role.Guessing
                } else {
                    currentRole = Role.Spectating
                    previousRole = if (teamPosition == 0) Role.Guessing else Role.HumanDrawing
                }
            }
            showRole()
            showWord()
            view.findViewById<TextView>(R.id.team1_header)
                .setBackgroundColor(R.color.design_default_color_primary)

            socket.init()

            socket.socket.on("round-start", onRoundStart)
            socket.socket.on("round-end", onRoundEnd)
            socket.socket.on("game-end", onGameEnd)
            socket.socket.on("guess-word", onWordGuessed)
            socket.socket.on("reply", onReply)
            socket.socket.on("bot-msg", onBotMessage)
            socket.socket.on("stop-game", onStopGame)

            socket.socket.emit("join-game", lobby.name)

            currentRoundView.text = context?.getString(R.string.round) + " $currentRound " + context?.getString(R.string.of) +" $maxRound"

            CountDownDialog().show(parentFragmentManager, "CountDownDialog")

            timer = object : CountDownTimer(1000000, 1000) {
                override fun onTick(millisUntilFinished: Long) {
                    gameSeconds += 1
                }

                override fun onFinish() {
                    // Not implemented
                }
            }
            timer.start()

            roundTimer = object : CountDownTimer(roundDuration, 1000) {
                override fun onFinish() {
                    roundTimer.cancel()
                    if (currentRole == Role.Guessing) {
                        if (isWordGuessed) {
                            startNewRound()
                        } else {
                            socket.socket.emit("reply", lobby.name)
                        }
                    }
                }

                override fun onTick(millisUntilFinished: Long) {
                    if ((millisUntilFinished / 1000).toString() == "10") {
                        val player = MediaPlayer.create(context, R.raw.ten_seconds_left)
                        player.start()
                    }
                    timerView.text = (millisUntilFinished / 1000).toString()
                }
            }

            replyTimer = object : CountDownTimer(replyDuration, 1000) {
                override fun onFinish() {
                    replyTimer.cancel()
                    if (currentRole == Role.Replying && (teamPosition == 0 || currentTeamHasBot)) {
                        startNewRound()
                    }
                }

                override fun onTick(millisUntilFinished: Long) {
                    timerView.text = (millisUntilFinished / 1000).toString()
                }
            }

            var displayWord = ""
            for (i in words[currentRound - 1].indices) {
                displayWord += "_ "
            }
            currentWordView.text = displayWord


            Handler(Looper.getMainLooper()).postDelayed({
                if (user.userPublic.username.equals(lobby.owner))
                    socket.socket.emit("round-start", lobby.name)
                drawFragment.setGameName(lobby.name)
                if (currentTeamHasBot) {
                    val index = ((teamNumber - 1) * 2) + ((teamPosition + 1) % 2)
                    val botName = teamComp[index]
                    socket.socket.emit(
                        "bot-msg",
                        Gson().toJson(
                            BotMessage(
                                lobby.name,
                                BotMessageType.GameStart.value,
                                botName
                            )
                        )
                    )
                }
            }, 5000)
        }
    }

    val onRoundStart = Emitter.Listener {
        drawFragment.enableDrawEvent()
        roundTimer.start()
        showWord()
        activity?.runOnUiThread {
            game_message.text = ""
        }
        if (currentRole == Role.HumanDrawing) {
            drawFragment.enableCanvas()
        } else if (currentRole == Role.Guessing && currentTeamHasBot) {
            activity?.runOnUiThread {
                askHint.visibility = View.VISIBLE
                askHint.isEnabled = true
            }
            currentHint = 0
            socket.socket.emit(
                "word-image",
                Gson().toJson(WordImage(words[currentRound - 1], lobby.name))
            )
        }
        isWordGuessed = false
        currentTries = maxTries
        showRole()
    }

    val onRoundEnd = Emitter.Listener {
        showCountDown()
        activity?.runOnUiThread {
            askHint.visibility = View.GONE
        }
        if (currentTeamHasBot) {
            val index = ((teamNumber - 1) * 2) + ((teamPosition + 1) % 2)
            val botName = teamComp[index]
            socket.socket.emit(
                "bot-msg",
                Gson().toJson(
                    BotMessage(
                        lobby.name,
                        if (isWordGuessed) BotMessageType.RightGuess.value else BotMessageType.WrongGuess.value,
                        botName
                    )
                )
            )
        }
        drawFragment.clearCanvas()
        roundTimer.cancel()
        replyTimer.cancel()
        currentRound += 1
        if (currentRound <= maxRound) {
            activity?.runOnUiThread {
                currentRoundView.text = context?.getString(R.string.round) + " $currentRound " + context?.getString(R.string.of) +" $maxRound"
            }
            updateRole(currentRound)
            drawFragment.disableCanvas()
        } else {
            socket.socket.off("round-start")
            socket.socket.off("round-end")
            if (user.userConnection.username.equals(lobby.owner))
                socket.socket.emit("game-end", lobby.name)
        }
    }

    val onWordGuessed = Emitter.Listener {
        var gamePointIndex = Gson().fromJson(it[0].toString(), GameUserPoint::class.java)
        score[gamePointIndex.team]++
        showScoreBoard()
        activity?.runOnUiThread {
            if (gamePointIndex.team == 0)
                game_message.text = context?.getString(R.string.game_team1_guessed)
            else
                game_message.text = context?.getString(R.string.game_team2_guessed)

        }
    }

    val onReply = Emitter.Listener {
        drawFragment.disableCanvas()
        activity?.runOnUiThread {
            askHint.visibility = View.GONE
        }
        if (currentTeamHasBot && currentRole == Role.Guessing)
            socket.socket.emit("stop-word", lobby.name)
        roundTimer.cancel()
        currentRole = if (currentRole == Role.Spectating) Role.Replying else Role.Spectating
        showRole()

        view?.post { CountDownDialog(3).show(parentFragmentManager, "CountDownDialog") }
        Handler(Looper.getMainLooper()).postDelayed({
            replyTimer.start()
        }, 3000)
    }

    fun deleteLobbyChat() {
        val fm = parentFragmentManager
        val roomFragment = fm.findFragmentByTag("rooms") as RoomFragment
        val lobbyRoom = roomFragment.rooms.find { room -> room.isLobby == true }
        if (lobbyRoom != null) {
            val chat = fm.findFragmentByTag("chat" + lobbyRoom.name.subSequence(3, lobbyRoom.name.length - 3)
            ) as ChatFragment
//            if (lobby.owner.equals(user.userPublic.username)) {
//                chat.socket.socket.emit("delete-room", lobbyRoom.name)
//            }
            fm.beginTransaction().remove(chat)
        }
        roomFragment.lobbyRoom = null
        roomFragment.rooms.remove(lobbyRoom)
    }

    val onGameEnd = Emitter.Listener {
        timer.cancel()
        socket.socket.off("stop-game")
        if (user.userConnection.username.equals(lobby.owner))
            socket.socket.emit("delete-lobby", lobby.name)
        roundTimer.cancel()
        replyTimer.cancel()

        deleteLobbyChat()

        var outcome: String
        var nbVictories = 0
        var experience = 0
        view?.post {
            if (score.max() == score[teamNumber - 1] && !score[0].equals(score[1])) {
                experience = when (lobby.difficulty) {
                    "Easy" -> 50
                    "Medium" -> 75
                    "Hard" -> 100
                    else -> 100
                }
                loadConfetti()
                val player = MediaPlayer.create(context, R.raw.win_game)
                outcome = "win"
                nbVictories = 1
                player.start()
            } else if (score[0].equals(score[1])) {
                val player = MediaPlayer.create(context, R.raw.lose_game)
                player.start()
                outcome = "tie"
            } else {
                val player = MediaPlayer.create(context, R.raw.lose_game)
                outcome = "lose"
                player.start()
            }
            GameSummaryDialog(score, outcome, lobby.name).show(
                parentFragmentManager,
                "GameSummaryDialog"
            )

            val currentLevel = LevelHelper.getLevel(user.userPublic.pointsXP)
            user.userPublic.pointsXP += experience
            val newLevel = LevelHelper.getLevel(user.userPublic.pointsXP)
            if (currentLevel < newLevel)
                LevelUpDialog(user.userPublic.pointsXP).show(parentFragmentManager, "LevelUpDialog")

            val game = Game(
                user.userPublic.username,
                nbVictories,
                gameSeconds,
                "Classic",
                score,
                teams_public,
                this.lobby.difficulty
            )
            socket.socket.emit("game-info", Gson().toJson(game))
            socket.socket.disconnect()
        }
    }

    val onStopGame = Emitter.Listener {
        view?.post {
            socket.socket.off("stop-game")
            timer.cancel()
            if (currentTeamHasBot && currentRole == Role.Guessing)
                socket.socket.emit("stop-word", lobby.name)
            if (user.userConnection.username.equals(lobby.owner))
                socket.socket.emit("delete-lobby", lobby.name)
            roundTimer.cancel()
            replyTimer.cancel()
            deleteLobbyChat()
            GameSummaryDialog(score, "", lobby.name, true).show(
                parentFragmentManager,
                "GameSummaryDialog"
            )
        }
    }

    val onBotMessage = Emitter.Listener {
        val message = Gson().fromJson(it[0].toString(), Message::class.java)
        view?.post {
            val fm: FragmentManager = parentFragmentManager

            val lobbyChat = fm.findFragmentByTag("chat" + lobby.name)
            if (lobbyChat != null) {
                message.messageType = MessageType.MESSAGE_OTHER
                (lobbyChat as ChatFragment).addItemToRecyclerView(message)
            }
        }
        // TODO bot message notifications?
    }

    @SuppressLint("ResourceAsColor")
    fun updateRole(currentRound: Int) {
        if (currentRound % 2 == 0) { //Team 2
            if (teamNumber == 2 && !team2HasBot) {
                currentRole =
                    if (previousRole == Role.HumanDrawing) Role.Guessing else Role.HumanDrawing
            } else if (teamNumber == 1) {
                previousRole = if (currentRole == Role.Replying || currentRole == Role.Spectating) {
                    if (previousRole == Role.HumanDrawing) Role.Guessing else Role.HumanDrawing
                } else {
                    currentRole
                }
                currentRole = Role.Spectating
            } else {
                currentRole = Role.Guessing
            }
            activity?.findViewById<TextView>(R.id.team1_header)
                ?.setBackgroundColor(Color.TRANSPARENT)
            activity?.findViewById<TextView>(R.id.team2_header)
                ?.setBackgroundColor(R.color.design_default_color_primary)

        } else {
            if (teamNumber == 1 && !team1HasBot) { //Team 1 play
                currentRole =
                    if (previousRole == Role.HumanDrawing) Role.Guessing else Role.HumanDrawing
            } else if (teamNumber == 2) {
                previousRole = if (currentRole == Role.Replying || currentRole == Role.Spectating) {
                    if (previousRole == Role.HumanDrawing) Role.Guessing else Role.HumanDrawing
                } else {
                    currentRole
                }
                currentRole = Role.Spectating
            } else {
                currentRole = Role.Guessing
            }
            activity?.findViewById<TextView>(R.id.team1_header)
                ?.setBackgroundColor(R.color.design_default_color_primary)
            activity?.findViewById<TextView>(R.id.team2_header)
                ?.setBackgroundColor(Color.TRANSPARENT)
        }
        showRole()
    }

    fun checkGuess(message: Message): String {
        if (currentRole.equals(Role.Guessing)) {
            if (message.message.toLowerCase().equals(words[currentRound - 1].toLowerCase())) {
                return "correct"
            }
            return "incorrect"
        } else return ""
    }

    fun checkMessage(message: Message) {
        activity?.runOnUiThread {
            if ((currentRole.equals(Role.Guessing) || currentRole.equals(Role.Replying)) && message.sender.equals(
                    user.userPublic.username
                )
            ) {
                if (message.message.toLowerCase().equals(words[currentRound - 1].toLowerCase()) && !isWordGuessed) {
                    isWordGuessed = true
                    if (currentTeamHasBot && currentRole == Role.Guessing)
                        socket.socket.emit("stop-word", lobby.name)
                    if (currentRound < maxRound) {
                        val player = MediaPlayer.create(context, R.raw.guess_right)
                        player.start()
                    }
                    socket.socket.emit(
                        "guess-word",
                        Gson().toJson(
                            GamePoint(
                                lobby.name,
                                teamNumber - 1,
                                user.userPublic.username
                            )
                        )
                    )
                    startNewRound()
                } else if (currentRole.equals(Role.Guessing) && !isWordGuessed) {
                    --currentTries
                    showRole()
                    val player = MediaPlayer.create(context, R.raw.guess_wrong)
                    player.start()
                    if (currentTries == 0) {
                        socket.socket.emit("reply", lobby.name)
                    }
                } else if (currentRole.equals(Role.Replying) && !isWordGuessed) {
                    startNewRound()
                }
            }
        }
    }

    fun showWord() {
        var displayWord = ""
        if (currentRole == Role.HumanDrawing) {
            displayWord = words[currentRound - 1]
        } else {
            for (i in words[currentRound - 1].indices) {
                displayWord += "_ "
            }
        }
        activity?.runOnUiThread {
            currentWordView.text = displayWord
        }
    }

    fun showRole() {
        activity?.runOnUiThread {
            if (currentRole.toString().equals("HumanDrawing")) {
                currentRoleView.text = context?.getString(R.string.role_drawing)
            } else if (currentRole.toString().equals("Guessing")) {
                val guessText =
                    context?.getString(R.string.role_guessing) + " " + currentTries.toString() + "/" + maxTries.toString()
                currentRoleView.text = guessText
            } else if (currentRole.toString().equals("Spectating")) {
                currentRoleView.text = context?.getString(R.string.role_spectating)
            } else if (currentRole.toString().equals("Replying")) {
                currentRoleView.text = context?.getString(R.string.role_replying)
            }
        }
    }

    fun showScoreBoard() {
        activity?.runOnUiThread {
            currentScoreView.text = score[0].toString() + "-" + score[1].toString()
        }
    }

    fun startNewRound() {
        socket.socket.emit("round-end", lobby.name)
        Handler(Looper.getMainLooper()).postDelayed({
            socket.socket.emit("round-start", lobby.name)
        }, 5000)
    }

    fun showCountDown() {
        if (currentRound != maxRound) {
            view?.post {
                CountDownDialog().show(parentFragmentManager, "CountDownDialog")
            }
        }
    }

    fun getNumberOfTries(): Int {
        return when (lobby.difficulty) {
            "Easy" -> 10
            "Medium" -> 6
            "Hard" -> 3
            else -> 3
        }
    }

    fun getRoundDuration(): Long {
        return when (lobby.difficulty) {
            "Easy" -> 70000
            "Medium" -> 50000
            "Hard" -> 30000
            else -> 30000
        }
    }

    private fun loadConfetti() {
        viewKonfetti.build()
            .addColors(Color.YELLOW, Color.GREEN, Color.MAGENTA)
            .setDirection(0.0, 359.0)
            .setSpeed(1f, 5f)
            .setFadeOutEnabled(true)
            .setTimeToLive(2000L)
            .addShapes(Shape.RECT, Shape.CIRCLE)
            .addSizes(Size(12))
            .setPosition(-50f, viewKonfetti.width + 50f, -50f, -50f)
            .streamFor(300, 5000L)
    }
}