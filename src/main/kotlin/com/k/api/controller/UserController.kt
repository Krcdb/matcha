package com.k.api.controller

import com.k.api.controller.DTO.AddUserDTO
import com.k.api.model.User
import com.k.api.service.UserService
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/user")
class UserController(
    @Autowired
    val userService: UserService
) {
    private val logger = KotlinLogging.logger {  }

    @GetMapping
    fun getAllUser(): ResponseEntity<List<User>>{
        return ResponseEntity.ok(userService.getAllUser())
    }

    @PostMapping("/add")
    fun addUser(@RequestBody addUserDTO: AddUserDTO): ResponseEntity<String> {
        try {
            var res: String? = userService.addUser(addUserDTO)
        } catch (e: Exception) {
            logger.error { "${e.message}" }

        }
        return ResponseEntity.status(HttpStatus.CREATED).build()
    }
}