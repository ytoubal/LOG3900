package com.example.thin_client.adapter

import android.content.Context
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.thin_client.R
import com.example.thin_client.helper.AvatarHelper
import com.example.thin_client.helper.LevelHelper
import com.example.thin_client.model.UserLeaderboard

class LeaderboardAdapter(
    private val context: Context,
    private val leaderboardList: ArrayList<UserLeaderboard>,
    private val isDarkTheme: Boolean
) : RecyclerView.Adapter<LeaderboardAdapter.ViewHolder>() {

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): LeaderboardAdapter.ViewHolder {
        val root = LayoutInflater.from(context).inflate(R.layout.row_leaderboard, parent, false)
        return ViewHolder(root)
    }

    override fun getItemCount(): Int {
        return leaderboardList.size
    }

    override fun onBindViewHolder(holder: LeaderboardAdapter.ViewHolder, position: Int) {
        val leaderboardData = leaderboardList[position]
        val rank = leaderboardData.rank
        val username = leaderboardData.user.username
        val avatar = leaderboardData.user.avatar
        val border = leaderboardData.user.border
        val title = leaderboardData.user.title
        val xp = leaderboardData.user.pointsXP
        val level = LevelHelper.getLevel(xp)
        var drawable =
            if (avatar == null) AvatarHelper.getAvatarId("") else AvatarHelper.getAvatarId(avatar)
        val borderDrawable =
            if (border == null) AvatarHelper.getBorderId("border0") else AvatarHelper.getBorderId(
                border
            )

        holder.rank.text = rank.toString()
        holder.avatar.setImageResource(drawable)
        holder.title.text = if (title == null || title.equals("none")) "" else title
        holder.border.setImageResource(borderDrawable)
        holder.username.text = username
        holder.xp.text = "$xp XP"
        holder.level.text = context.getString(R.string.level) + " $level"

        if (leaderboardData.isOwnUser) {
            holder.row.setBackgroundColor(Color.parseColor("#664262ab"))
        } else
            holder.row.setBackgroundColor(Color.parseColor("#00000000"))

    }

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val row = itemView.findViewById<LinearLayout>(R.id.user_row_leaderboard)
        val rank = itemView.findViewById<TextView>(R.id.rank_leaderboard)
        val avatar = itemView.findViewById<ImageView>(R.id.avatar_leaderboard)
        val username = itemView.findViewById<TextView>(R.id.username_leaderboard)
        val xp = itemView.findViewById<TextView>(R.id.xp_leaderboard)
        val level = itemView.findViewById<TextView>(R.id.level_leaderboard)
        val border = itemView.findViewById<ImageView>(R.id.border_leaderboard)
        val title = itemView.findViewById<TextView>(R.id.title_leaderboard)
    }
}

