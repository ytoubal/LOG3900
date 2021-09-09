package com.example.thin_client.fragment

import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.Volley
import com.example.thin_client.MainActivity
import com.example.thin_client.R
import com.example.thin_client.adapter.LeaderboardAdapter
import com.example.thin_client.model.*
import com.example.thin_client.view_model.UserViewModel
import com.google.android.material.snackbar.Snackbar
import com.google.gson.Gson

class LeaderboardFragment : Fragment() {

    private val user: UserViewModel by activityViewModels()
    private lateinit var adapter: LeaderboardAdapter
    lateinit var recyclerView: RecyclerView
    var leaderboard: ArrayList<UserLeaderboard> = arrayListOf()
    var usersPublic: ArrayList<Public> = ArrayList()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_leaderboard, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        adapter = LeaderboardAdapter(
            activity?.baseContext!!,
            leaderboard,
            MainActivity.Settings.isDarkTheme
        )
        recyclerView = view.findViewById(R.id.leaderboard_list)
        recyclerView.adapter = adapter

        val layoutManager = LinearLayoutManager(requireContext())
        recyclerView.layoutManager = layoutManager
        val divider = DividerItemDecoration(recyclerView.context, layoutManager.orientation)
        divider.setDrawable(
            ColorDrawable(
                if (MainActivity.Settings.isDarkTheme) Color.parseColor("#FFFFFFFF") else Color.parseColor(
                    "#FF000000"
                )
            )
        )
        recyclerView.addItemDecoration(divider)

        getAllUsersPublicRequest()
    }

    fun notifyToRecyclerView() {
        activity?.runOnUiThread {
            adapter.notifyDataSetChanged()
        }
    }

    private fun getAllUsersPublicRequest() {
        val queue = Volley.newRequestQueue(requireContext())
        val url = Constants.URL + "database/all-usersPublic"

        val request = JsonArrayRequest(
            Request.Method.GET, url, null,
            Response.Listener { response ->
                var result =
                    Gson().fromJson(response.toString(), Array<Public>::class.java).toList()
                usersPublic.clear()
                usersPublic.addAll(result)
                filterLeaderboard()
            },
            Response.ErrorListener {
                displaySnackbarMessage(context?.getString(R.string.generic_error_message)!!)
            })
        queue.add(request)
    }

    private fun displaySnackbarMessage(message: String) {
        val snackbar = Snackbar.make(requireView(), message, Snackbar.LENGTH_SHORT)
        snackbar.setTextColor(activity?.getColor(R.color.black)!!)
        snackbar.show()
    }

    fun filterLeaderboard() {
        usersPublic.sortByDescending { user -> user.pointsXP }

        var numInLeaderBoard = if (usersPublic.size > 14) 14 else usersPublic.size - 1

        for (i in 0..numInLeaderBoard) {
            leaderboard.add(
                UserLeaderboard(
                    usersPublic[i],
                    i + 1,
                    usersPublic[i].username.equals(user.userPublic.username)
                )
            )
        }

        if (leaderboard.indexOfFirst { userPublic -> userPublic.user.username.equals(user.userPublic.username) } == -1) {
            val index =
                usersPublic.indexOfFirst { userPublic -> userPublic.username.equals(user.userPublic.username) }
            if (index != -1)
                leaderboard.add(UserLeaderboard(usersPublic[index], index + 1, true))
        }
        notifyToRecyclerView()
    }

}