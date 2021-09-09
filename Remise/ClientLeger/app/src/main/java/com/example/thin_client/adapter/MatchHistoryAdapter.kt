package com.example.thin_client.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.thin_client.MainActivity
import com.example.thin_client.R
import com.example.thin_client.helper.AvatarHelper
import com.example.thin_client.helper.TranslateHelper
import com.example.thin_client.model.GameHistory

class MatchHistoryAdapter(
    private val context: Context,
    private val matchHistoryList: ArrayList<GameHistory>,
    private val isDarkTheme: Boolean,
    private val username: String
) : RecyclerView.Adapter<MatchHistoryAdapter.ViewHolder>() {

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): MatchHistoryAdapter.ViewHolder {
        val root = LayoutInflater.from(context).inflate(R.layout.row_match, parent, false)
        return ViewHolder(root)
    }

    override fun getItemCount(): Int {
        return matchHistoryList.size
    }

    override fun onBindViewHolder(holder: MatchHistoryAdapter.ViewHolder, position: Int) {
        val matchHistoryData = matchHistoryList[position]
        val date = matchHistoryData.date
        val score = matchHistoryData.scoreClassic
        val time = matchHistoryData.time
        val players = matchHistoryData.usersPlayedWith
        val difficulty = matchHistoryData.difficulty ?: "Easy"

        val positionPlayer = players.indexOfFirst { public -> public.username.equals(username) }
        val team = if (positionPlayer < 2) 0 else 1

        if (team == 0) {
            if (score[0] > score[1])
                holder.result.text = context.getString(R.string.match_victory)
            else if (score[0] < score[1])
                holder.result.text = context.getString(R.string.match_defeat)
            else
                holder.result.text = context.getString(R.string.match_tie)
        } else if (team == 1) {
            if (score[0] < score[1])
                holder.result.text = context.getString(R.string.match_victory)
            else if (score[0] > score[1])
                holder.result.text = context.getString(R.string.match_defeat)
            else
                holder.result.text = context.getString(R.string.match_tie)
        }
        holder.date.text = date
        holder.duration.text = getTime(time)
        holder.difficulty.text =
            if (MainActivity.Settings.isFrench) TranslateHelper.translateDifficultyEnglish(
                difficulty
            ) else difficulty


        holder.score.text = score[0].toString() + "-" + score[1].toString()
        holder.player1team1.text = players[0].username
        holder.player2team1.text = players[1].username
        holder.player1team2.text = players[2].username
        holder.player2team2.text = players[3].username
        holder.avatar1team1.setImageResource(AvatarHelper.getAvatarId(players[0].avatar))
        holder.avatar2team1.setImageResource(AvatarHelper.getAvatarId(players[1].avatar))
        holder.avatar1team2.setImageResource(AvatarHelper.getAvatarId(players[2].avatar))
        holder.avatar2team2.setImageResource(AvatarHelper.getAvatarId(players[3].avatar))
    }

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val date = itemView.findViewById<TextView>(R.id.date_match)
        val duration = itemView.findViewById<TextView>(R.id.duration_match)
        val result = itemView.findViewById<TextView>(R.id.result_match)
        val score = itemView.findViewById<TextView>(R.id.score_match)
        val player1team1 = itemView.findViewById<TextView>(R.id.player1_team1_match)
        val player2team1 = itemView.findViewById<TextView>(R.id.player2_team1_match)
        val player1team2 = itemView.findViewById<TextView>(R.id.player1_team2_match)
        val player2team2 = itemView.findViewById<TextView>(R.id.player2_team2_match)
        val avatar1team1 = itemView.findViewById<ImageView>(R.id.avatar1_team1)
        val avatar2team1 = itemView.findViewById<ImageView>(R.id.avatar2_team1)
        val avatar1team2 = itemView.findViewById<ImageView>(R.id.avatar1_team2)
        val avatar2team2 = itemView.findViewById<ImageView>(R.id.avatar2_team2)
        val difficulty = itemView.findViewById<TextView>(R.id.difficulty_match)
    }

    fun getTime(seconds: Int): String {
        var time = ""
        var newSeconds = seconds
        var min = 0
        while (newSeconds >= 60) {
            min++
            newSeconds -= 60
        }

        time += ("$min:" + (if (newSeconds < 10) "0" else "") + "$newSeconds")
        return time
    }
}

