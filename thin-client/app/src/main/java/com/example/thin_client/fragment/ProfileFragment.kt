package com.example.thin_client.fragment

import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Build
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.annotation.RequiresApi
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.adapter.FragmentStateAdapter
import androidx.viewpager2.widget.ViewPager2
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.thin_client.MainActivity
import com.example.thin_client.R
import com.example.thin_client.adapter.ConnexionHistoryAdapter
import com.example.thin_client.adapter.MatchHistoryAdapter
import com.example.thin_client.dialog.EditProfileDialog
import com.example.thin_client.helper.AvatarHelper
import com.example.thin_client.helper.LevelHelper
import com.example.thin_client.model.*
import com.example.thin_client.view_model.UserViewModel
import com.google.android.material.snackbar.Snackbar
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayoutMediator
import com.google.gson.Gson
import kotlin.math.round

class ProfileFragment(val isOwnProfile: Boolean = true, val userPublic: Public? = null) :
    Fragment() {

    val user: UserViewModel by activityViewModels()
    lateinit var avatar: ImageView
    lateinit var border: ImageView
    lateinit var username: TextView
    lateinit var firstName: TextView
    lateinit var lastName: TextView
    lateinit var xpView: TextView
    lateinit var xpBar: ProgressBar
    lateinit var gamePlayedView: TextView
    lateinit var pourcentageWinView: TextView
    lateinit var pourcentageBar: ProgressBar
    lateinit var averageTimePlayedView: TextView
    lateinit var totalTimePlayedView: TextView
    lateinit var editProfile: ImageButton
    lateinit var levelBadgeView: TextView
    lateinit var title: TextView

    private lateinit var historyAdapter: HistoryCollectionAdapter
    private lateinit var profileTabs: ViewPager2
    private lateinit var tabLayout: TabLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_profile, container, false)
    }

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
//        backBtn = activity?.findViewById<ImageButton>(R.id.ic_back)!!
//        backBtn.setOnClickListener {
//            findNavController().navigate(R.id.action_profileFragment_to_menuFragment)
//        }

        profileTabs = view.findViewById(R.id.profile_tabs)

        tabLayout = view.findViewById(R.id.tab_layout)

        avatar = view.findViewById(R.id.profile_avatar)
        border = view.findViewById(R.id.border_leaderboard)
        username = view.findViewById(R.id.profile_username)
        firstName = view.findViewById(R.id.profile_first_name)
        lastName = view.findViewById(R.id.profile_last_name)
        xpView = view.findViewById(R.id.profile_show_xp)
        xpBar = view.findViewById(R.id.profile_xp_progress)
        gamePlayedView = view.findViewById(R.id.game_played_value)
        pourcentageWinView = view.findViewById(R.id.pourcentage_win_value)
        pourcentageBar = view.findViewById(R.id.progressBar_winrate)
        averageTimePlayedView = view.findViewById(R.id.average_time_value)
        totalTimePlayedView = view.findViewById(R.id.total_time_played_value)
        editProfile = view.findViewById(R.id.edit_profile)
        levelBadgeView = view.findViewById(R.id.badge_level)
        title = view.findViewById(R.id.profile_title)

        if (isOwnProfile) {
            avatar.setImageResource(AvatarHelper.getAvatarId(user.userPublic.avatar))
            border.setImageResource(AvatarHelper.getBorderId(user.userPublic.border))
            title.text = if (user.userPublic.title == "none") "" else user.userPublic.title
            username.text = user.userPublic.username
            val level = LevelHelper.getLevel(user.userPublic.pointsXP)
            val maxXp =
                if (level != 10) (LevelHelper.getXPForCurrentLevel(level + 1) - 1) else 10000
            xpView.text = user.userPublic.pointsXP.toString() + " / " + maxXp + " XP"
            xpBar.max = maxXp
            xpBar.progress = user.userPublic.pointsXP
            levelBadgeView.text = level.toString()
            getOwnInfo()
            editProfile.setOnClickListener {
                EditProfileDialog(
                    user.userPublic,
                    firstName.text.toString(),
                    lastName.text.toString(),
                    view,
                    this,
                    activity as MainActivity
                ).show(parentFragmentManager, "EditProfileDialog")
            }
        } else {
            avatar.setImageResource(AvatarHelper.getAvatarId(userPublic?.avatar!!))
            title.text = if (user.userPublic.title == "none") "" else user.userPublic.title
            username.text = userPublic.username
            val level = LevelHelper.getLevel(userPublic.pointsXP)
            val maxXp =
                if (level != 10) (LevelHelper.getXPForCurrentLevel(level + 1) - 1) else 10000
            xpView.text = userPublic.pointsXP.toString() + " / " + maxXp + " XP"
            xpBar.max = maxXp
            xpBar.progress = userPublic.pointsXP
            levelBadgeView.text = level.toString()
            view.findViewById<LinearLayout>(R.id.profile_private_wrapper).visibility = View.GONE
            editProfile.visibility = View.GONE
            firstName.visibility = View.GONE
            lastName.visibility = View.GONE
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    fun getOwnInfo() {
        val queue = Volley.newRequestQueue(requireContext())
        val url =
            Constants.URL + "database/retrieveUserInfo?username=" + user.userConnection.username

        val request = JsonObjectRequest(
            Request.Method.GET, url, null,
            Response.Listener { response ->
                var result = Gson().fromJson(response.toString(), UserInfo::class.java)
                showStats(result.private.gameStats)
                firstName.text = result.private.firstName.substring(0, 1)
                    .capitalize() + result.private.firstName.substring(1).toLowerCase()
                lastName.text = result.private.lastName.substring(0, 1)
                    .capitalize() + result.private.lastName.substring(1).toLowerCase()
                historyAdapter = HistoryCollectionAdapter(this, result)
                profileTabs.adapter = historyAdapter
                TabLayoutMediator(tabLayout, profileTabs) { tab, position ->
                    if (position == 0) {
                        tab.text = context?.getString(R.string.profile_match_history)
                    } else if (position == 1) {
                        tab.text = context?.getString(R.string.profile_connection_history)
                    }
                }.attach()
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

    @RequiresApi(Build.VERSION_CODES.O)
    fun showStats(gameStats: GameStats) {
        gamePlayedView.text = gameStats.gamesPlayed.toString()
        val winRate =
            if (gameStats.gamesPlayed == 0) 0f else (gameStats.gamesWon.toFloat() / gameStats.gamesPlayed.toFloat()) * 100
        pourcentageWinView.text =
            if (gameStats.gamesPlayed == 0) "0" else (round(winRate).toInt()).toString()
        pourcentageBar.progress = round(winRate).toInt()
        val averageSeconds =
            if (gameStats.gamesPlayed == 0) 0 else (gameStats.totalGameTime / gameStats.gamesPlayed)
        var timeOfDay = String.format(
            "%02d:%02d:%02d",
            averageSeconds / 3600,
            (averageSeconds % 3600) / 60,
            averageSeconds % 60
        );
        averageTimePlayedView.text = timeOfDay
        timeOfDay = String.format(
            "%02d:%02d:%02d",
            gameStats.totalGameTime / 3600,
            (gameStats.totalGameTime % 3600) / 60,
            gameStats.totalGameTime % 60
        )
        totalTimePlayedView.text = timeOfDay
    }

}

class HistoryCollectionAdapter(fragment: Fragment, val userInfo: UserInfo) :
    FragmentStateAdapter(fragment) {

    override fun getItemCount(): Int = 2

    override fun createFragment(position: Int): Fragment {
        // Return a NEW fragment instance in createFragment(int)
        var fragment: Fragment? = null
        if (position == 0) {
            fragment = MatchHistoryFragment(userInfo.private.gameStats.allGames)
        } else if (position == 1) {
            fragment = ConnexionHistoryFragment(userInfo.private.connections)
        }
        return fragment!!
    }
}

class MatchHistoryFragment(val matchHistory: ArrayList<GameHistory>) : Fragment() {

    private val user: UserViewModel by activityViewModels()
    private lateinit var adapter: MatchHistoryAdapter
    lateinit var recyclerView: RecyclerView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.fragment_match_history, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        matchHistory.reverse()
        adapter = MatchHistoryAdapter(
            activity?.baseContext!!,
            matchHistory,
            MainActivity.Settings.isDarkTheme,
            user.userPublic.username
        )
        recyclerView = view.findViewById(R.id.match_history_list)
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
    }
}

class ConnexionHistoryFragment(val connexionHistory: ArrayList<Array<String>>?) : Fragment() {

    private lateinit var adapter: ConnexionHistoryAdapter
    lateinit var recyclerView: RecyclerView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.fragment_connexion_history, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        connexionHistory?.reverse()
        adapter = ConnexionHistoryAdapter(
            activity?.baseContext!!,
            connexionHistory ?: arrayListOf(),
            MainActivity.Settings.isDarkTheme
        )
        recyclerView = view.findViewById(R.id.connexion_list)
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
    }
}