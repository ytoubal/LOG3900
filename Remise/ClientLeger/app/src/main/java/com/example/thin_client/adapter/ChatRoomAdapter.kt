package com.example.thin_client.adapter

import android.content.Context
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
import com.example.thin_client.model.Message
import com.example.thin_client.model.MessageType
import com.example.thin_client.model.RecyclerViewChatListener
import java.util.*

class ChatRoomAdapter(
    private val context: Context,
    private val messageList: ArrayList<Message>,
    private val recyclerListener: RecyclerViewChatListener,
    private val isDarkTheme: Boolean
) : RecyclerView.Adapter<ChatRoomAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val layout = when (viewType) {
            MessageType.MESSAGE_OWN.value -> R.layout.row_own_message
            MessageType.MESSAGE_OTHER.value -> R.layout.row_other_message
            MessageType.USER_JOIN.value -> R.layout.row_user_update
            MessageType.USER_LEAVE.value -> R.layout.row_user_update
            MessageType.LOAD_MESSAGES.value -> R.layout.row_load_previous_messages
            else -> R.layout.row_own_message
        }
        val root = LayoutInflater.from(context).inflate(layout, parent, false)
        return ViewHolder(root)
    }

    override fun getItemCount(): Int {
        return messageList.size
    }

    override fun getItemViewType(position: Int): Int {
        return messageList[position].messageType.value
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val messageData = messageList[position]
        val username = messageData.sender
        val message = messageData.message
        val timestamp = messageData.timestamp
        val avatar = messageData.avatar
        var drawable =
            if (avatar == null) AvatarHelper.getAvatarId("") else AvatarHelper.getAvatarId(avatar)

        when (messageData.messageType) {
            MessageType.MESSAGE_OWN -> {
                if (isDarkTheme) {
                    holder.time.setTextColor(context.getColor(R.color.dark_white))
                    holder.username.setTextColor(context.getColor(R.color.dark_white))
                }
                holder.message.text = message
                holder.time.text = timestamp
                holder.username.text = username
                holder.avatar.setImageResource(drawable)
            }
            MessageType.MESSAGE_OWN_CORRECT -> {
                holder.message.text = message
                holder.message.setBackgroundColor(Color.parseColor("#96EA5C"))
                holder.time.text = timestamp
                holder.username.text = username
                holder.avatar.setImageResource(drawable)
            }
            MessageType.MESSAGE_OWN_WRONG -> {
                holder.message.text = message
                holder.message.setBackgroundColor(Color.parseColor("#DF5959"))
                holder.time.text = timestamp
                holder.username.text = username
                holder.avatar.setImageResource(drawable)
            }
            MessageType.MESSAGE_OTHER -> {
                if (isDarkTheme) {
                    holder.time.setTextColor(context.getColor(R.color.dark_white))
                    holder.username.setTextColor(context.getColor(R.color.dark_white))
                }
                holder.message.text = message
                holder.time.text = timestamp
                holder.username.text = username
                holder.avatar.setImageResource(drawable)
            }
            MessageType.BOT_MESSAGE -> {
                holder.message.text = message
                holder.time.text = timestamp
                holder.username.text = username
                holder.avatar.setImageResource(drawable)
            }
            MessageType.USER_JOIN -> {
                if (isDarkTheme) {
                    holder.update.setTextColor(context.getColor(R.color.dark_white))
                }
                holder.update.text = "$username " + context.getString(R.string.join_message)
            }
            MessageType.USER_LEAVE -> {
                if (isDarkTheme) {
                    holder.update.setTextColor(context.getColor(R.color.dark_white))
                }
                holder.update.text = "$username " + context.getString(R.string.leave_message)
            }
        }

        if (holder.loadMessagesButton != null) {
            holder.loadMessagesButton.setOnClickListener {
                recyclerListener.onLoadMessagesClicked(holder.itemView, position)
            }
        }

    }

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val username = itemView.findViewById<TextView>(R.id.message_sender)
        val message = itemView.findViewById<TextView>(R.id.own_message_content)
        val time = itemView.findViewById<TextView>(R.id.message_timestamp)
        val update = itemView.findViewById<TextView>(R.id.user_update)
        val loadMessagesButton = itemView.findViewById<Button>(R.id.loadMessagesButton)
        var avatar = itemView.findViewById<ImageView>(R.id.message_avatar)
    }

}