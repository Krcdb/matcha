package com.k.api.model.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component

@Component
class ExceptionHandler {
    fun exceptionToResponseEntity(e: Exception): ResponseEntity<String> {
        when (e) {
            is EmailAlreadyTakenException -> return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.message)
            is UserNotFoundException -> return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.message)
            is WrongEmailPasswordException -> return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.message)
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
    }

}