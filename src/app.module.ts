import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './user/user.entity';
import { TransferModule } from './transfer/transfer.module';
import { Transfer } from './transfer/transfer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env'
          : '.env.development.local',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [User, Transfer],
        synchronize: true,
      }),
      dataSourceFactory: async (options) => {
        return await new DataSource(<DataSourceOptions>options).initialize();
      },
    }),
    UserModule,
    TransferModule,
  ],
})
export class AppModule {}
// DB_HOST=db
// DB_PORT=5432
// DB_USERNAME=postgres
// DB_PASSWORD=postgres
// DB_DATABASE=postgres
//
// POSTGRES_DB=postgres
// POSTGRES_USER=postgres
// POSTGRES_PASSWORD=postgres
