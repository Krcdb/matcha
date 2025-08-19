import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { JwtService } from "@nestjs/jwt";
import { ApiResponse } from "../interface/api-response.interface";
import { LoginResponse } from "./interface/login-response.interface";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { VerifyDto } from "./dto/verify.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ApiResponse<LoginResponse>> {
    const {
      username,
      password,
    } = loginDto;

    const selectQuery = this.databaseService.selectQuery(
      "users",
      ["password", "id", "username", "is_verified"],
      ["username"],
      [username]
    );

    try {
      const userResult = await this.databaseService.execute(selectQuery.query, selectQuery.params);
      const user = userResult.rows[0];

      if (!user || !(await bcrypt.compare(password, user.password))) {
        this.logger.error(`Wrong credentials username: ${username} | password: ${password}`)
        throw new UnauthorizedException('Wrong Credentials');
      }
      
      if (!user.is_verified) {
        throw new UnauthorizedException('Is not verified');
      }

      const payload = { userId: user.id, username: user.username };
      const accessToken = await this.jwtService.signAsync(payload);

      return {
        statusCode: 200,
        message: "Logged in successfully",
        data: {
          accessToken
        }
      }
    } catch (e: any) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }

      this.logger.error(`Error during login ${e.message}`);
      throw new InternalServerErrorException("An unexpected error occurred");
    }
  }

  async verify(verifyDto: VerifyDto): Promise<ApiResponse<any>> {
    const {
      username,
      code,
    } = verifyDto;

    const selectQuery = this.databaseService.selectQuery(
      "users",
      ["id", "username", "verification_code"],
      ["username"],
      [username]
    );

    try {
      const userResult = await this.databaseService.execute(selectQuery.query, selectQuery.params);
      const user = userResult.rows[0];

      if (!user || code !== user.verification_code) {
        this.logger.error(`Wrong credentials for code verification username: ${username}`)
        throw new UnauthorizedException('Wrong Credentials');
      }

      const updateQuery = this.databaseService.updateQuery(
        "users",
        ["is_verified"],
        ["true"],
        ["id"],
        [user.id]
      )

      this.databaseService.execute(updateQuery.query, updateQuery.params);

      return {
        statusCode: 200,
        message: "User verified successfully",
      }
    } catch (e: any) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }

      this.logger.error(`Error during login ${e.message}`);
      throw new InternalServerErrorException("An unexpected error occurred");
    }
  }
}