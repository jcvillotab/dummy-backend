import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    surname: string;

    @IsString()
    @IsNotEmpty()
    cellPhoneNumber: string;

    @IsArray()
    roles: number[];

    @IsArray()
    pets: number[];
}