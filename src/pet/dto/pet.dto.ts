import { IsString, IsNotEmpty, IsArray, IsNumber, isString } from "class-validator";

export class PetDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    age: number;

    @IsString()
    @IsNotEmpty()
    gender: string;

    @IsString()
    @IsNotEmpty()
    breed: string;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsNumber()
    @IsNotEmpty()
    weight: number;

    @IsNumber()
    @IsNotEmpty()
    height: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsNumber()
    @IsNotEmpty()
    user_id: number;
}