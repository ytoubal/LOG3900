package com.example.thin_client.helper

import com.example.thin_client.R

object LevelHelper {

    fun getLevel(exp: Int): Int {
        if (exp in 0..99) {
            return 1
        } else if (exp in 100..199) {
            return 2
        } else if (exp in 200..299) {
            return 3
        } else if (exp in 300..399) {
            return 4
        } else if (exp in 400..999) {
            return 5
        } else if (exp in 1000..1999) {
            return 6
        } else if (exp in 2000..2999) {
            return 7
        } else if (exp in 3000..3999) {
            return 8
        } else if (exp in 4000..9999) {
            return 9
        } else if (exp >= 10000) {
            return 10
        } else {
            return 0
        }
    }

    fun getXPForCurrentLevel(level: Int): Int {
        return when (level) {
            1 -> 0
            2 -> 100
            3 -> 200
            4 -> 300
            5 -> 400
            6 -> 1000
            7 -> 2000
            8 -> 3000
            9 -> 40000
            10 -> 10000
            else -> 0
        }
    }

    fun getBorder(level: Int): Int {
        return when (level) {
            2 -> R.drawable.border1
            3 -> R.drawable.border2
            4 -> R.drawable.border3
            5 -> R.drawable.border4
            6 -> R.drawable.border5
            7 -> R.drawable.border6
            8 -> R.drawable.border7
            9 -> R.drawable.border8
            10 -> R.drawable.border9
            else -> R.drawable.border1
        }
    }

    fun getTitle(level: Int): String {
        return when (level) {
            2 -> "Beginner"
            3 -> "Casual"
            4 -> "Inspiring"
            5 -> "Boss"
            6 -> "Amateur"
            7 -> "Emerging"
            8 -> "Pro"
            9 -> "Ancient"
            10 -> "Legend"
            else -> "none"
        }
    }
}