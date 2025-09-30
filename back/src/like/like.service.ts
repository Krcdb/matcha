import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from "@nestjs/common";
import { DatabaseService } from "src/common/database/database.service";
import { LikeDto } from "./dto/like.dto";
import { ApiResponse } from "src/common/interface/api-response.interface";
import { LikeResponse } from "./interface/like-response.interface";
import { ConnectedService } from "src/connected/connected.service";

@Injectable()
export class LikeService {
	private readonly logger = new Logger(LikeService.name);

	constructor(
		private readonly databaseService: DatabaseService,
		private readonly connectedService: ConnectedService,
	) {}

	async newLike(likeDto: LikeDto): Promise<ApiResponse<LikeResponse>> {
		const { liker, liked } = likeDto;

		const selectQuery = this.databaseService.selectQuery(
			"liked",
			["*"],
			["liker", "liked"],
			[liked.toString(), liker.toString()],
		);

		try {
			const selectResult = await this.databaseService.execute(
				selectQuery.query,
				selectQuery.params,
			);

			// this.logger.debug(`row count ${selectResult.rows[0].liker}`);
			if (selectResult.rowCount > 0) {
				await this.connectedService.connected({
					userId: liker,
					connected: liked,
				});

				this.logger.log(
					`User ${liker} liked back ${liked}, new connection created`,
				);

				await this.unlike({ liked: liker, liker: liked });

				return {
					statusCode: 201,
					message: `User ${liker} liked back ${liked}, new connection created`,
					data: {
						liker,
						liked,
					},
				};
			}

			const insertQuery = this.databaseService.insertQuery(
				"liked",
				["liker", "liked"],
				[liker.toString(), liked.toString()],
			);

			await this.databaseService.execute(insertQuery.query, insertQuery.params);

			this.logger.log(`User ${liker} liked ${liked}`);

			return {
				statusCode: 201,
				message: `User ${liker} liked ${liked}`,
				data: {
					liker,
					liked,
				},
			};
		} catch (e: any) {
			this.logger.error(`Error during user creation : ${e.message}`);

			throw new InternalServerErrorException("An unexpected error occurred");
		}
	}

	async unlike(likeDto: LikeDto): Promise<ApiResponse<LikeResponse>> {
		const { liker, liked } = likeDto;

		const deleteQuery = this.databaseService.deleteQuery(
			"liked",
			["liker", "liked"],
			[liker.toString(), liked.toString()],
		);
		try {
			const result = await this.databaseService.execute(
				deleteQuery.query,
				deleteQuery.params,
			);

			const statusCode = result.rowCount ? 200 : 204;
			const message = result.rowCount
				? "Unliked successfully"
				: "Nothing to unlike";

			this.logger.log(message);

			return {
				statusCode,
				message,
				data: {
					liker,
					liked,
				},
			};
		} catch (e) {
			this.logger.error(`Error while unliking: ${e.message}`);

			throw new InternalServerErrorException("An unexpected error occurred");
		}
	}
}
