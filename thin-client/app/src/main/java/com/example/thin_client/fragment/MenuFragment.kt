package com.example.thin_client.fragment

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.content.DialogInterface
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.example.thin_client.R
import com.example.thin_client.view_model.UserViewModel

class MenuFragment : Fragment() {

    private val user: UserViewModel by activityViewModels()
    lateinit var backBtn: ImageButton
    lateinit var tutorialBtn: ImageButton
    lateinit var leaderboardBtn: ImageButton
    lateinit var profileBtn: ImageButton
    lateinit var settingsBtn: ImageButton
    lateinit var fm: FragmentManager

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_menu, container, false)
    }

    @SuppressLint("ResourceType")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        fm = parentFragmentManager

        val appBar = activity?.findViewById<androidx.appcompat.widget.Toolbar>(R.id.menu_toolbar)
        appBar?.visibility = View.VISIBLE

        val app_bar_logo = activity?.findViewById<ImageView>(R.id.app_bar_logo)
        app_bar_logo?.visibility = View.VISIBLE
        val app_bar_title = activity?.findViewById<TextView>(R.id.app_bar_title)
        app_bar_title?.visibility = View.VISIBLE

        backBtn = activity?.findViewById<ImageButton>(R.id.ic_back)!!
        tutorialBtn = activity?.findViewById<ImageButton>(R.id.ic_tutorial)!!
        leaderboardBtn = activity?.findViewById<ImageButton>(R.id.ic_leaderboard)!!
        profileBtn = activity?.findViewById<ImageButton>(R.id.ic_profile)!!
        settingsBtn = activity?.findViewById<ImageButton>(R.id.ic_settings)!!

        backBtn.visibility = View.VISIBLE

        tutorialBtn.visibility = View.VISIBLE
        leaderboardBtn.visibility = View.VISIBLE
        profileBtn.visibility = View.VISIBLE
        settingsBtn.visibility = View.VISIBLE

        settingsBtn.setOnClickListener {
            tutorialBtn.visibility = View.GONE
            fm.beginTransaction()
                .setCustomAnimations(android.R.animator.fade_in, android.R.animator.fade_out)
                .replace(R.id.main_fragment, SettingsFragment(), "settings").commit()
            backBtn.setOnClickListener {
                backToMenu()
            }
        }

        profileBtn.setOnClickListener {
            tutorialBtn.visibility = View.GONE
            fm.beginTransaction()
                .setCustomAnimations(android.R.animator.fade_in, android.R.animator.fade_out)
                .replace(R.id.main_fragment, ProfileFragment(), "profile").commit()
            backBtn.setOnClickListener {
                backToMenu()
            }
        }

        leaderboardBtn.setOnClickListener {
            tutorialBtn.visibility = View.GONE
            fm.beginTransaction()
                .setCustomAnimations(android.R.animator.fade_in, android.R.animator.fade_out)
                .replace(R.id.main_fragment, LeaderboardFragment(), "profile").commit()
            backBtn.setOnClickListener {
                backToMenu()
            }
        }

        tutorialBtn.setOnClickListener {
            tutorialBtn.visibility = View.GONE
            leaderboardBtn.visibility = View.GONE
            profileBtn.visibility = View.GONE
            settingsBtn.visibility = View.GONE
            findNavController().navigate(R.id.action_menuFragment_to_tutorialFragment)
        }

        var lobbyMenu = LobbyMenuFragment()
        val fm: FragmentManager = parentFragmentManager

        fm.beginTransaction()
            .setCustomAnimations(android.R.animator.fade_in, android.R.animator.fade_out)
            .add(R.id.main_fragment, lobbyMenu, "lobbymenu").commit()

        var rooms = RoomFragment()

        fm.beginTransaction()
            .setCustomAnimations(android.R.animator.fade_in, android.R.animator.fade_out)
            .add(R.id.chat_container, rooms, "rooms").commit()

        if (user.isNewAccount) {
            val builder = AlertDialog.Builder(context)
            val dialog = builder
                .setTitle(context?.getString(R.string.welcome_message_title))
                .setMessage(context?.getString(R.string.welcome_message_description))
                .setPositiveButton(
                    context?.getString(R.string.tutorial_start),
                    DialogInterface.OnClickListener { _, _ ->
                        user.isNewAccount = false
                        tutorialBtn.visibility = View.GONE
                        leaderboardBtn.visibility = View.GONE
                        profileBtn.visibility = View.GONE
                        settingsBtn.visibility = View.GONE
                        findNavController().navigate(R.id.action_menuFragment_to_tutorialFragment)
                        backBtn.setOnClickListener {

                            tutorialBtn.visibility = View.VISIBLE
                            leaderboardBtn.visibility = View.VISIBLE
                            profileBtn.visibility = View.VISIBLE
                            settingsBtn.visibility = View.VISIBLE
                            findNavController().navigate(R.id.action_tutorialFragment_to_menuFragment)
                        }
                    })
                .setNegativeButton(
                    context?.getString(R.string.tutorial_skip),
                    DialogInterface.OnClickListener { _, _ ->
                        user.isNewAccount = false
                    })
                .create()

            dialog.show()
            dialog.getButton(AlertDialog.BUTTON_NEGATIVE)
                .setTextColor(resources.getColor(R.color.dark_middle_blue, null))
            dialog.getButton(AlertDialog.BUTTON_POSITIVE)
                .setBackgroundColor(resources.getColor(R.color.red, null))
            dialog.getButton(AlertDialog.BUTTON_POSITIVE)
                .setTextColor(resources.getColor(R.color.white, null))

        }
    }

    fun backToMenu() {
        tutorialBtn.visibility = View.VISIBLE
        leaderboardBtn.visibility = View.VISIBLE
        profileBtn.visibility = View.VISIBLE
        settingsBtn.visibility = View.VISIBLE
        fm.beginTransaction()
            .setCustomAnimations(android.R.animator.fade_in, android.R.animator.fade_out)
            .replace(R.id.main_fragment, LobbyMenuFragment(), "lobbymenu").commit()
    }
}