package com.example.thin_client.fragment

import android.content.Intent
import android.content.res.Configuration
import android.os.Build
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Button
import androidx.annotation.RequiresApi
import androidx.fragment.app.Fragment
import com.example.thin_client.MainActivity
import com.example.thin_client.R
import com.example.thin_client.helper.TranslateHelper
import com.google.gson.Gson
import java.util.*

class SettingsFragment : Fragment() {

    lateinit var settings: AutoCompleteTextView
    lateinit var themes: AutoCompleteTextView
    lateinit var applyBtn: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_settings, container, false)
    }

    @RequiresApi(Build.VERSION_CODES.N)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        settings = activity?.findViewById(R.id.languages_selection)!!
        var languages = arrayOf("English", "Français")
        var adapter = ArrayAdapter(requireContext(), android.R.layout.simple_list_item_1, languages)
        settings.setAdapter(adapter)
        settings.setText(if (MainActivity.Settings.isFrench) "Français" else "English", false)

        themes = activity?.findViewById(R.id.themes)!!
        var theme = if (MainActivity.Settings.isFrench) arrayOf("Clair", "Foncé") else arrayOf(
            "Light",
            "Dark"
        )
        var adapterTheme =
            ArrayAdapter(requireContext(), android.R.layout.simple_list_item_1, theme)
        themes.setAdapter(adapterTheme)
        themes.setText(
            if (MainActivity.Settings.isDarkTheme)
                if (MainActivity.Settings.isFrench) "Foncé" else "Dark"
            else if (MainActivity.Settings.isFrench) "Clair" else "Light", false
        )

        applyBtn = activity?.findViewById(R.id.apply_settings_button)!!

        applyBtn.text = context?.getString(R.string.apply_settings1)

        applyBtn.setOnClickListener {
            var value = settings.text.toString()

            val languageCode = if (value.equals("English")) "en" else "fr"
            val locale = Locale(languageCode)
            Locale.setDefault(locale)
            val config: Configuration = resources.configuration
            config.setLocale(locale)
            context?.resources?.updateConfiguration(config, context?.resources?.displayMetrics)

            value =
                if (MainActivity.Settings.isFrench) TranslateHelper.translateTheme(themes.text.toString()) else themes.text.toString()
            val chosenTheme = if (value.equals("Light")) R.style.LightTheme else R.style.DarkTheme
            MainActivity.Settings.isDarkTheme = chosenTheme == R.style.DarkTheme
            MainActivity.Settings.isFrench = languageCode.equals("fr")

            //TODO logout
            val fm = parentFragmentManager
            if (fm.findFragmentByTag("chatGeneral") != null) {
                val general = (fm.findFragmentByTag("chatGeneral") as ChatFragment)
                general.socket.socket.emit("logout", Gson().toJson(general.user.userConnection.username))
            }

            val refresh = Intent(
                context,
                MainActivity::class.java
            )
            startActivity(refresh)
        }
    }
}