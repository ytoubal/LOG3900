package com.example.light_prototype.fragments

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.Button
import android.widget.EditText
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.light_prototype.R
import com.example.light_prototype.model.Status
import com.example.light_prototype.view_models.UserViewModel
import com.google.android.material.snackbar.Snackbar
import com.google.gson.Gson
import org.json.JSONObject

class LoginFragment : Fragment(), TextWatcher {

    private val user: UserViewModel by activityViewModels()
    private lateinit var nickname: EditText
    private lateinit var join: Button

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_login, container, false)
    }

    @SuppressLint("NewApi")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        nickname = view.findViewById(R.id.editTextTextPersonName)
        nickname.addTextChangedListener(this)
        join = view.findViewById(R.id.button_first)
        join.isEnabled = false

        activity?.findViewById<Button>(R.id.backButton)?.visibility = View.GONE

        join.setOnClickListener {
            val keyboardManager = activity?.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
            keyboardManager.hideSoftInputFromWindow(view?.windowToken, 0)
            request()
        }
    }

    fun navigate() {
        findNavController().navigate(R.id.action_FirstFragment_to_SecondFragment)

        user.sendNickname(nickname.text.toString().trim())
    }

    fun request() {
        val queue = Volley.newRequestQueue(requireContext())
        val url = "https://painseau.herokuapp.com/database/insert"
        val body = HashMap<String,String>()
        body["username"] = nickname.text.toString().trim()

        val request = JsonObjectRequest(Request.Method.POST, url, JSONObject(body as Map<*, *>),
                Response.Listener { response ->
                    var result = Gson().fromJson(response.toString(), com.example.light_prototype.model.Response::class.java)
                    if (result.status == Status.HTTP_CREATED.value) {
                        navigate()
                    } else {
                        displaySnackbarMessage(result.message)
                    }
                },
                Response.ErrorListener { Log.d("Problem", it.toString())
                    displaySnackbarMessage(it.toString())
                })
        queue.add(request)
    }

    private fun displaySnackbarMessage(message: String) {
        val snackbar = Snackbar.make(requireView(), message, Snackbar.LENGTH_SHORT)
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
                    nickname.error = "Nickname must be alphanumeric";
                    join.isEnabled = false
                }
                s.length > 12 -> {
                    nickname.error = "Nickname must be under 12 characters";
                    join.isEnabled = false
                }
                s.isEmpty() -> {
                    nickname.error = "Please enter a nickname";
                    join.isEnabled = false
                }
                else -> {
                    join.isEnabled = true
                }
            }
        }
    }


}