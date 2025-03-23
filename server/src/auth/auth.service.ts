import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(@Body() userDto: LoginUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(@Body() userDto: CreateUserDto) {
    const candidate = await this.usersService.findOneUser(userDto.email);
    if (candidate) {
      throw new HttpException(
        'A user with such email exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(userDto.password, 4);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashedPassword,
    });
    return this.generateToken(user);
  }

  generateToken(user: User) {
    const payload = {
      name: user.dataValues.name,
      email: user.dataValues.email,
      id: user.id,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: LoginUserDto) {
    const user = await this.usersService.findOneUser(userDto.email);
    console.log(user, '000OK');
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    console.log(user, '000OK');

    if (user.dataValues.isBlocked) {
      throw new HttpException('User is blocked', HttpStatus.FORBIDDEN);
    }
    console.log(user, '000OK');

    if (!userDto.password || !user.dataValues.password) {
      console.error('Invalid credentials:', { userDto, user });
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    console.log(user, "000OK")

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.dataValues.password,
    );
    console.log('passwordEquals:', passwordEquals);
    if (passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({ message: 'Incorrect password or email' });
  }
}
