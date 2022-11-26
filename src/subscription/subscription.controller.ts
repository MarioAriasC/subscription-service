import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './interface/subscription.interface';

@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  private readonly logger = new Logger(SubscriptionController.name);

  @Get()
  async findAll(): Promise<Subscription[]> {
    return this.subscriptionService.getSubscriptions();
  }

  @Get(':id')
  async findOne(@Param() params): Promise<Subscription> {
    return this.subscriptionService
      .getSubscription(params.id)
      .then((subscription) => {
        this.logger.debug(`Subscription: ${subscription}`);
        if (subscription === null) {
          throw new HttpException(
            'Subscription not found',
            HttpStatus.NOT_FOUND,
          );
        } else {
          return subscription;
        }
      });
  }
}
