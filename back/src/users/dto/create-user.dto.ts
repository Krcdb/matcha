import {
	IsEmail,
	IsString,
	IsDateString,
	IsBoolean,
	MinLength,
	MaxLength,
} from "class-validator";

export class CreateUserDto {
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(3)
	@MaxLength(20)
	username: string;

	@IsString()
	@MinLength(2)
	firstName: string;

	@IsString()
	@MinLength(2)
	lastName: string;

	@IsString()
	@MinLength(8)
	password: string;

	@IsDateString()
	birthdate: string;

	@IsString()
	gender: string;

	@IsString()
	sexualPreference: string;

	@IsBoolean()
	isVerified: boolean;
}
