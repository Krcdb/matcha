package com.k.api.model

import com.k.api.enum.Gender
import com.k.api.enum.SexualPreference
import com.k.api.enum.UserRole
import com.k.api.enum.UserStatus
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

@Document("user")
data class User(

        @Id
        var id: String?,
        @Indexed(unique = true)
        var email: String,
        var password: String,
        var firstName: String,
        var lastName: String,
        var role: UserRole?,

        var userStatus: UserStatus?,

        var matchInfo: MatchInfo?,

)

data class MatchInfo (
        var gender: Gender?,
        var sexualPreference: SexualPreference?,
        var biography: String?,
        var tags: List<String>,
        var picture: List<String>,
        var watchBy: List<String>,
        var likeBy: List<String>,
        var matchWith: List<String>,
        var block: List<String>,
        var fameRating: Int?,
)
