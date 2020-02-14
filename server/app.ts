import path from 'path';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import session from 'express-session';
import dotenv from 'dotenv';// 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
// Routers
import alimtalkRouter from './routes/alimtalk';

dotenv.config();


const MySQLStore = require('express-mysql-session')(session);

process.env.ROOT_PATH = __dirname;
let FRONT_HOST = process.env.DEV_REACT_HOSTNAME;
if (process.env.NODE_ENV === 'production') {
  FRONT_HOST = process.env.PRODUCTION_REACT_HOSTNAME;
}

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: '1.0.0',
      title: 'OnAD web API',
      description: 'A API server for OnAD platform in nodeJS using typescript',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      },
      contact: {
        name: 'whileTrue',
      },
      servers: ['localhost:3000'],
    },
  },
  // ['.routes/*.ts']
  apis: ['routes/**/*.ts', 'routes/**/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

interface Err extends Error {
  status: number;
  data?: any;
}

class OnadWebApi {
  public app: express.Express;

  constructor() {
    this.app = express();

    // session 처리
    this.app.use(session({
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
      }),
      cookie: {
        secure: false
      }
    }));

    // 정적리소스 처리
    this.app.use(express.static(path.join(__dirname, 'public')));

    // body parser 설정
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    // cookie parser 설정
    this.app.use(cookieParser());

    // 인증 method를 req에 추가한다.
    // app.use(checkAuthOnReq);
    // use CORS
    const corsOptions = { origin: FRONT_HOST, credentials: true };
    this.app.use(cors(corsOptions));

    // passport 초기화를 통해 'local' 전략이 수립된다.
    // this.app.use(passport.initialize());
    // this.app.use(passport.session());

    // For aws ELB health check
    this.app.get('/', (req, res, next) => {
      res.sendStatus(200);
    });

    // Swagger UI 추가.
    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // Router 추가
    // app.use('/mailer', mailerRouter);
    this.app.use('/alimtalk', alimtalkRouter);


    // Error handling
    // catch 404 and forward to error handler
    this.app.use((req, res, next) => {
      next(createError(404));
    });

    // error handler 무조건 app.use 중 맨 마지막에 위치해야 한다.
    this.app.use((err: Err, req: express.Request, res: express.Response) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      if (err) {
        // render the error page
        res.status(err.status || 500);
        res.render('error');
      }
    });
  }
}

// console.log('ENVIRONMENT: ', process.env.NODE_ENV);
// console.log(`SCHEDULER: [${taxBillScheduler.name}] - ON `);

// 선언만 하고 start는 bin에서 시작
module.exports = OnadWebApi;
