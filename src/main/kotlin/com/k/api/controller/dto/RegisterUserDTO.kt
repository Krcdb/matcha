package com.k.api.controller.dto

data class RegisterUserDTO(
    val email: String,
    val password: String,
    val firstName: String,
    val lastName: String
)
