import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionModule } from './subscription/subscription.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

function extractSize(rawData) {
  return rawData[0]['size'];
}

@Module({
  imports: [
    SubscriptionModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [],
        synchronize: true,
      }),
      dataSourceFactory: async (options) => {
        const logger = new Logger('Initialise database');
        const dataSource = await new DataSource(options).initialize();
        logger.debug('Checking table subscription');
        const subscriptionData = async () => {
          logger.debug('Inserting data on table subscription');
          await dataSource.query(
            `insert into subscription(name, cost) values('ZumCare', 10);`,
          );
          await dataSource.query(
            `insert into subscription(name, cost) values('ZumCare+', 20);`,
          );
        };
        dataSource
          .query('select count(*) as size from subscription')
          .then((rawData) => {
            // logger.debug(rawData);
            const size = extractSize(rawData);
            logger.debug(`subscriptions in the table:${size}`);
            if (size === 0) {
              subscriptionData();
            }
          })
          .catch((error: QueryFailedError) => {
            logger.warn(`Error checking table subscription ${error.message}`);
            logger.debug('Creating table subscription');
            dataSource.query(`create table subscription(
                id int primary key auto_increment,
                name varchar(64) not null unique,
                cost float default 0
            );`);
            subscriptionData();
          });
        logger.debug('Checking table users');
        const usersData = async () => {
          logger.debug('Inserting data on table users');
          await dataSource.query(
            `insert into users(name, password) values('Mario', 'pass123!')`,
          );
          await dataSource.query(
            `insert into users(name, password) values('Ari', 'pass123!')`,
          );
          await dataSource.query(
            `insert into users(name, password) values('Veronika', 'pass123!')`,
          );
        };
        dataSource
          .query('select count(*) as size from users')
          .then((rawData) => {
            const size = extractSize(rawData);
            logger.debug(`users in the table:${size}`);
            if (size === 0) {
              usersData();
            }
          })
          .catch((error: QueryFailedError) => {
            logger.warn(`Error checking table users ${error.message}`);
            logger.debug('Creating table users');
            dataSource.query(`create table users
            (
                id              int primary key auto_increment,
                name            varchar(64) not null unique,
                password        varchar(64) not null,
                subscription_id int         null,
                constraint foreign key (subscription_id) references subscription (id)
            );`);
            usersData();
          });
        return dataSource;
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
