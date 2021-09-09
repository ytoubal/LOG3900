package com.example.thin_client.dialog

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.FragmentManager
import com.example.thin_client.R
import com.example.thin_client.fragment.LobbyMenuFragment
import com.example.thin_client.fragment.RoomFragment

class GameSummaryDialog(
    val score: Array<Int>,
    val outcome: String,
    val lobbyName: String,
    val isStopGame: Boolean = false
) : DialogFragment() {

    lateinit var scoreValue: TextView
    lateinit var gameDescription: TextView
    lateinit var menu: Button

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.dialog_game_summary, container, false)

    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        gameDescription = view.findViewById(R.id.game_description)
        if (isStopGame) {
            gameDescription.text = context?.getString(R.string.game_user_left)
        } else {
            scoreValue = view.findViewById(R.id.game_summary_score_value)
            scoreValue.text = score[0].toString() + "-" + score[1].toString()

            if (outcome.equals("win")) {
                gameDescription.text = context?.getString(R.string.win_game)
            } else if (outcome.equals("lose")) {
                gameDescription.text = context?.getString(R.string.lost_game)
            } else if (outcome.equals("tie")) {
                gameDescription.text = context?.getString(R.string.tie_game)
            }
        }

        menu = view.findViewById(R.id.game_summary_back_button)
        menu.setOnClickListener {
            this.dismiss()
            val fm: FragmentManager = parentFragmentManager

            val rooms = fm.findFragmentByTag("rooms")

            if (rooms != null) {
                val index =
                    (rooms as RoomFragment).rooms.indexOfFirst { room -> room.name.equals(lobbyName) }
                if (index != -1) {
                    rooms.rooms.removeAt(index)
                }
                fm.beginTransaction().show(rooms).commit()
                fm.beginTransaction().remove(fm.findFragmentByTag("chat" + lobbyName)!!).commit()
            }

            fm.beginTransaction().replace(R.id.main_fragment, LobbyMenuFragment()).commit()
        }
        this.isCancelable = false
    }
}