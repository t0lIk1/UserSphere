import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {UsersService} from "../users/users.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const auth = req.headers.authorization;

      if (!auth) {
        throw new UnauthorizedException({
          message: 'Authorization header is missing',
        });
      }

      const [bearer, token] = auth.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Invalid authorization format',
        });
      }

      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOneUser(payload.email);

      if (!user) {
        throw new UnauthorizedException({ message: 'User not found' });
      }

      if (user.isBlocked) {
        throw new UnauthorizedException({ message: 'User is blocked' });
      }

      req.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException({ message: 'User not authorized' });
    }
  }
}