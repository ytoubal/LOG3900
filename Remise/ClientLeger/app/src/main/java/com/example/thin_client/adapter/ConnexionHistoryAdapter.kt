package com.example.thin_client.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.thin_client.R

class ConnexionHistoryAdapter(
    private val context: Context,
    private val connexionHistoryList: ArrayList<Array<String>>,
    private val isDarkTheme: Boolean
) : RecyclerView.Adapter<ConnexionHistoryAdapter.ViewHolder>() {

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): ConnexionHistoryAdapter.ViewHolder {
        val root = LayoutInflater.from(context).inflate(R.layout.row_connexion, parent, false)
        return ViewHolder(root)
    }

    override fun getItemCount(): Int {
        return connexionHistoryList.size
    }

    override fun onBindViewHolder(holder: ConnexionHistoryAdapter.ViewHolder, position: Int) {
        val connexionHistoryData = connexionHistoryList[position]
        val connexion = connexionHistoryData[0]
        val deconnexion = connexionHistoryData[1]

        holder.debut.text = connexion
        holder.fin.text = deconnexion
    }

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val debut = itemView.findViewById<TextView>(R.id.debut_connexion)
        val fin = itemView.findViewById<TextView>(R.id.fin_connexion)
    }
}