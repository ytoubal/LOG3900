package com.example.thin_client.dialog

import android.os.Build
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.ProgressBar
import android.widget.TextView
import androidx.annotation.RequiresApi
import androidx.fragment.app.DialogFragment
import com.example.thin_client.R
import com.example.thin_client.helper.LevelHelper


class LevelUpDialog(val xp: Int) : DialogFragment() {

    private lateinit var levelView: TextView
    private lateinit var xpBar: ProgressBar
    private lateinit var xpView: TextView
    private lateinit var borderUnlocked: ImageView
    private lateinit var titleUnlocked: TextView
    private lateinit var closeDialog: Button
    val level = LevelHelper.getLevel(xp)

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.dialog_level_up, container, false)

    }

    @RequiresApi(Build.VERSION_CODES.N)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        levelView = view.findViewById(R.id.new_level_dialog)
        levelView.text = level.toString()

        xpBar = view.findViewById(R.id.xp_bar_level_up)
        xpBar.max = LevelHelper.getXPForCurrentLevel(level)
        xpBar.setProgress(LevelHelper.getXPForCurrentLevel(level), true)

        xpView = view.findViewById(R.id.xp_level_up_dialog)
        xpView.text = (LevelHelper.getXPForCurrentLevel(level)-1)
            .toString() + "/ " + (LevelHelper.getXPForCurrentLevel(level)-1).toString() + " XP"

        borderUnlocked = view.findViewById(R.id.border_unlocked)
        borderUnlocked.setImageResource(LevelHelper.getBorder(level))

        titleUnlocked = view.findViewById(R.id.title_unlocked)
        titleUnlocked.text = LevelHelper.getTitle(level)

        closeDialog = view.findViewById(R.id.close_level_up_dialog)
        closeDialog.setOnClickListener { this.dismiss() }
    }
}