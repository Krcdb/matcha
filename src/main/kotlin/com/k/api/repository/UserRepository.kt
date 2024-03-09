package com.k.api.repository

import com.k.api.model.User
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository: MongoRepository<User, String> {
    fun findByEmail(email: String): User
}

