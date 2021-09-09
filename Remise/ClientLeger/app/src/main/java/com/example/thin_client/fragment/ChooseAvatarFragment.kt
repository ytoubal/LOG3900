package com.example.thin_client.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.android.volley.Request
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
import kotlin.collections.ArrayList

class ChooseAvatarFragment : Fragment() {

    lateinit var createAccount: Button
    private val user: UserViewModel by activityViewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_choose_avatar, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        createAccount = activity?.findViewById(R.id.create_account_button)!!
        createAccount.isEnabled = false
        val avatar = activity?.findViewById<ImageView>(R.id.chosenAvatar)
        for (i in 1..10) {
            val imageId =
                activity?.resources?.getIdentifier("avatar$i", "id", context?.packageName)!!
            val image = activity?.findViewById<ImageView>(imageId)!!
            image.setOnClickListener() {
                avatar?.setImageDrawable(image.drawable)
                createAccount.isEnabled = true
                user.sendAvatar("avatar$i")
                user.sendBorder("border0")
                user.sendTitle("")
            }
        }

        createAccount.setOnClickListener {
            val queue = Volley.newRequestQueue(requireContext())
            val url = Constants.URL + "database/registerUserInfo"

            var userInfo = UserInfo(
                Connection(user.userConnection.username, user.userConnection.password),
                Public(user.userConnection.username, user.userPublic.avatar),
                Private(user.userPrivate.firstName, user.userPrivate.lastName, GameStats())
            )
            val body = Gson().toJson(userInfo)

            val request = JsonObjectRequest(
                Request.Method.POST, url, JSONObject(body),
                com.android.volley.Response.Listener { response ->
                    var result = Gson().fromJson(response.toString(), Response::class.java)
                    if (result.status == Status.HTTP_CREATED.value) {
                        (parentFragment?.parentFragment as RegisterFragment).login()
                        val dateFormat = SimpleDateFormat("M/dd/yyyy h:mm:ss a")
                        val dateString = dateFormat.format(Date())
                        user.sendXP(0)
                        val date = dateFormat.parse(dateString)
                        user.sendTimestamp(date)
                        user.userConnection.rooms = ArrayList()
                        user.userConnection.rooms.add("General")
                    } else {
                        val message = if(MainActivity.Settings.isFrench) TranslateHelper.signUp(result.status) else result.message
                        displaySnackbarMessage(message)
                    }
                },
                com.android.volley.Response.ErrorListener {
                    displaySnackbarMessage(context?.getString(R.string.generic_error_message)!!)
                })
            queue.add(request)
        }
    }

    private fun displaySnackbarMessage(message: String) {
        val snackbar = Snackbar.make(requireView(), message, Snackbar.LENGTH_SHORT)
        snackbar.setTextColor(activity?.getColor(R.color.black)!!)
        snackbar.show()
    }
}