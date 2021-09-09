package com.example.thin_client.fragment

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.ImageView
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.example.thin_client.MainActivity
import com.example.thin_client.R
import com.example.thin_client.view_model.UserViewModel

class UsernamePasswordFragment : Fragment(), TextWatcher {

    lateinit var username: EditText
    private lateinit var firstName: EditText
    private lateinit var lastName: EditText
    private lateinit var pwd: EditText
    private lateinit var confirm_pwd: EditText
    private lateinit var register: ImageView
    private val user: UserViewModel by activityViewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_username_password, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        username = activity?.findViewById(R.id.register_username)!!
        firstName = activity?.findViewById(R.id.register_first_name)!!
        lastName = activity?.findViewById(R.id.register_last_name)!!
        pwd = activity?.findViewById(R.id.register_pwd)!!
        confirm_pwd = activity?.findViewById(R.id.register_confirm_pwd)!!
        register = activity?.findViewById(R.id.navigate_register_next)!!

        register.isEnabled = false

        username.addTextChangedListener(this)
        firstName.addTextChangedListener(this)
        lastName.addTextChangedListener(this)
        pwd.addTextChangedListener(this)
        confirm_pwd.addTextChangedListener(this)

        username.setText(user.userConnection.username)
        firstName.setText(user.userPrivate.firstName)
        lastName.setText(user.userPrivate.lastName)
        pwd.setText(user.userConnection.password)
        confirm_pwd.setText(user.userConnection.password)
    }


    override fun afterTextChanged(s: Editable?) {
    }

    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
    }

    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {

        if (s != null) {
            when {
                s.hashCode() == username.text.hashCode() -> {
                    when {
                        s.trim().length > 12 -> {
                            username.error =
                                if (MainActivity.Settings.isFrench) "Le nom d'utilisateur ne doit pas dépasser 12 caractères" else "Username must be under 12 characters";
                            register.isEnabled = false
                        }
                        s.isEmpty() -> {
                            username.error =
                                if (MainActivity.Settings.isFrench) "Veuillez entrer un nom d'utilisateur" else "Please enter a username";
                            register.isEnabled = false
                        }
                        else -> {
                            username.error = null
                        }
                    }
                }
                s.hashCode() == pwd.text.hashCode() -> {
                    when {
                        s.trim().length < 3 -> {
                            pwd.error =
                                if (MainActivity.Settings.isFrench) "Le mot de passe doit être au moins 3 caractères" else "Password must be at least 3 characters";
                            register.isEnabled = false
                        }
                        s.isEmpty() -> {
                            pwd.error = "Please enter a password";
                            register.isEnabled = false
                        }
                        !s.toString().contentEquals(confirm_pwd.text) -> {
                            confirm_pwd.error =
                                if (MainActivity.Settings.isFrench) "Les mots de passe ne correspondent pas" else "The password don't match";
                            register.isEnabled = false
                        }
                        s.toString().contentEquals(confirm_pwd.text) -> {
                            pwd.error = null
                            confirm_pwd.error = null
                        }
                        else -> {
                            pwd.error = null
                        }
                    }
                }
                s.hashCode() == confirm_pwd.text.hashCode() -> {
                    if (!s.toString().contentEquals(pwd.text)) {
                        confirm_pwd.error =
                            if (MainActivity.Settings.isFrench) "Les mots de passe ne correspondent pas" else "The password don't match";
                        register.isEnabled = false
                    } else {
                        confirm_pwd.error = null
                    }
                }
            }
            register.isEnabled =
                username.error == null && firstName.error == null && lastName.error == null && pwd.error == null && confirm_pwd.error == null &&
                        username.text.trim().isNotEmpty() && firstName.text.trim()
                    .isNotEmpty() && lastName.text.trim()
                    .isNotEmpty() && pwd.text.length > 2 && confirm_pwd.text.length > 2
        }
    }
}