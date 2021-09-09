package com.example.thin_client.model

import android.view.View

interface RecyclerViewRoomListener {
    fun onJoinRoomClicked(v: View, p: Int)
    fun onDeleteRoomClicked(v: View, p: Int)
    fun refreshRooms(v: View, p: Int)
}

interface RecyclerViewChatListener {
    fun onLoadMessagesClicked(v: View, p: Int)
}

interface RecyclerViewLobbyListener {
    fun onJoinLobbyClicked(v: View, p: Int)
}