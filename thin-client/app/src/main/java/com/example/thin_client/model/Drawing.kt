package com.example.thin_client.model

import android.graphics.Paint
import android.graphics.Path

data class Action(val path: Path, val paint: Paint, val depth: Int)

data class Line(
    var name: String,
    var clientX: Float,
    var clientY: Float,
    var strokeWidth: Int,
    var isEraser: Boolean,
    var type: String,
    var color: String,
    var isLight: Boolean = true,
    var undo: Int,
    var depth: Int = -1
)

enum class ActionType(val value: Int) {
    None(0),
    Undo(1),
    Redo(2)
}

data class WordImage(val word: String, val game: String)