import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
// Routers
// import passport from './middlewares/passport/passportStrategy';
import passport from './middlewares/passport';
import checkAuthOnReq from './middlewares/auth/checkAuthOnReq';
import alimtalkRouter from './routes/alimtalk';
import testrouter from './routes/testrouter';
import loginRouter from './routes/login';

const MySQLStore = require('express-mysql-session')(session);

process.env.ROOT_PATH = __dirname;
let FRONT_HOST = process.env.DEV_REACT_HOSTNAME;
if (process.env.NODE_ENV === 'production') {
  FRONT_HOST = process.env.PRODUCTION_REACT_HOSTNAME;
}

// swagger 옵션
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

// swagger를 주석으로 작성할 수 있도록.
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Express 에러 타입이 정의되어 있지 않아, 정의.
interface Err extends Error {
  status: number;
  data?: any;
  [key: string]: any;
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

    this.app.use(helmet());

    this.app.use(express.static(path.join(__dirname, 'public'))); // 정적리소스 처리
    this.app.use(bodyParser.json({ limit: '50mb' })); // body parser 설정
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(cookieParser()); // cookie parser 설정

    // use CORS
    const corsOptions = { origin: FRONT_HOST, credentials: true };
    this.app.use(cors(corsOptions));

    // passport 초기화를 통해 'local' 전략이 수립된다.
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    // this.app.use(checkAuthOnReq); // 인증 method를 req에 추가한다.

    // For aws ELB health check
    this.app.get('/', (req, res, next) => {
      res.sendStatus(200);
    });

    // Swagger UI 추가.
    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


    // middleware - Authorizer
    this.app.use((req, res, next) => {
      console.log('middleware - authorizer');
      next();
    });
    // Router 추가
    // app.use('/mailer', mailerRouter);
    this.app.use('/alimtalk', alimtalkRouter);

    this.app.use('/testrouter', testrouter);

    this.app.use('/api/login', loginRouter);

    // Error handling
    // catch 404 and forward to error handler
    this.app.use((req, res, next) => {
      next(createError(404));
    });

    // error handler 무조건 app.use 중 맨 마지막에 위치해야 한다.
    this.app.use((
      err: Err, req: express.Request, res: express.Response, next: express.NextFunction
    ) => {
      console.error('errstack: ', err.stack);
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
