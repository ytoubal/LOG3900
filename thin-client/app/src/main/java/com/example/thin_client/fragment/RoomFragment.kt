package com.example.thin_client.fragment

import android.app.AlertDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.thin_client.MainActivity
import com.example.thin_client.R
import com.example.thin_client.adapter.RoomListAdapter
import com.example.thin_client.dialog.CreateRoomDialog
import com.example.thin_client.helper.TranslateHelper
import com.example.thin_client.model.Constants
import com.example.thin_client.model.RecyclerViewRoomListener
import com.example.thin_client.model.Room
import com.example.thin_client.model.Status
import com.example.thin_client.view_model.UserViewModel
import com.google.android.material.snackbar.Snackbar
import com.google.gson.Gson
import org.json.JSONObject

class RoomFragment : Fragment(), RecyclerViewRoomListener {
    var rooms: ArrayList<Room> = arrayListOf()
    private val user: UserViewModel by activityViewModels()
    private val notificationRooms = HashMap<String, Int>()
    private var currentNotifications = 0
    var currentRoom = "General"
    private lateinit var roomAdapter: RoomListAdapter
    lateinit var recyclerView: RecyclerView
    lateinit var chatNameText: EditText

    private lateinit var newRoom: ImageButton
    private lateinit var refreshRooms: ImageButton
    private lateinit var searchRooms: Button

    var lobbyRoom: Room? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_room, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        newRoom = view.findViewById(R.id.newRoom)
        searchRooms = view.findViewById(R.id.search_rooms_button)
        chatNameText = view.findViewById(R.id.chat_name_input)
        refreshRooms = view.findViewById(R.id.refresh_rooms)

        roomAdapter =
            RoomListAdapter(activity?.baseContext!!, rooms, this, MainActivity.Settings.isDarkTheme)
        recyclerView = view.findViewById(R.id.room_recycler)
        recyclerView.adapter = roomAdapter

        val layoutManager = LinearLayoutManager(requireContext())
        recyclerView.layoutManager = layoutManager

        getUserRooms()

        newRoom.setOnClickListener {
            CreateRoomDialog(
                parentFragmentManager
            ).show(parentFragmentManager, "CreateRoomDialog")
        }

        refreshRooms.setOnClickListener {
            refreshRooms(view, 0)
            notifyItemToRecyclerView()
        }

