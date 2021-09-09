package com.example.light_prototype.view_models

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class UserViewModel : ViewModel() {
    val nickname = MutableLiveData<String>()

    fun sendNickname(name: String) {
        nickname.value = name
    }
}