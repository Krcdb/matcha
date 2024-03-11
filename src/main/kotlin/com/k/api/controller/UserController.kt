package com.k.api.controller

import com.k.api.controller.dto.DeleteUserDTO
import com.k.api.controller.dto.RegisterUserDTO
import com.k.api.controller.dto.LoginDTO
import com.k.api.model.User
import com.k.api.model.exception.ExceptionHandler
import com.k.api.service.UserService
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/user")
class UserController(
    @Autowired
    val userService: UserService,
    @Autowired
    val exceptionHandler: ExceptionHandler
) {
    private val logger = KotlinLogging.logger { }

    @GetMapping
    fun getAllUser(): ResponseEntity<List<User>> {
        return ResponseEntity.ok(userService.getAllUser())
    }

    @PostMapping("/login")
    fun login(@RequestBody loginDTO: LoginDTO): ResponseEntity<String> {
        try {
            userService.login(loginDTO)
            return ResponseEntity.ok("login ok")
        } catch (e: Exception) {
            logger.error { "${e.message}" }
            return exceptionHandler.exceptionToResponseEntity(e)
        }
    }

    @PostMapping("/add")
    fun registerNewUser(@RequestBody registerUserDTO: RegisterUserDTO): ResponseEntity<String> {
        try {
            val newUser: User = userService.registerNewUser(registerUserDTO)
            return ResponseEntity.status(HttpStatus.CREATED).body("user ${newUser.email} added")
        } catch (e: Exception) {
            logger.error { "${e.message}" }
            return exceptionHandler.exceptionToResponseEntity(e)
        }
    }

    @DeleteMapping
    fun deleteUser(@RequestBody deleteUserDTO: DeleteUserDTO): ResponseEntity<String> {
        try {
            userService.delete(deleteUserDTO)
            return ResponseEntity.status(HttpStatus.OK).body("user ${deleteUserDTO.email} deleted")
        } catch (e: Exception) {
            logger.error { "${e.message}" }
            return exceptionHandler.exceptionToResponseEntity(e)
        }

    }
}