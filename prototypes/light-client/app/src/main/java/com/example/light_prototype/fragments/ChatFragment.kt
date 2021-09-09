package com.example.light_prototype.fragments

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.light_prototype.*
import com.example.light_prototype.model.MessageType
import com.example.light_prototype.model.Message
import com.example.light_prototype.model.User
import com.example.light_prototype.view_models.UserViewModel
import com.google.android.material.textfield.TextInputEditText
import com.google.gson.Gson
import io.socket.emitter.Emitter
import kotlin.collections.ArrayList

/**
 * A simple [Fragment] subclass as the second destination in the navigation.
 */
class ChatFragment : Fragment(), TextWatcher {
    private val user: UserViewModel by activityViewModels()

    private val messageList: ArrayList<Message> = arrayListOf()
    private lateinit var chatRoomAdapter: ChatRoomAdapter
    private lateinit var recyclerView: RecyclerView
    private lateinit var userConnected: User
    private lateinit var textBox: TextInputEditText
    private lateinit var send: Button


    override fun onCreateView(
            inflater: LayoutInflater, container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        ChatSocket.init()
        ChatSocket.socket.on("send-message", onSendMessage)
        ChatSocket.socket.on("user-joined", onUserJoin)
        ChatSocket.socket.on("logout", onUserLeave)

        userConnected = User(user.nickname.value!!)

        ChatSocket.socket.emit("user-joined", Gson().toJson(userConnected))

        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_chat, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        send = view?.findViewById(R.id.send_button)!!
        textBox = view?.findViewById(R.id.user_message)!!
        textBox.addTextChangedListener(this)

        activity?.findViewById<Button>(R.id.backButton)?.setOnClickListener {
            findNavController().navigate(R.id.action_SecondFragment_to_FirstFragment)
            ChatSocket.socket.emit("logout", Gson().toJson(userConnected))
            ChatSocket.socket.disconnect()
        }

        chatRoomAdapter = ChatRoomAdapter(activity?.applicationContext!!, messageList)
        recyclerView = view.findViewById(R.id.recyclerView)
        recyclerView.adapter = chatRoomAdapter

        val layoutManager = LinearLayoutManager(requireContext())
        recyclerView.layoutManager = layoutManager

        activity?.findViewById<Button>(R.id.backButton)?.visibility = View.VISIBLE

        view.findViewById<Button>(R.id.send_button).setOnClickListener {
            var messageText = view.findViewById<TextInputEditText>(R.id.user_message).text.toString().trim()
            if (messageText != "") {
                var message = Message(messageText, userConnected)
                ChatSocket.sendMessage(message)
                view?.findViewById<EditText>(R.id.user_message)?.setText("")
            }
        }
    }

    private fun addItemToRecyclerView(message: Message) {
        activity?.runOnUiThread {
            messageList.add(message)
            chatRoomAdapter.notifyItemInserted(messageList.size)
            recyclerView.scrollToPosition(messageList.size - 1) //move focus on last message
        }
    }

    private var onSendMessage = Emitter.Listener {
        var message: Message = Gson().fromJson(it[0].toString(), Message::class.java)

        val type = if (user.nickname.value?.equals(message.sender.username)!!) MessageType.MESSAGE_OWN else MessageType.MESSAGE_OTHER
        message.messageType = type
        addItemToRecyclerView(message)
    }

    private var onUserJoin= Emitter.Listener {
        val username = it[0] as String
        val userJoined = User(username)
        var message = Message("", userJoined, messageType = MessageType.USER_JOIN)
        addItemToRecyclerView(message)
    }

    private var onUserLeave= Emitter.Listener {
        val username = it[0] as String
        val userLeaved = User(username)
        var message = Message("", userLeaved, messageType = MessageType.USER_LEAVE)
        addItemToRecyclerView(message)
    }

    override fun onDestroy() {
        super.onDestroy()
        ChatSocket.socket.emit("logout", Gson().toJson(userConnected))
        ChatSocket.socket.disconnect()
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

}