package com.example.thin_client.dialog

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.DialogFragment
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.thin_client.MainActivity
import com.example.thin_client.R
import com.example.thin_client.fragment.ProfileFragment
import com.example.thin_client.helper.AvatarHelper
import com.example.thin_client.helper.LevelHelper
import com.example.thin_client.helper.TranslateHelper
import com.example.thin_client.model.Constants
import com.example.thin_client.model.Public
import com.example.thin_client.model.Status
import com.example.thin_client.model.UserUpdate
import com.google.android.material.snackbar.Snackbar
import com.google.gson.Gson
import org.json.JSONObject

class EditProfileDialog(
    val user: Public,
    val firstName: String,
    val lastName: String,
    val parentView: View,
    val profile: ProfileFragment,
    val activity: MainActivity
) : DialogFragment() {

    lateinit var avatarView: ImageView
    lateinit var borderView: ImageView
    lateinit var lastNameView: TextView
    lateinit var firstNameView: TextView
    lateinit var saveButton: Button
    lateinit var cancelButton: Button
    var currentAvatar = user.avatar
    var currentBorder: String = user.border
    var currentTitle: String = user.title
    lateinit var titles: AutoCompleteTextView
    val level = LevelHelper.getLevel(user.pointsXP)

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.dialog_edit_profile, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        avatarView = view.findViewById(R.id.chosenAvatar2)
        borderView = view.findViewById(R.id.border_leaderboard)
        lastNameView = view.findViewById(R.id.edit_last_name)
        firstNameView = view.findViewById(R.id.edit_first_name)
        saveButton = view.findViewById(R.id.save_profile_changes)
        cancelButton = view.findViewById(R.id.cancel_profile_changes)

        titles = view.findViewById(R.id.title_selection)!!
        var titlesValue = arrayOf(
            "none",
            "Beginner",
            "Casual",
            "Inspiring",
            "Boss",
            "Amateur",
            "Emerging",
            "Pro",
            "Ancient",
            "Legend"
        )
        if (MainActivity.Settings.isFrench) titlesValue[0] = "aucun titre"
        val titlesUnlocked = titlesValue.copyOf(level)
        var adapter =
            ArrayAdapter(requireContext(), android.R.layout.simple_list_item_1, titlesUnlocked)
        titles.setAdapter(adapter)
        val titleValue =
            if (currentTitle.equals("none") && MainActivity.Settings.isFrench) "aucun titre"
            else if (currentTitle.equals("aucun titre") && !MainActivity.Settings.isFrench) "none"
            else currentTitle
        titles.setText(titleValue, false)

        lastNameView.text = lastName
        firstNameView.text = firstName
        avatarView.setImageResource(AvatarHelper.getAvatarId(user.avatar))

        saveButton.setOnClickListener {
            saveProfileInfo()
            this.dismiss()
        }

        cancelButton.setOnClickListener {
            this.dismiss()
        }

        for (i in 1..10) {
            val imageId = view.resources.getIdentifier(
                "avatar" + i + "_edit_profile",
                "id",
                context?.packageName
            )
            val image = view.findViewById<ImageView>(imageId)!!
            image.setOnClickListener {
                avatarView.setImageDrawable(image.drawable)
                currentAvatar = "avatar$i"
            }
        }

        for (i in 0..level - 1) {
            val imageId = view.resources.getIdentifier("border$i", "id", context?.packageName)
            val image = view.findViewById<ImageView>(imageId)!!
            image.visibility = View.VISIBLE
            image.setOnClickListener {
                if (i == 0) {
                    borderView.setImageResource(0)
                } else {
                    borderView.setImageDrawable(image.drawable)
                }
                currentBorder = "border$i"
            }
        }

        titles.setOnItemClickListener { parent, _, position, _ ->
            currentTitle = parent.getItemAtPosition(position).toString()
            if (currentTitle.equals("aucun titre")) currentTitle = "none"
        }

    }

    fun saveProfileInfo() {
        val queue = Volley.newRequestQueue(requireContext())
        val url = Constants.URL + "database/updateUserInfo"
        val userUpdate = UserUpdate(
            user.username,
            firstNameView.text.toString(),
            lastNameView.text.toString(),
            currentAvatar,
            currentBorder,
            currentTitle
        )
        val body = Gson().toJson(userUpdate)

        val request = JsonObjectRequest(
            Request.Method.PATCH, url, JSONObject(body),
            Response.Listener { response ->
                var result = Gson().fromJson(
                    response.toString(),
                    com.example.thin_client.model.Response::class.java
                )
                if (result.status == Status.UPDATE_OK.value) {
//                        displaySnackbarMessage("Updated successfully")

                    profile.user.userPublic.avatar = currentAvatar
                    profile.user.userPublic.border = currentBorder
                    profile.user.userPublic.title = currentTitle
                    parentView.findViewById<ImageView>(R.id.profile_avatar)
                        ?.setImageResource(AvatarHelper.getAvatarId(currentAvatar))
                    parentView.findViewById<TextView>(R.id.profile_first_name)!!.text =
                        firstNameView.text.toString()
                    parentView.findViewById<TextView>(R.id.profile_last_name)!!.text =
                        lastNameView.text.toString()
                    parentView.findViewById<ImageView>(R.id.border_leaderboard)
                        ?.setImageResource(AvatarHelper.getBorderId(currentBorder))
                    parentView.findViewById<TextView>(R.id.profile_title)!!.text = if (currentTitle.equals("none")) "" else currentTitle
                }
                val message = if(MainActivity.Settings.isFrench) TranslateHelper.editProfile(result.status) else result.message
                displaySnackbarMessage(message)
            },
            Response.ErrorListener {
                displaySnackbarMessage(context?.getString(R.string.generic_error_message)!!)
            })
        queue.add(request)
    }

    private fun displaySnackbarMessage(message: String) {
        val snackbar = Snackbar.make(parentView, message, Snackbar.LENGTH_SHORT)
        snackbar.setTextColor(activity.getColor(R.color.black))
        snackbar.show()
    }
}