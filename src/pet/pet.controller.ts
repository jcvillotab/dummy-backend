import { Controller } from "@nestjs/common";
import { PetService } from "./pet.service";

@Controller('pet')
export class PetController {
    constructor(private petService: PetService) {}

    async getAllPets() {
        return await this.petService.getAllPets();
    }
}