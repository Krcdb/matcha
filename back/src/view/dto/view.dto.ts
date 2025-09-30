import { IsNumber, IsPositive } from "class-validator";

export class ViewDto {
	@IsNumber()
	@IsPositive()
	viewer: number;

	@IsNumber()
	@IsPositive()
	viewed: number;
}
