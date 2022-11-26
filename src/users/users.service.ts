import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private readonly logger = new Logger(UsersService.name);
  manageNull = (rawData) => {
    if (rawData.length === 0) {
      return null;
    }
    return rawData[0];
  };

  async getUserByNameAndPassword(
    name: string,
    password: string,
  ): Promise<User | null> {
    this.logger.debug(`Checking user with name:${name}`);

    return this.dataSource
      .query(
        'select id, name, subscription_id from users where name = ? and password = ?',
        [name, password],
      )
      .then(this.manageNull);
  }

  async getUserById(id: number): Promise<User | null> {
    this.logger.debug(`Checking user with id:${id}`);
    return this.dataSource
      .query('select id, name, subscription_id from users where id = ?', [id])
      .then(this.manageNull);
  }

  async updateSubscription(id: number, subscriptionId: number) {
    this.logger.debug(`Updating subscription ${subscriptionId} for user ${id}`);
    await this.dataSource.query(
      'update users set subscription_id = ? where id = ?',
      [subscriptionId, id],
    );
  }
}
