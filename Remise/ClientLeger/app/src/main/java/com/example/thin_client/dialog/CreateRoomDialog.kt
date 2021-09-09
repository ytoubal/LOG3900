package com.example.thin_client.dialog

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.FragmentManager
import com.example.thin_client.MainActivity
import com.example.thin_client.R
import com.example.thin_client.fragment.RoomFragment

class CreateRoomDialog(val fm: FragmentManager) : DialogFragment(), TextWatcher {
    lateinit var createRoomButton: Button
    lateinit var cancelRoomButton: Button
    lateinit var textBox: EditText

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.dialog_create_room, container, false)

    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        createRoomButton = view.findViewById(R.id.create_room_dialog)
        createRoomButton.isEnabled = false

        cancelRoomButton = view.findViewById(R.id.cancel_room_dialog)
        cancelRoomButton.setOnClickListener { this.dismiss() }

        textBox = view.findViewById(R.id.create_room_name)
        textBox.addTextChangedListener(this)

        createRoomButton.setOnClickListener {
            val fm = parentFragmentManager
            val rooms = fm.findFragmentByTag("rooms")
            if (rooms != null) {
                val newRoomName = view.findViewById<EditText>(R.id.create_room_name).text.toString()
//                if ((rooms as RoomFragment).rooms.find { roomName -> newRoomName.equals(roomName) } == null){
                (rooms as RoomFragment).addRoomRequest(newRoomName.trim())
                this.dismiss()
            }
        }
    }


    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
        // Not used
    }

    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
        if (s != null) {
            when {
                s.trim().isEmpty() -> {
                    createRoomButton.isEnabled = false
                }
                s.trim().length >= 10 -> {
                    textBox.error =
                        if (MainActivity.Settings.isFrench) "Le nom du canal ne doit pas dépasser 10 caractères" else "Room name cannot exceed 10 characters"
                    createRoomButton.isEnabled = false
                }
                else -> {
                    createRoomButton.isEnabled = true
                }
            }
        }
    }

    override fun afterTextChanged(s: Editable?) {
        // Not used
    }


}

