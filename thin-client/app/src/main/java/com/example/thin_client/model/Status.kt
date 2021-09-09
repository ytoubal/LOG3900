package com.example.thin_client.model

enum class Status(val value: Int) {
    HTTP_OK(200),
    HTTP_CREATED(201),
    HTTP_BAD_REQUEST(400),
    HTTP_NOT_FOUND(404),
    HTTP_INTERNAL_SERVER_ERROR(500),
    USER_EXISTS(0),
    USER_ALREADY_CONNECTED(1),
    UPDATE_OK(2),
    USER_INEXISTENT(3),
    MAXIMUM_USERS(4),
    LOBBY_JOINED(5)
}