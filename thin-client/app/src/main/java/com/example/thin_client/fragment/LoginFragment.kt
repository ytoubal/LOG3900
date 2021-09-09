package com.example.thin_client.fragment

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.*
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.thin_client.MainActivity
import com.example.thin_client.R
import com.example.thin_client.helper.TranslateHelper
import com.example.thin_client.model.*
import com.example.thin_client.view_model.UserViewModel
import com.google.android.material.snackbar.Snackbar
import com.google.gson.Gson
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.HashMap

class LoginFragment : Fragment(), TextWatcher {

    private val user: UserViewModel by activityViewModels()
    private lateinit var username: EditText
    private lateinit var password: EditText
    lateinit var settingsBtn: ImageButton
    lateinit var backBtn: ImageButton
    private lateinit var join: Button
    var requestSent = false

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_login, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        //ChatSocket.socket.disconnect()

        val app_bar_logo = activity?.findViewById<ImageView>(R.id.app_bar_logo)
        app_bar_logo?.visibility = View.GONE
        val app_bar_title = activity?.findViewById<TextView>(R.id.app_bar_title)
        app_bar_title?.visibility = View.GONE

        val appBar = activity?.findViewById<androidx.appcompat.widget.Toolbar>(R.id.menu_toolbar)
        appBar?.visibility = View.GONE

        username = view.findViewById(R.id.editTextTextPersonName)
        username.addTextChangedListener(this)

        password = view.findViewById(R.id.editTextTextPassword)

        join = view.findViewById(R.id.button_first)
        join.isEnabled = false

        backBtn = activity?.findViewById<ImageButton>(R.id.ic_back)!!
        backBtn.visibility = View.GONE
        activity?.findViewById<ImageButton>(R.id.ic_tutorial)?.visibility = View.GONE
        activity?.findViewById<ImageButton>(R.id.ic_leaderboard)?.visibility = View.GONE
        activity?.findViewById<ImageButton>(R.id.ic_profile)?.visibility = View.GONE

        settingsBtn = activity?.findViewById<ImageButton>(R.id.ic_settings)!!
        settingsBtn.visibility = View.VISIBLE

        settingsBtn.setOnClickListener {
            val keyboardManager =
                activity?.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
            keyboardManager.hideSoftInputFromWindow(view.windowToken, 0)
            findNavController().navigate(R.id.action_loginFragment_to_settingsFragment)
            settingsBtn.visibility = View.GONE
            backBtn.visibility = View.VISIBLE
            backBtn.setOnClickListener {
                findNavController().navigate(R.id.action_settingsFragment_to_loginFragment)
            }
        }

        join.setOnClickListener {
            val keyboardManager =
                activity?.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
            keyboardManager.hideSoftInputFromWindow(view.windowToken, 0)
            if (!requestSent) {
                requestSent = true
                join.isEnabled = false
                loginRequest()
            }
        }

        activity?.findViewById<TextView>(R.id.register_link)?.setOnClickListener {
            if (!requestSent)
                findNavController().navigate(R.id.action_loginFragment_to_registerFragment)
            settingsBtn.visibility = View.GONE
            backBtn.visibility = View.GONE
        }

        if (MainActivity.Settings.isDarkTheme) view.setBackgroundResource(R.drawable.dark_mountains) else view.setBackgroundResource(
            R.drawable.mountains
        )
    }

    fun navigate() {
        findNavController().navigate(R.id.action_loginFragment_to_menuFragment)

        backBtn.setOnClickListener {
            restartActivity()
//            findNavController().navigate(R.id.action_menuFragment_to_loginFragment)
        }

        user.sendUsername(username.text.toString().trim())
        val dateFormat = SimpleDateFormat("M/dd/yyyy h:mm:ss a")
        val dateString = dateFormat.format(Date())
        val date = dateFormat.parse(dateString)
        user.sendTimestamp(date)
    }

    fun loginRequest() {
        val queue = Volley.newRequestQueue(requireContext())
        val url = Constants.URL + "database/login"

        val body = HashMap<String, String>()
        body["username"] = username.text.toString().trim()
        body["password"] = password.text.toString()

        val request = JsonObjectRequest(Request.Method.POST, url, JSONObject(body as Map<*, *>),
            Response.Listener { response ->
                var result = Gson().fromJson(
                    response.toString(),
                    com.example.thin_client.model.Response::class.java
                )
                if (result.status == Status.USER_EXISTS.value) {
                    val public = Gson().fromJson(
                        result.message,
                        com.example.thin_client.model.Public::class.java
                    )
                    user.userPublic = public
                    user.userConnection = Connection(user.userPublic.username, "")
                    user.userPrivate = Private("", "", GameStats(0, 0, 0))
                    user.sendAvatar(public.avatar)
                    user.sendBorder(public.border)
                    user.sendTitle(public.title)
                    user.sendXP(public.pointsXP)
//                        user.(public.username)
                    navigate()
                } else {
                    val message = if(MainActivity.Settings.isFrench) TranslateHelper.loginMessages(result.status) else result.message
                    displaySnackbarMessage(message)
                }

            },
            Response.ErrorListener {
                displaySnackbarMessage(context?.getString(R.string.generic_error_message)!!)
            })
        queue.add(request)
    }

    private fun displaySnackbarMessage(message: String) {
        requestSent = false
        join.isEnabled = true
        val snackbar = Snackbar.make(requireView(), message, Snackbar.LENGTH_SHORT)
        snackbar.setTextColor(activity?.getColor(R.color.black)!!)
        snackbar.show()
    }

    override fun afterTextChanged(s: Editable?) {
        //unused
    }

    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
        //unused
    }

    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
        if (s != null) {
            when {
                s.trim().isEmpty() -> {
                    username.error =
                        if (MainActivity.Settings.isFrench) "Le nom d'utilisateur doit être alphanumérique" else "Username must be alphanumeric"
                    join.isEnabled = false
                }
                s.trim().length > 10 -> {
                    username.error =
                        if (MainActivity.Settings.isFrench) "Le nom d'utilisateur ne doit pas dépasser 10 caractères" else "Username must be under 10 characters"
                    join.isEnabled = false
                }
                s.isEmpty() -> {
                    username.error =
                        if (MainActivity.Settings.isFrench) "Veuillez entrer un nom d'utilisateur" else "Please enter a username"
                    join.isEnabled = false
                }
                else -> {
                    join.isEnabled = true
                }
            }
        }
    }


    fun restartActivity() {
        val refresh = Intent(
            context,
            MainActivity::class.java
        )
        startActivity(refresh)
    }

}