package com.k.api.service

import com.k.api.controller.dto.DeleteUserDTO
import com.k.api.controller.dto.RegisterUserDTO
import com.k.api.controller.dto.LoginDTO
import com.k.api.enum.UserRole
import com.k.api.enum.UserStatus
import com.k.api.model.User
import com.k.api.model.exception.UserNotFoundException
import com.k.api.model.exception.WrongEmailPasswordException
import com.k.api.repository.UserRepository
import org.mindrot.jbcrypt.BCrypt
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

    fun registerNewUser(userInfo: RegisterUserDTO): User {
        userRepository.findByEmail(userInfo.email)?.let {
            throw Exception("This email is already taken")
        }
        val newUser = User(
            id = null,
            email = userInfo.email,
            password = BCrypt.hashpw(userInfo.password, BCrypt.gensalt()),
            firstName = userInfo.firstName,
            lastName = userInfo.lastName,
            role = UserRole.USER,
            userStatus = UserStatus.OK,
            matchInfo = null
        )

        userRepository.insert(newUser)
        return newUser
    }

    fun login(loginInfo: LoginDTO): Boolean {
        val user = userRepository.findByEmail(loginInfo.email)
            ?: throw UserNotFoundException("${loginInfo.email} not found")
        if (!BCrypt.checkpw(loginInfo.password, user.password)) {
            throw WrongEmailPasswordException("Wrong password")
        }
        return true
    }

    fun delete(deleteUserDTO: DeleteUserDTO) {
        val user = userRepository.findByEmail(deleteUserDTO.email)
            ?: throw UserNotFoundException("${deleteUserDTO.email} not found")
        user.id?.let {
            id -> userRepository.deleteById(id)
        }
    }
}