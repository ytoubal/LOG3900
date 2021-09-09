package com.example.thin_client.dialog

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import com.example.thin_client.R
import com.gusakov.library.PulseCountDown
import com.gusakov.library.start

class CountDownDialog(val duration: Int = 5) : DialogFragment() {

    private lateinit var pulseCountDown: PulseCountDown

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.dialog_countdown, container, false)

    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        pulseCountDown = view.findViewById(R.id.pulseCountDown)!!
        dialog?.window?.setBackgroundDrawableResource(android.R.color.transparent);
        pulseCountDown.startValue = duration
        pulseCountDown.start { this.dismiss() }
    }
}