import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { DatabaseService } from "src/common/database/database.service";
import * as bcrypt from "bcrypt";
import { ApiResponse } from "src/common/interface/api-response.interface";
import { CreateUserResponse } from "./interface/user-response.interface";
import { BrevoService } from "src/brevo/brevo.service";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly brevoService: BrevoService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ApiResponse<CreateUserResponse>> {
    const {
      email,
      username,
      firstName,
      lastName,
      password,
      birthdate,
      gender,
      sexualPreference,
      isVerified,
    } = createUserDto;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const insertQuery = this.databaseService.insertQuery(
      "users",
      ["email", "username", "first_name", "last_name", "password", "birthdate", "gender", "sexual_preferences", "is_verified", "verification_code"],
      [email, username, firstName, lastName, hashedPassword, birthdate, gender, sexualPreference, isVerified, verificationCode]
    );

    try {
      await this.databaseService.execute(insertQuery.query, insertQuery.params);

      this.logger.log(`User created: ${email}`);

      await this.brevoService.sendTransactionalEmail(
        [{email}],
        "Verification code",
        `This is your verification code ${verificationCode}`,
      );

      return {
        statusCode: 201,
        message: "User created successfully",
        data: {
          email: email,
          username: username,
        }
      }
    } catch (e: any) {
      this.logger.error(`Error during user creation : ${e.message}`);
      
      if (e.code === "23505") {
        throw new ConflictException("Email or username already exists");
      }
      
      throw new InternalServerErrorException("An unexpected error occurred");
    }
  }

  async findAll() {
    return "findAll"
  }

  async findOne(id: string) {
    return "findOne"
  }
}