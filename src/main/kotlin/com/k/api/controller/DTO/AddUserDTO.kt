package com.k.api.controller.DTO

data class AddUserDTO(
    val email: String,
    val password: String,
    val firstName: String,
    val lastName: String
)
