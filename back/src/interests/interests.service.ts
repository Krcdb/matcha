import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { UpdateInterestsDto } from './dto/update-interest.dto';
import { ApiResponse } from 'src/common/interface/api-response.interface';

@Injectable()
export class InterestsService {
  private readonly logger = new Logger(InterestsService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async updateInterests(updateInterestsDto: UpdateInterestsDto): Promise<ApiResponse<null>> {
    const {userId, interests} = updateInterestsDto;

    try {
      await this.deleteInterests(userId);

      interests.forEach(async (interest) => {
        try {
          let interestId: number;

          const selectQuery = this.databaseService.selectQuery(
            "interests",
            ["id"],
            ["name"],
            [interest],
          )
          
          const selectResult = await this.databaseService.execute(selectQuery.query, selectQuery.params);

          if (selectResult.rowCount) {
            interestId = selectResult.rows[0].id;
          } else {
            const insertInterestsQuery = this.databaseService.insertQuery(
              "interests",
              ["name"],
              [interest],
              ["id"],
            )
          
            const resultUpdateInterests = await this.databaseService.execute(insertInterestsQuery.query, insertInterestsQuery.params);
            interestId = resultUpdateInterests.rows[0].id;
          }

          
          const insertQuery = this.databaseService.insertQuery(
            "users_interests",
            ["user_id", "interest_id"],
            [userId.toString(), interestId.toString()]
          )

          await this.databaseService.execute(insertQuery.query, insertQuery.params);
        } catch (e) {
          if (e.code === "23505") {
            this.logger.error(`Interest ${interest} already exist`);
          } else {
            throw new InternalServerErrorException("An unexpected error occurred")
          }
        }
      })

      const message = `Interest updated successfully for user ${userId}`

      this.logger.log(message)

      return {
        statusCode: 201,
        message,
      }
    } catch (e) {
      this.logger.error(`Error while unliking: ${e.message}`);

      if (e.code === "23505") {
        throw new ConflictException("Block relation already exist");
      }

      throw new InternalServerErrorException("An unexpected error occurred")
    }
  }

  async deleteInterests(userId: number) {
    try {
      const deleteQuery = this.databaseService.deleteQuery(
        "users_interests",
        ["user_id"],
        [userId.toString()]
      );

      const result = await this.databaseService.execute(deleteQuery.query, deleteQuery.params);

      this.logger.log(`Successfully removed ${result.rowCount} interests from user ${userId}`);
    } catch (e) {
      this.logger.error(`Error while unliking: ${e.message}`);

      throw new InternalServerErrorException("An unexpected error occurred")
    }
  }
}
