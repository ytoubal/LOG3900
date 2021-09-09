package com.example.thin_client.view_model

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.thin_client.model.Connection
import com.example.thin_client.model.GameStats
import com.example.thin_client.model.Private
import com.example.thin_client.model.Public
import java.util.*

class UserViewModel : ViewModel() {
    var userConnection: Connection = Connection("", "")
    var userPublic = Public("", "")
    var userPrivate = Private("", "", GameStats())
    val timeStamp = MutableLiveData<Date>()
    var isNewAccount = false

    fun sendUsername(name: String) {
        userConnection.username = name
        userPublic.username = name
    }

    fun sendPassword(name: String) {
        userConnection.password = name
    }

    fun sendFirstName(name: String) {
        userPrivate.firstName = name
    }

    fun sendLastName(name: String) {
        userPrivate.lastName = name
    }

    fun sendAvatar(name: String) {
        userPublic.avatar = name
    }

    fun sendBorder(name: String) {
        userPublic.border = name
    }

    fun sendTitle(name: String) {
        userPublic.title = name
    }

    fun sendTimestamp(dateFormat: Date) {
        timeStamp.value = dateFormat
    }

    fun sendRooms(roomName: ArrayList<String>) {
        userConnection.rooms.addAll(roomName)
    }

    fun sendXP(xp: Int) {
        userPublic.pointsXP = xp
    }
}