import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  private readonly logger = new Logger(LocalStrategy.name);

  async validate(username: string, password: string): Promise<any> {
    this.logger.debug(`Validating user:${username}`);
    return this.authService.validateUser(username, password).then((user) => {
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    });
  }
}
