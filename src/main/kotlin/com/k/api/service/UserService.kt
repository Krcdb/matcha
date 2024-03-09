package com.k.api.service

import com.k.api.controller.DTO.AddUserDTO
import com.k.api.enum.UserRole
import com.k.api.enum.UserStatus
import com.k.api.model.User
import com.k.api.repository.UserRepository
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class UserService (
    @Autowired
    val userRepository: UserRepository
) {

    fun getAllUser(): List<User> {
        return userRepository.findAll()
    }

    fun addUser(userInfo: AddUserDTO): String? {
        val newUser: User  = User(
            id = null,
            email = userInfo.email,
            password = userInfo.password,
            firstName = userInfo.firstName,
            lastName = userInfo.lastName,
            role = UserRole.USER,
            userStatus = UserStatus.CREATED,
            matchInfo = null
        )

        userRepository.insert(newUser)
        return null
    }
}