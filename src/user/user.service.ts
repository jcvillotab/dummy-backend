import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async createUser(user: RegisterDto){
        const roles = user.roles
        delete user.roles
        return await this.prisma.user.create({
            data: {
                ...user,
                roles : {
                    connect: roles.map(role => ({
                        id: role
                    }))
                }
            },
            include: {
                roles:{
                    select: {
                        id: true,
                    }
                }
            }
        });
    }
    

    async getUserByEmail(email: string){
        return await this.prisma.user.findUnique({
            where: {
                email 
            },
            include: {
                roles:{
                    select: {
                        id: true,
                    }
                }
            }
        })
    }

    async getUserById(id: number){
        return await this.prisma.user.findUnique({
            where: {
                id
            },
            include: {
                roles:{
                    select: {
                        id: true,
                    }
                }
            }
        })
    }

    async updateUser(user: User, id: number){
        return await this.prisma.user.update({
            where: {
                id
            },
            data: {
                ...user
            }
        })
    }

    async getAllUsers(){
        return await this.prisma.user.findMany(
            {
                include: {
                    roles:{
                        select: {
                            id: true,
                        }
                    }
                }
            }
        );
    }

}
