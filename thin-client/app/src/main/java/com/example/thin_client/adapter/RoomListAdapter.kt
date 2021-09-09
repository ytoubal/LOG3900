package com.example.thin_client.adapter

import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.thin_client.R
import com.example.thin_client.model.RecyclerViewRoomListener
import com.example.thin_client.model.Room

class RoomListAdapter(
    private val context: Context,
    private val roomList: ArrayList<Room>,
    private val recyclerListener: RecyclerViewRoomListener,
    private val isDarkTheme: Boolean
) : RecyclerView.Adapter<RoomListAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val root = LayoutInflater.from(context).inflate(R.layout.row_rooms, parent, false)
        return ViewHolder(root)
    }

    override fun getItemCount(): Int {
        return roomList.size
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val messageData = roomList[position]
        holder.deleteButton.visibility = View.GONE

        holder.roomName.text = messageData.name.replace("$", "").replace("_", "")

        holder.button.text =
            if (messageData.isJoined || messageData.isLobby) context.getText(R.string.open_room) else context.getText(
                R.string.join_room
            )

        holder.button.setOnClickListener {
            recyclerListener.onJoinRoomClicked(holder.itemView, position)
        }

        holder.deleteButton.setOnClickListener {
            recyclerListener.onDeleteRoomClicked(holder.itemView, position)
        }

        holder.deleteButton.visibility =
            if (messageData.admin != null && messageData.isAdmin != null
                && messageData.isAdmin!!
            ) View.VISIBLE else View.GONE

        if (isDarkTheme) {
            holder.roomName.setTextColor(context.getColor(R.color.dark_white))
            holder.button.setTextColor(context.getColor(R.color.black))
            holder.button.backgroundTintList =
                ColorStateList.valueOf(context.getColor(R.color.dark_white))
            if (holder.deleteButton.isEnabled) {
                holder.deleteButton.setTextColor(context.getColor(R.color.black))
                holder.deleteButton.backgroundTintList =
                    ColorStateList.valueOf(context.getColor(R.color.dark_white))
            } else {
                holder.deleteButton.setTextColor(holder.deleteButton.textColors.defaultColor)
                holder.deleteButton.backgroundTintList =
                    ColorStateList.valueOf(Color.parseColor("#7ad8d8d8"))
            }
        }

        holder.notification.visibility =
            if (messageData.notification == 0) View.GONE else View.VISIBLE
        holder.notification.text = messageData.notification.toString()
    }

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val roomName = itemView.findViewById<TextView>(R.id.room_name)
        val button = itemView.findViewById<Button>(R.id.roomJoinButton)
        val deleteButton = itemView.findViewById<Button>(R.id.roomDeleteButton)
        val notification = itemView.findViewById<TextView>(R.id.badge_textView)
    }
}