package com.example.thin_client.fragment

import android.media.MediaPlayer
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.Volley
import com.example.thin_client.*
import com.example.thin_client.adapter.ChatRoomAdapter
import com.example.thin_client.model.*
import com.example.thin_client.view_model.UserViewModel
import com.google.android.material.snackbar.Snackbar
import com.google.android.material.textfield.TextInputEditText
import com.google.gson.Gson
import io.socket.emitter.Emitter

class ChatFragment(
    private val isLobbyChat: Boolean,
    val room: Room,
    val isTutorial: Boolean = false
) : Fragment(), TextWatcher, RecyclerViewChatListener {
    val user: UserViewModel by activityViewModels()

    private lateinit var roomName: TextView
    var messageList: ArrayList<Message> = arrayListOf()
    private var displayMessages: ArrayList<Message> = arrayListOf()
    private lateinit var chatRoomAdapter: ChatRoomAdapter
    private lateinit var recyclerView: RecyclerView
    private lateinit var userConnected: User
    private lateinit var textBox: TextInputEditText
    lateinit var send: ImageButton
    lateinit var roomsButton: Button
    private lateinit var leaveButton: Button
    private lateinit var notificationBadge: TextView
    val socket = ChatSocket()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        socket.init()
        socket.socket.on("send-message", onSendMessage)
        socket.socket.on("user-joined", onUserJoin)
        socket.socket.on("logout", onUserLeave)
        socket.socket.on("delete-room", onDeleteRoom)

        room.name = if (isLobbyChat) "$" + "$" + "_" + room.name + "_$$" else room.name
        userConnected = User(user.userConnection.username, room.name)

        socket.socket.emit("user-joined", Gson().toJson(userConnected))

        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_chat, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        roomsButton = view.findViewById(R.id.rooms)

        textBox = view.findViewById(R.id.user_message)!!
        textBox.addTextChangedListener(this)

        roomName = view.findViewById(R.id.Chatroom_name)
        roomName.text = room.name.replace("$", "").replace("_", "")

        notificationBadge = view.findViewById(R.id.badge_textView)
        notificationBadge.visibility = View.GONE

        chatRoomAdapter = ChatRoomAdapter(
            activity?.baseContext!!,
            displayMessages,
            this,
            MainActivity.Settings.isDarkTheme
        )
        recyclerView = view.findViewById(R.id.recyclerView)
        recyclerView.adapter = chatRoomAdapter

        val layoutManager = LinearLayoutManager(requireContext())
        recyclerView.layoutManager = layoutManager

        if (!room.isLobby && !isTutorial && messageList.size != 0) displayMessages.add(
            Message(
                "",
                "",
                messageType = MessageType.LOAD_MESSAGES
            )
        )
        for (message in messageList) {
            if (message.messageType == null) {
                var type =
                    if (user.userConnection.username.equals(message.sender)) MessageType.MESSAGE_OWN else MessageType.MESSAGE_OTHER
                message.messageType = type
            }
        }

        if (room.isLobby) {
            displayMessages.clear()
            displayMessages.addAll(messageList)
            addItemToRecyclerView()
        }

        addItemToRecyclerView()

        leaveButton = view.findViewById(R.id.leave_room)
        if (isLobbyChat || room.isLobby) leaveButton.visibility = View.GONE

        if (isTutorial) roomsButton.visibility = View.INVISIBLE

        roomsButton.setOnClickListener {
            val fm: FragmentManager = parentFragmentManager

            fm.beginTransaction().hide(this).commit()

            if (fm.findFragmentByTag("rooms") != null) {
                val roomFragment = fm.findFragmentByTag("rooms") as RoomFragment
                fm.beginTransaction()
                    .setCustomAnimations(android.R.animator.fade_in, android.R.animator.fade_out)
                    .show(roomFragment).commit()
                request()
            }
        }


        if (room.name.equals("General") || room.admin.equals(user.userPublic.username))
            leaveButton.visibility = View.GONE

        leaveButton.setOnClickListener {
            val fm: FragmentManager = parentFragmentManager

            if (getRoomsFragment() != null) {
                val roomFragment = fm.findFragmentByTag("rooms") as RoomFragment
                fm.beginTransaction().remove(this).commit()
                fm.beginTransaction()
                    .setCustomAnimations(android.R.animator.fade_in, android.R.animator.fade_out)
                    .show(roomFragment).commit()
                user.userConnection.rooms.removeAt(user.userConnection.rooms.indexOfFirst { roomName ->
                    roomName.equals(
                        room.name
                    )
                })
                request()
                socket.socket.emit(
                    "quit-room",
                    Gson().toJson(QuitRoom(user.userPublic.username, room.name))
                )
                socket.socket.disconnect()
                if (user.userConnection.username.equals(room.admin)) {
                    socket.socket.emit("delete-room", room.name)
                }
            }
        }

        send = view.findViewById(R.id.send_button)
        setSendListener()

        request()

        if (isLobbyChat) {
            leaveButton.visibility = View.GONE
        }
    }

    fun setSendListener() {
        send.setOnClickListener {
            var messageText =
                view?.findViewById<TextInputEditText>(R.id.user_message)?.text.toString().trim()
            if (messageText != "" && !isTutorial) {
                var message = Message(
                    messageText,
                    userConnected.username,
                    "timeeeeee",
                    room = room.name,
                    avatar = user.userPublic.avatar
                )
                socket.sendMessage(message)
                view?.findViewById<EditText>(R.id.user_message)?.setText("")
            } else if (messageText != "" && isTutorial) {
                var message = Message(
                    messageText,
                    userConnected.username,
                    "",
                    room = room.name,
                    avatar = user.userPublic.avatar
                )
                addItemToRecyclerView(message)
            }
        }
    }

    fun request() {
        val queue = Volley.newRequestQueue(requireContext())
        val url = Constants.URL + "database/all-rooms"

        val fm: FragmentManager = parentFragmentManager

        val roomFragment = (fm.findFragmentByTag("rooms") as RoomFragment)

        val request = JsonArrayRequest(Request.Method.GET, url, null,
            Response.Listener { response ->
                var result = Gson().fromJson(response.toString(), Array<Room>::class.java).toList()

                // TODO: for the disappearing lobby chat: owner == null && name != general or constant or smt
                roomFragment.rooms.clear()

                if (roomFragment.lobbyRoom != null) {
                    roomFragment.lobbyRoom!!.notification = 0
                    roomFragment.rooms.add(roomFragment.lobbyRoom!!)
                }

                roomFragment.rooms.addAll(result)

                for (room in roomFragment.rooms) {
                    room.isAdmin = room.admin == user.userConnection.username
                    room.isJoined =
                        user.userConnection.rooms.find { roomName -> room.name.equals(roomName) } != null
                    if (room.isAdmin == true) {
                        room.isJoined = true
                    }
                }
                roomFragment.notifyItemToRecyclerView()
            },
            Response.ErrorListener {
                displaySnackbarMessage(context?.getString(R.string.generic_error_message)!!)
            })
        queue.add(request)
    }

    private fun displaySnackbarMessage(message: String) {
        val snackbar = Snackbar.make(requireView(), message, Snackbar.LENGTH_SHORT)
        snackbar.setTextColor(activity?.getColor(R.color.black)!!)
        snackbar.show()
    }

    fun addItemToRecyclerView(message: Message? = null) {
        activity?.runOnUiThread {
            if (message != null) {
                messageList.add(message)
                if (room.isLobby) room.history?.add(message)
                displayMessages.add(message)
            }
            chatRoomAdapter.notifyDataSetChanged()
            recyclerView.scrollToPosition(displayMessages.size - 1) //move focus on last message
        }
    }

    private var onSendMessage = Emitter.Listener {
        var message: Message = Gson().fromJson(it[0].toString(), Message::class.java)
        view?.post {
            val fm: FragmentManager = parentFragmentManager

            if (message.room.equals(room.name)) {
                val type =
                    if (user.userConnection.username.equals(message.sender)) MessageType.MESSAGE_OWN else MessageType.MESSAGE_OTHER
                message.messageType = type
                if (message.messageType == MessageType.MESSAGE_OWN &&
                    isLobbyChat && fm.findFragmentByTag("game") != null
                ) {
                    (fm.findFragmentByTag("game") as GameFragment).checkMessage(message)
                    if ((fm.findFragmentByTag("game") as GameFragment).currentRole == Role.Guessing ||
                        (fm.findFragmentByTag("game") as GameFragment).currentRole == Role.Replying
                    ) {
                        val guessValue =
                            (fm.findFragmentByTag("game") as GameFragment).checkGuess(message)
                        if (guessValue.equals("correct")) {
                            message.messageType = MessageType.MESSAGE_OWN_CORRECT
                        } else if (guessValue.equals("incorrect")) {
                            message.messageType = MessageType.MESSAGE_OWN_WRONG
                        }
                    }
                } else if (arrayListOf(
                        "Botliver",
                        "YanisBot",
                        "NhienBot",
                        "Botlice",
                        "YuhanBot",
                        "CharlesBot"
                    ).contains(message.sender)
                ) {
                    message.messageType = MessageType.BOT_MESSAGE
                }


                if (message.messageType.equals(MessageType.MESSAGE_OTHER) ||
                    message.messageType.equals(MessageType.BOT_MESSAGE)
                ) {
                    val player = MediaPlayer.create(context, R.raw.message)
                    player.start()
                    if (!this.isVisible)
                        (fm.findFragmentByTag("rooms") as RoomFragment).addNotification(message.room)
                }

                addItemToRecyclerView(message)
            }
        }
    }

    private var onUserJoin = Emitter.Listener {
        // Not used
    }

    private var onUserLeave = Emitter.Listener {
        // Not used
    }

    private var onDeleteRoom = Emitter.Listener {
        view?.post {
            val roomName = it[0] as String
            if (roomName.equals(room.name)) {
                val fm: FragmentManager = parentFragmentManager
                //if (this.isVisible) {
                    fm.beginTransaction().remove(this).commit()
                //}
                if (fm.findFragmentByTag("rooms") != null) {
                    (fm.findFragmentByTag("rooms") as RoomFragment).roomDeletedNotification(roomName)
                    if (fm.findFragmentByTag("chat" + room.name)?.isVisible!!) {
                        val roomFragment = fm.findFragmentByTag("rooms") as RoomFragment
                        fm.beginTransaction()
                            .setCustomAnimations(
                                android.R.animator.fade_in,
                                android.R.animator.fade_out
                            )
                            .show(roomFragment).commit()
                        request()
                        roomFragment.notifyItemToRecyclerView()
                    }
                }
            }
        }
    }

    fun updateNotifications(isFromRooms: Boolean = false) {
        if (isFromRooms) {
            activity?.runOnUiThread {
                notificationBadge.visibility =
                    if (room.notification == 0) View.GONE else View.VISIBLE
                notificationBadge.text = room.notification.toString()
            }
        } else {
            val numberOfNotifications = notificationBadge.text.toString().toInt()
            activity?.runOnUiThread {
                notificationBadge.text = (numberOfNotifications + 1).toString()
                notificationBadge.visibility = View.VISIBLE
            }
        }

    }

    override fun onDestroy() {
        super.onDestroy()
        socket.socket.emit("logout", Gson().toJson(userConnected.username))
        //socket.socket.disconnect()
    }

    override fun afterTextChanged(s: Editable?) {
        //unused
    }

    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
        //unused
    }

    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
        if (s != null) {
            when {
                s.trim().isEmpty() -> {
                    send.isEnabled = false
                }
                else -> {
                    send.isEnabled = true
                }
            }
        }
    }

    override fun onLoadMessagesClicked(v: View, p: Int) {
        displayMessages.clear()
        displayMessages.addAll(messageList)
        addItemToRecyclerView()
    }


    private fun getRoomsFragment(): Fragment? {
        val fm: FragmentManager = parentFragmentManager
        return fm.findFragmentByTag("rooms")
    }
}
