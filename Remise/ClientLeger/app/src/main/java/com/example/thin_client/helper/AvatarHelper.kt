package com.example.thin_client.helper

import com.example.thin_client.R

object AvatarHelper {

    fun getAvatarId(avatar: String): Int {
        return when (avatar) {
            "avatar1" -> R.drawable.drool
            "avatar2" -> R.drawable.dog
            "avatar3" -> R.drawable.rem
            "avatar4" -> R.drawable.yuhan
            "avatar5" -> R.drawable.buffcorell
            "avatar6" -> R.drawable.cheems
            "avatar7" -> R.drawable.grumpy_cat
            "avatar8" -> R.drawable.hi_bingus
            "avatar9" -> R.drawable.sad
            "avatar10" -> R.drawable.floppa
            "virtual_player" -> R.drawable.virtual_player
            else -> R.drawable.placeholder_logo
        }
    }

    fun getBorderId(border: String): Int {
        return when (border) {
            "border0" -> 0
            "border1" -> R.drawable.border1
            "border2" -> R.drawable.border2
            "border3" -> R.drawable.border3
            "border4" -> R.drawable.border4
            "border5" -> R.drawable.border5
            "border6" -> R.drawable.border6
            "border7" -> R.drawable.border7
            "border8" -> R.drawable.border8
            "border9" -> R.drawable.border9
            else -> R.drawable.placeholder_logo
        }
    }

}