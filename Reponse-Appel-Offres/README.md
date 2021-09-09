Instructions pour démarrer les prototypes.

Démarrer Client lourd (Électron) :
    - Naviguer dans heavy-client et ouvrir client.exe

Démarrer Client léger :
    - Naviguer dans light-client et compiler le code dans android studio et ouvrir dans l'émulateur.

Démarrer Serveur:
    - Le serveur est déployé sur Heroku à https://painseau.herokuapp.com/.
    - On peut voir le contenu de la base de données à https://painseau.herokuapp.com/database/all (Montre les usagers connectés).
    - Avec la commmande $ heroku logs --tail
     On peut voir les logs du serveur. (Nous demander pour montrer, sinon un compte heroku collaborateur lié au répertoire doit être crée. )


Répertoires : 
    heavy-client : Contient l'executable Electron pour le client lourd.
    light-client : Contient le code à compiler sur l'émulateur Android.
    server: Contient le code du client lourd et le code du serveur.
