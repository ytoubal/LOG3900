package com.example.thin_client

import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    object Settings {
        var isDarkTheme = true
        var isFrench = false
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(if (Settings.isDarkTheme) R.style.DarkTheme_NoActionBar else R.style.LightTheme_NoActionBar)
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menu_main, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            else -> super.onOptionsItemSelected(item)
        }
    }

}