import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';
import colorizedMorgan from '../middlewares/colorizedMorgan.middleware';

const MySQLStore = require('express-mysql-session')(session);

export class AppSetting {
  private corsOptions = {
    origin: [
      'https://onad.io',
      'https://test.onad.io',
      'https://test-cpa.onad.io',
      'https://admin.onad.io',
      'http://localhost:3001',
      'http://localhost:3011',
    ],
    credentials: true,
  };

  constructor(private app: NestExpressApplication) {}

  public initialize(): void {
    this.app.use(helmet());
    this.app.use(cors(this.corsOptions));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(cookieParser('@#@$MYSIGN#@$#$'));
    this.app.use(colorizedMorgan);
    this.app.use(
      session({
        secret: '@#@$MYSIGN#@$#$',
        resave: false,
        saveUninitialized: false,
        // mysql session store
        store: new MySQLStore({
          host: process.env.SESSION_STORE_DB_HOST,
          port: process.env.SESSION_STORE_DB_PORT,
          user: process.env.SESSION_STORE_DB_USER,
          password: process.env.SESSION_STORE_DB_PASSWORD,
          database: process.env.SESSION_STORE_DB_DATABASE,
          // expiration: 86400000 // 세션 만료 시간 86400000 = 24h
        }),
        cookie: {
          sameSite: 'lax',
          secure: false, // production환경 ? true : false
          httpOnly: true,
          // maxAge: Date.now() + (30 * 86400 * 1000), // 만료 날짜 설정
        },
      }),
    );

    // passport 초기화를 통해 'local' 전략이 수립된다.
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }
}
