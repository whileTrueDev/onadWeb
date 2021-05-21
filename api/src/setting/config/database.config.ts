import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DbSecret } from '../../interfaces/Secrets.interface';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const database: DbSecret = {
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      engine: 'mariadb',
      username: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      dbname: this.configService.get('DB_DATABASE'),
    };

    return {
      type: 'mariadb',
      host: database.host,
      port: database.port,
      username: database.username,
      password: database.password,
      database: database.dbname,
      charset: this.configService.get('DB_CHARSET') || 'utf8mb4',
      timezone: 'Asia/Seoul',
      synchronize: false,
      entities: [`${__dirname}/../../entities/*.{ts,js}`],
    };
  }
}
