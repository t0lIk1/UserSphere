import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
  ) {}

  async createUser(dto: CreateUserDto) {
    const candidateByEmail = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (candidateByEmail) {
      throw new HttpException(
        'A user with such email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const candidateByName = await this.userRepository.findOne({
      where: { name: dto.name },
    });
    if (candidateByName) {
      throw new HttpException(
        'A user with such name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.userRepository.create(dto);
  }

  async findAllUsers() {
    return this.userRepository.findAll();
  }

  async findOneUser(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }

  async deleteUser(id: number) {
    const user = await this.validateUser(id);

    await user.destroy();
  }

  async blockUsers(ids: number[]) {
    const users = await this.userRepository.findAll({
      where: { id: ids },
    });

    if (users.length !== ids.length) {
      throw new HttpException(
        'Some users were not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.userRepository.update(
      { isBlocked: true },
      { where: { id: ids } },
    );
  }

  async unblockUsers(ids: number[]) {
    const users = await this.userRepository.findAll({
      where: { id: ids },
    });

    if (users.length !== ids.length) {
      throw new HttpException(
        'Some users were not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.userRepository.update(
      { isBlocked: false },
      { where: { id: ids } },
    );
  }

  async validateUser(identifier: number) {
    const user = await this.userRepository.findOne({
      where: { id: identifier },
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }
}
