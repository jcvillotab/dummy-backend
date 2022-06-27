import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import _ from "lodash";
import { CustomLogger } from "src/common/utils/custom_logger";
import { PetDto } from "./dto/pet.dto";

@Injectable()
export class PetService {
    logger: CustomLogger;
    constructor(private prisma: PrismaService) {
        this.logger = new CustomLogger(PetService.name);
    }

    async createPet(pet: PetDto) {
        const user = pet.user_id
        delete pet.user_id
        const newpet = _.omit(PetDto, ['user_id']);
        this.logger.debug(`event=create_pet outcome=success type=audit`);
        return await this.prisma.pet.create({
            data: {
                ...newpet,
                user: {connect: {id: user}}
            }
        });
    }

    async getPetById(id: number) {
        this.logger.debug(`event=get_pet_by_id outcome=success type=audit`);
        return await this.prisma.pet.findUnique({
            where: {
                id
            }
        });
    }

    async updatePet(pet: PetDto, id: number) {
        this.logger.debug(`event=update_pet outcome=success type=audit`);
        return await this.prisma.pet.update({
            where: {
                id
            },
            data: {
                ...pet
            }
        });
    }

    async getAllPets() {
        this.logger.debug("event=get_all_pets outcome=success type=audit");
        return await this.prisma.pet.findMany();
    }
}