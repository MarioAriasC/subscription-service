import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private subscriptionService: SubscriptionService,
  ) {}

  private readonly logger = new Logger(UsersController.name);

  @Get()
  @UseGuards(JwtAuthGuard)
  getUser(@Request() req) {
    const userId = req.user.userId;
    return this.userService.getUserById(userId).then((user) => {
      if (user === null) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return this.subscriptionService
        .getSubscription(user.subscription_id)
        .then((subscription) => {
          return {
            id: user.id,
            name: user.name,
            subscription: subscription,
          };
        });
    });
  }

  @Post('purchase')
  @UseGuards(JwtAuthGuard)
  modifySubscription(@Request() req, @Body() body: UpdateSubscription) {
    this.logger.debug(body.subscription_id);
    const userId = req.user.userId;
    return this.userService.getUserById(userId).then((user) => {
      if (user === null) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return this.subscriptionService
        .getSubscription(body.subscription_id)
        .then((subscription) => {
          if (subscription === null) {
            throw new HttpException(
              'Subscription not found',
              HttpStatus.NOT_FOUND,
            );
          }
          return this.userService
            .updateSubscription(user.id, subscription.id)
            .then(() => {
              return this.getUser(req);
            });
        });
    });
  }
}
