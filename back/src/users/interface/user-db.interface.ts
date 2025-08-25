export interface UserDB {
  id: number;
  fortytwo_id?: number;
  email: string;
  first_name: string;
  last_name: string;
  birthdate: Date;
  gender: string;
  sexual_preferences: string;
  fame_rating: number;
  biography: string;
  is_verified: boolean;
}