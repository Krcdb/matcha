import { FindUserResponse } from "../interface/find-user-response.interface";
import { UserDB } from "../interface/user-db.interface";

export const mapUserDbToFindUserResponse = (userFromDb: UserDB): FindUserResponse => {
  return {
    id: userFromDb.id,
    fortytwoId: userFromDb.fortytwo_id,
    email: userFromDb.email,
    firstName: userFromDb.first_name,
    lastName: userFromDb.last_name,
    birthdate: userFromDb.birthdate.toISOString(),
    gender: userFromDb.gender,
    sexualPreferences: userFromDb.sexual_preferences,
    fameRating: userFromDb.fame_rating,
    biography: userFromDb.biography,
    isVerified: userFromDb.is_verified,
  };
};