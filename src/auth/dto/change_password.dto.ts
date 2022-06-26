import { IsEmail, IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}