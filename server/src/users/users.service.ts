import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {User} from './users.model';
import {CreateUserDto} from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private userRepository: typeof User,
    ) {
    }

    async createUser(dto: CreateUserDto) {
        return this.userRepository.create(dto);
    }

    async findAllUsers() {
        return this.userRepository.findAll();
    }

    async findOneUser(email: string) {
        return await this.validateUser(email);
    }

    async deleteUser(id: number) {
        const user = await this.validateUser(id);

        await user.destroy();
    }

    async unblockUser(id: number) {
        const user = await this.validateUser(id);
        console.log(user)
        if (!user.dataValues.isBlocked) {
            throw new HttpException(`User with ID ${id} is not blocked`, HttpStatus.BAD_REQUEST);
        }
        await this.userRepository.update({isBlocked: false}, {where: {id}});
    }

    async blockUser(id: number) {
        const user = await this.validateUser(id);
        if (user.dataValues.isBlocked) {
            throw new HttpException(`User with ID ${id} is already blocked`, HttpStatus.BAD_REQUEST);
        }
        await this.userRepository.update({isBlocked: true}, {where: {id}});
    }


    async validateUser(identifier: number | string) {
        let user: User | null;
        console.log(identifier, typeof identifier);
        if (typeof identifier === 'number') {
            user = await this.userRepository.findOne({where: {id: identifier}});
        } else {
            user = await this.userRepository.findOne({where: {email: identifier}});
        }
        if (!user) {
            throw new NotFoundException(`User not found`);
        }

        return user;
    }
}