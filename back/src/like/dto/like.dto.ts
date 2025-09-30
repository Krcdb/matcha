import { IsNumber, IsPositive } from "class-validator";

export class LikeDto {
	@IsNumber()
	@IsPositive()
	liker: number;

	@IsNumber()
	@IsPositive()
	liked: number;
}
