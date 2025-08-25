import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { DatabaseService } from "src/common/database/database.service";
import * as bcrypt from "bcrypt";
import { ApiResponse } from "src/common/interface/api-response.interface";
import { CreateUserResponse } from "./interface/create-user-response.interface";
import { BrevoService } from "src/brevo/brevo.service";
import { FindUserResponse } from "./interface/find-user-response.interface";
import { mapUserDbToFindUserResponse } from "./mapper/user-db-to-find-user-response.mapper";

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

  async findAll(): Promise<ApiResponse<FindUserResponse[]>> {
    const selectQuery = this.databaseService.selectQuery(
      "users",
      ["*"],
      [],
      [],
    )

    try {
      const res = await this.databaseService.execute(selectQuery.query, selectQuery.params);
      
      const mappedReseult = res.rows.map(mapUserDbToFindUserResponse);

      return {
        statusCode: 200,
        message: "Users finded",
        data: mappedReseult,
      }
    }catch (e: any) {
      this.logger.error(`Error during user creation : ${e.message}`);
      
      throw new InternalServerErrorException("An unexpected error occurred");
    }
  }

  async findOne(id: string): Promise<ApiResponse<FindUserResponse>> {
    const selectQuery = this.databaseService.selectQuery(
      "users",
      ["*"],
      ["id"],
      [id],
    )

    try {
      const res = await this.databaseService.execute(selectQuery.query, selectQuery.params);
      
      if (res.rowCount === 0) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      const mappedReseult = mapUserDbToFindUserResponse(res.rows[0]);

      return {
        statusCode: 200,
        message: "Users finded",
        data: mappedReseult,
      }
    }catch (e: any) {
      this.logger.error(`Error during user creation : ${e.message}`);

      if (e instanceof NotFoundException) {
        throw e;
      }
      
      throw new InternalServerErrorException("An unexpected error occurred");
    }
  }
}