package com.example.thin_client.dialog

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Button
import android.widget.EditText
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.activityViewModels
import com.android.volley.Request
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.thin_client.MainActivity
import com.example.thin_client.R
import com.example.thin_client.fragment.LobbyFragment
import com.example.thin_client.helper.TranslateHelper
import com.example.thin_client.model.Constants
import com.example.thin_client.model.Lobby
import com.example.thin_client.model.Response
import com.example.thin_client.model.Status
import com.example.thin_client.view_model.UserViewModel
import com.google.android.material.snackbar.Snackbar
import com.google.gson.Gson
import org.json.JSONObject

class CreateLobbyDialog(val fm: FragmentManager, val parentView: View, val activity: MainActivity) : DialogFragment(), TextWatcher {

    private val user: UserViewModel by activityViewModels()
    lateinit var difficulty: AutoCompleteTextView
    lateinit var round: AutoCompleteTextView
    lateinit var createLobbyButton: Button
    lateinit var cancelLobbyButton: Button
    lateinit var textBox: EditText

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.dialog_create_lobby, container, false)

    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        difficulty = view.findViewById(R.id.dialog_difficulty_selection)!!
        var difficulties = if (MainActivity.Settings.isFrench) arrayOf(
            "Facile",
            "Moyen",
            "Difficile"
        ) else arrayOf("Easy", "Medium", "Hard")
        var adapter =
            ArrayAdapter(requireContext(), android.R.layout.simple_list_item_1, difficulties)
        difficulty.setAdapter(adapter)
        difficulty.setText(if (MainActivity.Settings.isFrench) "Facile" else "Easy", false)

        round = view.findViewById(R.id.dialog_rounds_selection)!!
        var rounds = arrayOf("3", "5", "7", "9")
        var adapterRounds =
            ArrayAdapter(requireContext(), android.R.layout.simple_list_item_1, rounds)
        round.setAdapter(adapterRounds)
        round.setText("3", false)

        createLobbyButton = view.findViewById(R.id.create_lobby_dialog)
        createLobbyButton.isEnabled = false

        cancelLobbyButton = view.findViewById(R.id.cancel_lobby_dialog)
        cancelLobbyButton.setOnClickListener { this.dismiss() }

        textBox = view.findViewById(R.id.create_lobby_name)
        textBox.addTextChangedListener(this)

        createLobbyButton.setOnClickListener {
            val lobbyName = view.findViewById<EditText>(R.id.create_lobby_name).text.toString()
            var lobbyDifficulty =
                view.findViewById<AutoCompleteTextView>(R.id.dialog_difficulty_selection).editableText.toString()
            lobbyDifficulty =
                if (MainActivity.Settings.isFrench) TranslateHelper.translateDifficulty(
                    lobbyDifficulty
                ) else lobbyDifficulty
            val lobbyRound =
                view.findViewById<AutoCompleteTextView>(R.id.dialog_rounds_selection).editableText.toString()
            addLobbyRequest(lobbyName, lobbyDifficulty, lobbyRound.toInt())
            this.dismiss()
        }
    }

    fun addLobbyRequest(lobbyName: String, difficulty: String, rounds: Int) {
        val queue = Volley.newRequestQueue(requireContext())
        val url = Constants.URL + "database/insert-lobby"

        var lobby = Lobby(lobbyName, user.userPublic.username, difficulty, arrayListOf(), rounds)
        lobby.users.add(user.userPublic)
        val body = Gson().toJson(lobby)

        val request = JsonObjectRequest(
            Request.Method.POST, url, JSONObject(body),
            com.android.volley.Response.Listener { response ->
                var result = Gson().fromJson(response.toString(), Response::class.java)
                if (result.status == Status.HTTP_CREATED.value) {
                    var newLobby = LobbyFragment(lobby)
                    fm.beginTransaction().replace(R.id.main_fragment, newLobby).commit()
                } else {
                    val message = if(MainActivity.Settings.isFrench) TranslateHelper.dbLobbyMessages(result.status) else result.message
                    displaySnackbarMessage(message)
                }
            },
            com.android.volley.Response.ErrorListener {
                displaySnackbarMessage(context?.getString(R.string.generic_error_message)!!)
            })
        queue.add(request)
    }

    private fun displaySnackbarMessage(message: String) {
        val snackbar = Snackbar.make(parentView, message, Snackbar.LENGTH_SHORT)
        snackbar.setTextColor(activity.getColor(R.color.black)!!)
        snackbar.show()
    }

    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
        // Not used
    }

    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
        if (s != null) {
            when {
                s.trim().isEmpty() -> {
                    createLobbyButton.isEnabled = false
                }
                s.trim().length > 10 -> {
                    textBox.error =
                        if (MainActivity.Settings.isFrench) "Le nom du groupe ne doit pas dépasser 10 caractères" else "Lobby name cannot exceed 10 characters"
                    createLobbyButton.isEnabled = false
                }
                else -> {
                    createLobbyButton.isEnabled = true
                }
            }
        }
    }

    override fun afterTextChanged(s: Editable?) {
        // Not used
    }


}

