import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    forwardRef(() => AuthModule), // Импортируем AuthModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
