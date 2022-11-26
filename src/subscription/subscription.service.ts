import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Subscription } from './interface/subscription.interface';

@Injectable()
export class SubscriptionService {
  constructor(@InjectDataSource() private datasource: DataSource) {}

  private readonly logger = new Logger(SubscriptionService.name);

  getSubscriptions(): Promise<Subscription[]> {
    this.logger.debug('Returning all subscriptions');
    return this.datasource.query('select * from subscription');
  }

  async getSubscription(id: number): Promise<Subscription | null> {
    this.logger.debug(`Returning subscription with id:${id}`);
    return this.datasource
      .query('select * from subscription where id = ?', [id])
      .then((rawData) => {
        this.logger.debug(rawData);
        if (rawData.length === 0) {
          return null;
        }
        return rawData[0];
      });
  }
}
