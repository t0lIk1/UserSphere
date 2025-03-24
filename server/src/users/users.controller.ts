import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAllUsers();
  }

  @Get('/:email')
  findOne(@Param('email') email: string) {
    return this.usersService.findOneUser(email);
  }

  @Put('/block')
  @UseGuards(JwtAuthGuard)
  blockUsers(@Body() body: { ids: number[] }) {
    return this.usersService.blockUsers(body.ids);
  }

  @Put('/unblock')
  @UseGuards(JwtAuthGuard)
  unblockUsers(@Body() body: { ids: number[] }) {
    return this.usersService.unblockUsers(body.ids);
  }

  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  deleteUsers(@Body() body: { ids: number[] }) {
    return this.usersService.deleteUsers(body.ids);
  }
}
