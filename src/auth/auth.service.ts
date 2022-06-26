import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { LoginAuthDto } from './dto/login_auth.dto';
import { ChangePasswordDto } from './dto/change_password.dto';
import { randomBytes } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { PasswordResetDto } from './dto/password_reset.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService, private userService: UserService, private mailService: MailService) {}

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

    async sendEmailReset(dto: ChangePasswordDto){
        const user = await this.userService.getUserByEmail(dto.email);
        if(!user){
            throw new BadRequestException('User not found');
        }

        const token = randomBytes(20).toString('hex');

        await this.prisma.user.update({
            where: {
                email: dto.email
            },
            data: {
                passwordResetToken: token,
                passwordResetExpires: new Date(Date.now() + 360000)
            }
        });
        
        const message:string = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n
        Please click on the following link, or paste this into your browser to complete the process:\n
        http://${process.env.DOMAIN}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.`

            
        return await this.mailService.sendMail(dto.email,'Reset your password',message);
    }

    async resetPassword(dto: PasswordResetDto){
        const user = await this.prisma.user.findFirst({
            where: {
                passwordResetToken: dto.token,
            },
            select: {
                id: true,
                passwordResetExpires: true,
                passwordResetToken: true
            }
        });

        if(!user){
            throw new BadRequestException('Token not found');
        }

        if(user.passwordResetExpires < new Date()){
            throw new BadRequestException('Token expired');
        }


        const newPassword = await argon2.hash(dto.newPassword);
        return await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: newPassword,
                passwordResetToken: "",
                passwordResetExpires: undefined
            },
            select:{
                id: true
            }
        });
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
