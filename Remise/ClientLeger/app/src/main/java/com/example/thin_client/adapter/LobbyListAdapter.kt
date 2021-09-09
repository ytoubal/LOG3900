package com.example.thin_client.adapter

import android.annotation.SuppressLint
import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.thin_client.R
import com.example.thin_client.helper.AvatarHelper
import com.example.thin_client.model.Lobby
import com.example.thin_client.model.RecyclerViewLobbyListener


class LobbyListAdapter(
    private val context: Context,
    private val lobbyList: ArrayList<Lobby>,
    private val recyclerListener: RecyclerViewLobbyListener,
    private val isDarkTheme: Boolean
) : RecyclerView.Adapter<LobbyListAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val root = LayoutInflater.from(context).inflate(R.layout.row_lobby, parent, false)
        return ViewHolder(root)
    }

    override fun getItemCount(): Int {
        return lobbyList.size
    }

    @SuppressLint("ResourceAsColor")
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val lobbyData = lobbyList[position]

        if (isDarkTheme) {
            holder.lobbyName.setTextColor(context.getColor(R.color.dark_white))
            holder.lobbyDifficulty.setTextColor(context.getColor(R.color.dark_white))
            holder.player1.setTextColor(context.getColor(R.color.dark_white))
            holder.player2.setTextColor(context.getColor(R.color.dark_white))
            holder.player3.setTextColor(context.getColor(R.color.dark_white))
            holder.player4.setTextColor(context.getColor(R.color.dark_white))
            holder.joinLobbyButton.setTextColor(context.getColor(R.color.black))
            holder.joinLobbyButton.backgroundTintList =
                ColorStateList.valueOf(context.getColor(R.color.dark_white))
        } else {
            holder.lobbyName.setTextColor(context.getColor(R.color.black))
            holder.lobbyDifficulty.setTextColor(context.getColor(R.color.black))
            holder.player1.setTextColor(context.getColor(R.color.black))
            holder.player2.setTextColor(context.getColor(R.color.black))
            holder.player3.setTextColor(context.getColor(R.color.black))
            holder.player4.setTextColor(context.getColor(R.color.black))
            holder.joinLobbyButton.setTextColor(context.getColor(R.color.dark_white))
            holder.joinLobbyButton.backgroundTintList =
                ColorStateList.valueOf(Color.parseColor("#FF212E5B"))
        }

        holder.lobbyName.text = lobbyData.name
        holder.lobbyDifficulty.text = lobbyData.difficulty

        holder.joinLobbyButton.setOnClickListener {
            recyclerListener.onJoinLobbyClicked(holder.itemView, position)
        }

        val players =
            arrayListOf<TextView>(holder.player1, holder.player2, holder.player3, holder.player4)
        val avatars = arrayListOf<ImageView>(
            holder.player1border,
            holder.player2border,
            holder.player3border,
            holder.player4border
        )

        for (i in 0..3) {
            players[i].text = ""
            avatars[i].alpha = 0F
        }

        if (lobbyData.users != null) {
            for ((i, player) in lobbyData.users.withIndex()) {
                players[i].text = player.username
                avatars[i].alpha = 1F
                avatars[i].setImageResource(AvatarHelper.getAvatarId(player.avatar))
            }
        }
    }

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val lobbyName = itemView.findViewById<TextView>(R.id.lobby_name)
        val lobbyDifficulty = itemView.findViewById<TextView>(R.id.lobby_difficulty)
        val joinLobbyButton = itemView.findViewById<Button>(R.id.joinLobbyButton)
        val player1 = itemView.findViewById<TextView>(R.id.lobby_player1)
        val player1border = itemView.findViewById<ImageView>(R.id.lobby_avatar1)
        val player2 = itemView.findViewById<TextView>(R.id.lobby_player2)
        val player2border = itemView.findViewById<ImageView>(R.id.lobby_avatar2)
        val player3 = itemView.findViewById<TextView>(R.id.lobby_player3)
        val player3border = itemView.findViewById<ImageView>(R.id.lobby_avatar3)
        val player4 = itemView.findViewById<TextView>(R.id.lobby_player4)
        val player4border = itemView.findViewById<ImageView>(R.id.lobby_avatar4)
    }
}