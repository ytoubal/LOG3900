package com.example.thin_client.dialog

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageButton
import android.widget.TextView
import androidx.fragment.app.DialogFragment
import com.example.thin_client.R
import com.example.thin_client.fragment.ProfileFragment
import com.example.thin_client.model.Public

class ViewProfileDialog(val profileFragment: ProfileFragment, val user: Public) : DialogFragment() {

    lateinit var closeButton: Button
    lateinit var backBtn: ImageButton
    lateinit var profileText: TextView

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.dialog_view_profile, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val fm = childFragmentManager
        fm.beginTransaction()
            .setCustomAnimations(android.R.animator.fade_in, android.R.animator.fade_out)
            .replace(R.id.profile_fragment_leaderboard, profileFragment, "viewProfile").commit()

        profileText = view.findViewById(R.id.profile_name_leaderboard)
        profileText.text = "${user.username}'s Profile"

        closeButton = view.findViewById(R.id.close_profile_button)
        closeButton.setOnClickListener {
            this.dismiss()
        }
    }

}