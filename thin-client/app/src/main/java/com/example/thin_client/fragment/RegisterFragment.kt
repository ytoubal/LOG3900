package com.example.thin_client.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.findNavController
import androidx.navigation.fragment.findNavController
import com.aceinteract.android.stepper.StepperNavigationView
import com.example.thin_client.MainActivity
import com.example.thin_client.R
import com.example.thin_client.R.layout
import com.example.thin_client.view_model.UserViewModel


class RegisterFragment : Fragment() {

    private val user: UserViewModel by activityViewModels()
    private lateinit var navigationButtonNext: ImageView
    private lateinit var navigationButtonBack: ImageView
    private lateinit var create_account_button: Button
    var bots = arrayListOf(
        "Botliver",
        "YanisBot",
        "NhienBot",
        "Botlice",
        "YuhanBot",
        "CharlesBot",
        "Virtual Player 1",
        "Virtual Player 2"
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(layout.fragment_register, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        if (MainActivity.Settings.isDarkTheme) view.setBackgroundResource(R.drawable.dark_mountains) else view.setBackgroundResource(
            R.drawable.mountains
        )

        val appBar = activity?.findViewById<androidx.appcompat.widget.Toolbar>(R.id.menu_toolbar)
        appBar?.visibility = View.GONE

        create_account_button = view.findViewById(R.id.create_account_button)
        create_account_button.visibility = View.GONE

        val backButton = activity?.findViewById<ImageButton>(R.id.ic_back)
        backButton?.visibility = View.VISIBLE
        activity?.findViewById<ImageButton>(R.id.ic_back)?.setOnClickListener {
            findNavController().navigate(R.id.action_registerFragment_to_loginFragment)
        }

        activity?.findViewById<TextView>(R.id.sign_in_link)?.setOnClickListener {
            findNavController().navigate(R.id.action_registerFragment_to_loginFragment)
            backButton?.visibility = View.GONE
        }

        navigationButtonNext = activity?.findViewById<ImageView>(R.id.navigate_register_next)!!
        navigationButtonBack = activity?.findViewById<ImageView>(R.id.navigate_register_prev)!!
        navigationButtonBack.visibility = View.GONE
        activity?.findViewById<StepperNavigationView>(R.id.stepper)
            ?.setupWithNavController(activity?.findNavController(R.id.frame_stepper)!!)
        activity?.findViewById<ImageView>(R.id.navigate_register_next)
            ?.setOnClickListener { onNext() }
        activity?.findViewById<ImageView>(R.id.navigate_register_prev)
            ?.setOnClickListener { onPrevious() }
    }

    private fun onNext() {
        user.sendUsername(activity?.findViewById<EditText>(R.id.register_username)?.text.toString())
        user.sendPassword(activity?.findViewById<EditText>(R.id.register_pwd)?.text.toString())
        user.sendFirstName(activity?.findViewById<EditText>(R.id.register_first_name)?.text.toString())
        user.sendLastName(activity?.findViewById<EditText>(R.id.register_last_name)?.text.toString())
        activity?.findViewById<StepperNavigationView>(R.id.stepper)?.goToNextStep()
        create_account_button
        create_account_button.visibility = View.VISIBLE
        navigationButtonBack.visibility = View.VISIBLE
        navigationButtonNext.visibility = View.GONE
    }

    private fun onPrevious() {
        activity?.findViewById<StepperNavigationView>(R.id.stepper)?.goToPreviousStep()
        create_account_button.visibility = View.GONE
        navigationButtonBack.visibility = View.GONE
        navigationButtonNext.visibility = View.VISIBLE
    }

    fun login() {
        user.isNewAccount = true
        findNavController().navigate(R.id.action_registerFragment_to_menuFragment)
    }
}