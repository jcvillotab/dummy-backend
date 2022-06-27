import { Injectable } from '@nestjs/common';
import { CustomLogger } from 'src/common/utils/custom_logger';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {
    logger: CustomLogger;
    constructor(private prisma: PrismaService){
        this.logger = new CustomLogger(UserService.name);
    }

    async createUser(user: RegisterDto){
        const roles = user.roles
        delete user.roles
        this.logger.debug(`event=create_user outcome=success type=audit`);
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
        this.logger.debug(`event=get_user_by_email outcome=success type=audit`);
        return await this.prisma.user.findUnique({
            where: {
                email 
            },
            include: {
                roles:{
                    select: {
                        id: true,
                    }
                },
                pets:{
                    select: {
                        id: true,
                        name: true,
                        age: true,
                    }
                }
            }
        })
    }

    async getUserById(id: number){
        this.logger.debug('event=get_user_by_id outcome=success type=audit');
        return await this.prisma.user.findUnique({
            where: {
                id
            },
            include: {
                roles:{
                    select: {
                        id: true,
                    }
                },
                pets:{
                    select: {
                        id: true,
                        name: true,
                        age: true,
                    }
                }
            }
        })
    }

    async updateUser(user: User, id: number){
        this.logger.debug(`event=update_user outcome=success type=audit`);
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
        this.logger.debug(`event=get_all_users outcome=success type=audit`);
        return await this.prisma.user.findMany(
            {
                include: {
                    roles:{
                        select: {
                            id: true,
                        }
                    },
                    pets:{
                        select: {
                            id: true,
                            name: true,
                            age: true,
                        }
                    }
                }
            }
        );
    }

}
