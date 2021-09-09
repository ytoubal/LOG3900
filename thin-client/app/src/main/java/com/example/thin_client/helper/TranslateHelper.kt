package com.example.thin_client.helper

import com.example.thin_client.model.Status

object TranslateHelper {

    fun translateDifficulty(frenchDifficulty: String): String {
        return when (frenchDifficulty) {
            "Toutes" -> "Any"
            "Facile" -> "Easy"
            "Moyen" -> "Medium"
            "Difficile" -> "Hard"
            else -> "Any"
        }
    }

    fun translateDifficultyEnglish(englishDifficulty: String): String {
        return when (englishDifficulty) {
            "Any" -> "Toutes"
            "Easy" -> "Facile"
            "Medium" -> "Moyen"
            "Hard" -> "Difficile"
            else -> "Facile"
        }
    }

    fun translateTheme(frenchTheme: String): String {
        return when (frenchTheme) {
            "Foncé" -> "Dark"
            "Clair" -> "Light"
            else -> "Light"
        }
    }

    fun roomMessages(status: Int): String {
        return when(status) {
            Status.HTTP_CREATED.value -> "Ce canal a été crée."
            Status.USER_EXISTS.value -> "Ce canal existe déjà."
            else -> "room"
        }
    }

    fun loginMessages(status: Int): String {
        return when(status) {
            Status.USER_ALREADY_CONNECTED.value -> "Utilisateur déjà connecté."
            Status.USER_INEXISTENT.value -> "Nom d'utilisateur inexistant."
            Status.HTTP_NOT_FOUND.value -> "Nom d'utilisateur ou mot de passe invalide."
            else -> "login"
        }
    }

    fun dbLobbyMessages(status: Int): String {
        return when(status) {
            Status.USER_EXISTS.value -> "Le groupe existe déjà."
            else -> "dbLobby"
        }
    }
    fun lobbyMessages(status: Int): String {
        return when(status) {
            Status.MAXIMUM_USERS.value -> "Le groupe est complet."
            Status.HTTP_NOT_FOUND.value -> "Le groupe a été supprimé."
            else -> "lobby"
        }
    }

    fun editProfile(status: Int): String {
        return when (status) {
            Status.UPDATE_OK.value -> "Votre profil a été mis a jour."
            Status.HTTP_NOT_FOUND.value -> "Une erreur s'est produite. Veuillez réessayer."
            else -> "editProfile"
        }
    }

    fun signUp(status: Int): String {
        return when (status) {
            Status.USER_EXISTS.value -> "Ce nom est déjà utilisé"
            else -> "signup"
        }
    }
}