        searchRooms.setOnClickListener {
            request()
        }
    }

    override fun refreshRooms(v: View, p: Int) {
        val fm: FragmentManager = parentFragmentManager
        //Todo à changer
        val fragment = fm.findFragmentByTag("chat" + "General") as ChatFragment
//        val chat = ChatFragment(false, Room(""))
        fragment.request()
    }

    fun addItemToRecyclerView() {
        activity?.runOnUiThread {
            roomAdapter.notifyItemInserted(rooms.size)
//            recyclerView.scrollToPosition(messageList.size - 1) //move focus on last message
        }
    }

    fun notifyItemToRecyclerView(isFromChat: Boolean = true) {
        if (isFromChat) {
            for (notificationRoom in notificationRooms.keys) {
                val index = rooms.indexOfFirst { room -> room.name.equals(notificationRoom) }
                if (index != -1) {
                    rooms[index].notification = notificationRooms[notificationRoom]!!
                }
            }
        }
        activity?.runOnUiThread {
            roomAdapter.notifyDataSetChanged()
        }
    }


    override fun onJoinRoomClicked(v: View, p: Int) {
        val fm: FragmentManager = parentFragmentManager
        fm.beginTransaction().hide(this).commit()
        var isLobby = false
        var i = p
        if (p == -1) {
            i = rooms.size - 1
            isLobby = true
        }

        val chatName =
            if (rooms[i].isLobby) rooms[i].name.replace("$", "").replace("_", "") else rooms[i].name
        var chat: ChatFragment? = fm.findFragmentByTag("chat" + chatName) as ChatFragment?

        if (chat == null) {
            rooms[i].notification = 0
            chat = ChatFragment(isLobby, rooms[i])
            if (rooms[i].history !== null) chat.messageList = ArrayList(rooms[i].history!!)
            user.userConnection.rooms.add(rooms[i].name)
            rooms[i].isJoined = true
            fm.beginTransaction().add(R.id.chat_container, chat, "chat" + chat.room.name).commit()
        } else {
            chat = fm.findFragmentByTag("chat" + chatName)!! as ChatFragment
            currentNotifications -= (if (notificationRooms.containsKey(chat.room.name)) notificationRooms[chat.room.name] else 0)!!
            chat.room.notification = currentNotifications
            notificationRooms[chat.room.name] = 0
            chat.updateNotifications(true)
            fm.beginTransaction().show(chat).commit()
        }
        if (isLobby) chat.onLoadMessagesClicked(v, 0)
        currentRoom = chatName
    }

    override fun onDeleteRoomClicked(v: View, p: Int) {
        val builder = AlertDialog.Builder(context)
        val dialog = builder
            .setTitle(context?.getString(R.string.delete_room_label))
            .setMessage(context?.getString(R.string.delete_room_question))
            .setPositiveButton(context?.getString(R.string.cancel), null)

            .setNegativeButton(context?.getString(R.string.delete_room_label)) { _, _ ->
                val fm: FragmentManager = parentFragmentManager
                val room = fm.findFragmentByTag("chat" + rooms[p].name)
//                if (room != null) {
//                    fm.beginTransaction().remove(fm.findFragmentByTag("chat" + rooms[p].name)!!)
//                        .commit()
//                }
                (fm.findFragmentByTag("chatGeneral")!! as ChatFragment).socket.socket.emit(
                    "delete-room",
                    rooms[p].name
                )

                rooms.removeAt(rooms.indexOfFirst { roomVisited -> roomVisited.name.equals(rooms[p].name) })

                notifyItemToRecyclerView()
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
    }

    fun joinGeneralRoomRequest() {
        val queue = Volley.newRequestQueue(requireContext())
        val url = Constants.URL + "database/all-rooms"
        val fm: FragmentManager = parentFragmentManager
//        val roomFragment = (fm.findFragmentByTag("rooms") as RoomFragment)

        val request = JsonArrayRequest(
            Request.Method.GET, url, null,
            Response.Listener { response ->
                var result = Gson().fromJson(response.toString(), Array<Room>::class.java).toList()

                var general = result.find { it.name == "General" }!!

                var chat = ChatFragment(false, general)
                chat.messageList = ArrayList(general.history!!)

                for (room in result) {
                    if (user.userConnection.rooms.contains(room.name) && !room.name.equals("General")) {
                        val newChat = ChatFragment(false, room)
                        newChat.messageList =
                            if (room.history != null) ArrayList(room.history!!) else arrayListOf()
                        fm.beginTransaction().add(R.id.chat_container, newChat, "chat" + room.name)
                            .commit()
                        fm.beginTransaction().hide(newChat).commit()
                    }
                }

                fm.beginTransaction().hide(this).commit()
                fm.beginTransaction().add(R.id.chat_container, chat, "chat" + chat.room.name)
                    .commit()
            },
            Response.ErrorListener {
                displaySnackbarMessage(context?.getString(R.string.generic_error_message)!!)
            })
        queue.add(request)
    }

    fun addRoomRequest(roomName: String) {
        val queue = Volley.newRequestQueue(requireContext())
        val url = Constants.URL + "database/insert-room"
        val body = HashMap<String, String>()
        body["name"] = roomName
        body["admin"] = user.userConnection.username

        val request = JsonObjectRequest(Request.Method.POST, url, JSONObject(body as Map<*, *>),
            Response.Listener { response ->
                var result = Gson().fromJson(
                    response.toString(),
                    com.example.thin_client.model.Response::class.java
                )
                if (result.status == Status.HTTP_CREATED.value) {
//                    val room = Room(view?.findViewById<EditText>(R.id.chat_name_input)?.text.toString())
                    val room = Room(roomName)
                    var chat = ChatFragment(false, room)
                    rooms.add(room)
                    room.admin = user.userPublic.username
                    val fm: FragmentManager = parentFragmentManager
                    fm.beginTransaction().hide(this).commit()
                    fm.beginTransaction().add(R.id.chat_container, chat, "chat" + chat.room.name)
                        .commit()
                    addItemToRecyclerView()
                } else {
                    val message = if(MainActivity.Settings.isFrench) TranslateHelper.roomMessages(result.status) else result.message
                    displaySnackbarMessage(message)
                }
            },
            Response.ErrorListener {
                displaySnackbarMessage(context?.getString(R.string.generic_error_message)!!)
            })
        queue.add(request)
        clearTextView()
    }

    private fun displaySnackbarMessage(message: String) {
        val snackbar = Snackbar.make(requireView(), message, Snackbar.LENGTH_SHORT)
        snackbar.setTextColor(activity?.getColor(R.color.black)!!)
        snackbar.show()
    }

    //TODO à compléter
    fun getUserRooms() {
        val queue = Volley.newRequestQueue(requireContext())
        val url = Constants.URL + "database/user-rooms?username=" + user.userConnection.username

        val request = JsonArrayRequest(
            Request.Method.GET, url, null,
            Response.Listener { response ->
                var result =
                    Gson().fromJson(response.toString(), Array<String>::class.java).toList()
                var roomsConnected = ArrayList(result)
                user.sendRooms(roomsConnected)
                joinGeneralRoomRequest()
            },
            Response.ErrorListener {
                displaySnackbarMessage(context?.getString(R.string.generic_error_message)!!)
            })
        queue.add(request)
    }

    fun addNotification(roomName: String) {
        notificationRooms[roomName] =
            if (notificationRooms.containsKey(roomName)) notificationRooms[roomName]!! + 1 else 1
        ++currentNotifications
        if (this.isVisible) {
            val index = rooms.indexOfFirst { room -> room.name.equals(roomName) }
            if (index != -1) {
                rooms[index].notification = notificationRooms[roomName]!!
                notifyItemToRecyclerView(false)
            }
        } else if (roomName != currentRoom) {
            val fm = parentFragmentManager
            val chat = fm.findFragmentByTag("chat" + currentRoom)!! as ChatFragment
            chat.room.notification = currentNotifications
            chat.updateNotifications(true)
        }
    }

    fun roomDeletedNotification(roomName: String) {
        if (notificationRooms.containsKey(roomName)) {
            currentNotifications -= notificationRooms[roomName]!!
            notificationRooms.remove(roomName)
        }
    }

    fun filterSearch() {
        var newRooms =
            ArrayList<Room>(rooms.filter { room -> room.name.contains(view?.findViewById<EditText>(R.id.chat_name_input)!!.text) })
        rooms.clear()
        rooms.addAll(newRooms)
        notifyItemToRecyclerView()
    }

    fun clearTextView() {
        view?.findViewById<EditText>(R.id.chat_name_input)?.setText("")
    }

    fun request() {
        val queue = Volley.newRequestQueue(requireContext())
        val url = Constants.URL + "database/all-rooms"

        val request = JsonArrayRequest(Request.Method.GET, url, null,
            Response.Listener { response ->
                var result = Gson().fromJson(response.toString(), Array<Room>::class.java).toList()

                // TODO: for the disappearing lobby chat: owner == null && name != general or constant or smt
                rooms.clear()

                if (lobbyRoom != null) {
                    lobbyRoom!!.notification = 0
                    rooms.add(lobbyRoom!!)
                }

                rooms.addAll(result)

                for (room in rooms) {
                    room.isAdmin = room.admin == user.userConnection.username
                    room.isJoined =
                        user.userConnection.rooms.find { roomName -> room.name.equals(roomName) } != null
                    if (room.isAdmin == true) {
                        room.isJoined = true
                    }
                }
                filterSearch()
            },
            Response.ErrorListener {
                displaySnackbarMessage(context?.getString(R.string.generic_error_message)!!)
            })
        queue.add(request)
    }
}

