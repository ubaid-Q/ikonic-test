import { request } from "express";
import { Not } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Filter, UserRoles } from "../../models";
import { User } from "./user.entity";

export class UserService {
    constructor(private userRepository = AppDataSource.getRepository(User)) { }

    get(filter?: Filter) {
        const take = 10;
        const skip = (filter?.page - 1) * take;
        return this.userRepository.find({
            where: { role: Not(UserRoles.ADMIN) },
            skip,
            take,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
            },
        });
    }

    getById(id?: number, email?: string) {
        return this.userRepository.findOne({
            where: { id, email },
        });
    }

    create(data: User) {
        return this.userRepository.save(data);
    }

    update(id: number, data) {
        return this.userRepository.update({ id }, data);
    }

    delete(id: number) {
        return this.userRepository.delete({ id });
    }
}
