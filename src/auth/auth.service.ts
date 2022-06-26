import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { LoginAuthDto } from './dto/login_auth.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService, private userService: UserService) {}

    async generateToken(userId: number, email:string, roles: number[]) {
        const accessToken:string = await this.jwtService.signAsync({
            sub: userId,
            email,
            roles
        },
        {
            secret: process.env.JWT_SECRET,
            expiresIn: '1h'
        });

        return accessToken;
    }

    async register(dto: RegisterDto){
        if(await this.userService.getUserByEmail(dto.email)){
            throw new BadRequestException('User already exists');
        }

        dto.password = await argon2.hash(dto.password);
        let user = await this.userService.createUser(dto);
    

        return {
            message: "User created successfully", 
        };
    }

    async login(dto: LoginAuthDto){
        const user = await this.userService.getUserByEmail(dto.username);
        
        if(!user){
            throw new BadRequestException('User does not exist');
        }

        const isValid = await argon2.verify(user.password, dto.password);
        if(!isValid){
            throw new BadRequestException('Invalid password');
        }

        const token = await this.generateToken(user.id, user.email, user.roles.map(role => role.id));
        

        return {
            email: user.email,
            token: token,
        };
    }
}
