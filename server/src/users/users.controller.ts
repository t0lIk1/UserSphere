import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {
    }

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

    @Put('/:id/block')
    blockUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.blockUser(id);
    }

    @Put('/:id/unblock')
    unblockUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.unblockUser(id);
    }

    @Delete('/:id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.deleteUser(id);
    }
}