package com.example.light_prototype

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.light_prototype.model.MessageType
import com.example.light_prototype.model.Message
import java.util.*

class ChatRoomAdapter(private val context: Context, private val messageList: ArrayList<Message>) : RecyclerView.Adapter<ChatRoomAdapter.ViewHolder>(){

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val layout = when(viewType) {
            MessageType.MESSAGE_OWN.value->R.layout.row_own_message
            MessageType.MESSAGE_OTHER.value->R.layout.row_other_message
            MessageType.USER_JOIN.value->R.layout.row_user_update
            MessageType.USER_LEAVE.value->R.layout.row_user_update
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
        val username = messageData.sender.username
        val message = messageData.message
        val timestamp = messageData.timestamp
        val messagetype = messageData.messageType

        when(messagetype) {
            MessageType.MESSAGE_OWN-> {
                holder.message.text = message
                holder.time.text = timestamp
                holder.username.text = username
            }
            MessageType.MESSAGE_OTHER-> {
                holder.message.text = message
                holder.time.text = timestamp
                holder.username.text = username
            }
            MessageType.USER_JOIN-> {
                holder.update.text = "$username has joined the room"
            }
            MessageType.USER_LEAVE-> {
                holder.update.text = "$username has left the room"
            }
        }

    }

    inner class ViewHolder(itemView : View):  RecyclerView.ViewHolder(itemView) {
        val username = itemView.findViewById<TextView>(R.id.message_sender)
        val message = itemView.findViewById<TextView>(R.id.message_content)
        val time = itemView.findViewById<TextView>(R.id.message_timestamp)
        val update = itemView.findViewById<TextView>(R.id.user_update)
    }

}