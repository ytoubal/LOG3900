package com.example.thin_client.fragment

import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.thin_client.MainActivity
import com.example.thin_client.R
import com.example.thin_client.adapter.LobbyListAdapter
import com.example.thin_client.dialog.CreateLobbyDialog
import com.example.thin_client.helper.TranslateHelper
import com.example.thin_client.model.*
import com.example.thin_client.view_model.UserViewModel
import com.google.android.material.snackbar.Snackbar
import com.google.gson.Gson
import org.json.JSONObject

class LobbyMenuFragment : Fragment(), RecyclerViewLobbyListener {

    private val user: UserViewModel by activityViewModels()
    lateinit var difficulty: AutoCompleteTextView
    lateinit var searchBtn: Button
    lateinit var createBtn: ImageView
    lateinit var refreshBtn: ImageView
    lateinit var backBtn: ImageButton
    private lateinit var lobbyListAdapter: LobbyListAdapter
    lateinit var recyclerView: RecyclerView
    var lobbies: ArrayList<Lobby> = arrayListOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_lobby_menu, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        lobbyListAdapter = LobbyListAdapter(
            activity?.baseContext!!,
            lobbies,
            this,
            MainActivity.Settings.isDarkTheme
        )
        recyclerView = view.findViewById(R.id.lobby_list)
        recyclerView.adapter = lobbyListAdapter

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

        getAllLobbiesrequest(true)

        activity?.findViewById<ImageButton>(R.id.ic_tutorial)?.visibility = View.VISIBLE
        activity?.findViewById<ImageButton>(R.id.ic_leaderboard)?.visibility = View.VISIBLE
        activity?.findViewById<ImageButton>(R.id.ic_profile)?.visibility = View.VISIBLE
        activity?.findViewById<ImageButton>(R.id.ic_settings)?.visibility = View.VISIBLE

        backBtn = activity?.findViewById<ImageButton>(R.id.ic_back)!!
        backBtn.visibility = View.VISIBLE
        backBtn.setOnClickListener {
            view.post {
                val fm: FragmentManager = parentFragmentManager
                //Remove all fragments on logout
                val chatFm = fm.findFragmentByTag("chatGeneral")?.parentFragmentManager
                if (chatFm != null) {
                    for (fragment in chatFm.fragments) {
                        chatFm.beginTransaction().remove(fragment).commit()
                    }
                }
                user.isNewAccount = false
                findNavController().navigate(R.id.action_menuFragment_to_loginFragment)
                backBtn.visibility = View.GONE
            }
        }

        difficulty = activity?.findViewById(R.id.lobby_difficulty_selection)!!
        var difficulties = if (MainActivity.Settings.isFrench) arrayOf(
            "Toutes",
            "Facile",
            "Moyen",
            "Difficile"
        ) else arrayOf("Any", "Easy", "Medium", "Hard")
        var adapter =
            ArrayAdapter(requireContext(), android.R.layout.simple_list_item_1, difficulties)
        difficulty.setAdapter(adapter)
        difficulty.setText(if (MainActivity.Settings.isFrench) "Toutes" else "Any", false)

        refreshBtn = activity?.findViewById(R.id.refresh_lobbies)!!
        refreshBtn.setOnClickListener {
            getAllLobbiesrequest(true)
        }

        searchBtn = activity?.findViewById(R.id.lobby_filter_button)!!
        searchBtn.setOnClickListener {
            getAllLobbiesrequest(false)
        }

        createBtn = activity?.findViewById(R.id.create_lobby)!!
        createBtn.setOnClickListener {

            CreateLobbyDialog(
                parentFragmentManager, view, activity as MainActivity
            ).show(parentFragmentManager, "CreateLobbyDialog")
        }
    }

    fun notifyToRecyclerView() {
        activity?.runOnUiThread {
            lobbyListAdapter.notifyDataSetChanged()
        }
    }

    override fun onJoinLobbyClicked(v: View, p: Int) {
        joinLobbyRequest(p)
    }

    private fun getAllLobbiesrequest(refreshList: Boolean) {
        val queue = Volley.newRequestQueue(requireContext())
        val url = Constants.URL + "database/all-lobbies"

        val request = JsonArrayRequest(
            Request.Method.GET, url, null,
            Response.Listener { response ->
                var result = Gson().fromJson(response.toString(), Array<Lobby>::class.java).toList()
                lobbies.clear()
                lobbies.addAll(result)

                if (!refreshList) filterSearch()
                notifyToRecyclerView()
            },
            Response.ErrorListener {
                displaySnackbarMessage(context?.getString(R.string.generic_error_message)!!)
            })
        queue.add(request)
    }

    fun joinLobbyRequest(lobbyIndex: Int) {
        val queue = Volley.newRequestQueue(requireContext())
        val url = Constants.URL + "database/lobby-users"
        val lobbyChosen = lobbies[lobbyIndex]
        val body = HashMap<String, Any>()
        body["name"] = lobbyChosen.name
        body["user"] = JSONObject(Gson().toJson(user.userPublic))

        val request = JsonObjectRequest(Request.Method.POST, url, JSONObject(body as Map<*, *>),
            Response.Listener { response ->
                var result = Gson().fromJson(
                    response.toString(),
                    com.example.thin_client.model.Response::class.java
                )
                if (result.status == Status.LOBBY_JOINED.value) {
                    val response = if (result.message != null) Gson().fromJson(
                        result.message,
                        Array<Public>::class.java
                    ).toCollection(ArrayList()) else arrayListOf<Public>()
                    lobbyChosen.users = response
                    val fm: FragmentManager = parentFragmentManager
                    var lobby = LobbyFragment(lobbyChosen)
                    fm.beginTransaction().hide(this).commit()
                    fm.beginTransaction().add(R.id.main_fragment, lobby, "lobby").commit()
                } else {
                    val message = if(MainActivity.Settings.isFrench) TranslateHelper.lobbyMessages(result.status) else result.message
                    displaySnackbarMessage(message)
                }
            },
            Response.ErrorListener {
                displaySnackbarMessage(context?.getString(R.string.generic_error_message)!!)
            })
        queue.add(request)
    }

    private fun filterSearch() {
        var diff =
            if (MainActivity.Settings.isFrench) TranslateHelper.translateDifficulty(difficulty.text.toString()) else difficulty.text.toString()
        var newLobbies = ArrayList<Lobby>(lobbies.filter { lobby ->
            lobby.name.contains(
                view?.findViewById<EditText>(R.id.search_lobby_name)!!.text.trim()
            )
        })
        if (!diff.equals("Any"))
            newLobbies =
                ArrayList<Lobby>(newLobbies.filter { lobby -> lobby.difficulty.equals(diff) })

        lobbies.clear()
        lobbies.addAll(newLobbies)

        if (lobbies.isEmpty()) displaySnackbarMessage(requireContext().getString(R.string.no_lobby_found))
    }

    private fun displaySnackbarMessage(message: String) {
        val snackbar = Snackbar.make(requireView(), message, Snackbar.LENGTH_SHORT)
        snackbar.setTextColor(activity?.getColor(R.color.black)!!)
        snackbar.show()
    }
}
