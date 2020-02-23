import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';

// import checkAuthOnReq from './middlewares/auth/checkAuthOnReq';
import passport from './middlewares/passport';

// Routers
import alimtalkRouter from './routes/alimtalk';
import apiRouter from './routes/api';

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
      description: 'An API server for OnAD platform in nodeJS using typescript',
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

interface Err {
  status?: number;
  stack?: string;
  message?: string;
}

class OnadWebApi {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'ejs');

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
        // expiration: 86400000 // 세션 만료 시간 86400000 = 24h
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production', // production환경 ? true : false
        // maxAge: Date.now() + (30 * 86400 * 1000), // 만료 날짜 설정
      }
    }));

    this.app.use(helmet());
    this.app.use(express.static(path.join(__dirname, 'public'))); // 정적리소스 처리
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(bodyParser.json({ limit: '50mb' })); // body parser 설정
    this.app.use(cookieParser()); // cookie parser 설정

    // use CORS
    const corsOptions = { origin: FRONT_HOST, credentials: true };
    this.app.use(cors(corsOptions));

    // passport 초기화를 통해 'local' 전략이 수립된다.
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // For aws ELB health check
    this.app.get('/', (req, res, next) => {
      res.sendStatus(200);
    });

    // Swagger UI 추가.
    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


    // this.app.use(checkAuthOnReq); // 인증 method를 req에 추가한다.

    // Router 추가
    // this.app.use('/mailer', mailerRouter);
    this.app.use('/alimtalk', alimtalkRouter);

    this.app.use('/api', apiRouter);

    // Error handling
    // catch 404 and forward to error handler
    this.app.use((req, res, next) => {
      // 위의 모든 라우터에도 해당하지 않는 경우 = 없는 페이지

      // next() 함수로 어떠한 내용을 전달하는 경우('route'라는 문자열 제외),
      // Express는 현재의 요청에 오류가 있는 것으로 간주
      // 오류 처리와 관련되지 않은 나머지 라우팅 및 미들웨어 함수를 건너뜁니다.
      next(createError(404));
    });

    // error handler 무조건 app.use 중 맨 마지막에 위치해야 한다.
    this.app.use((
      err: Err, req: express.Request, res: express.Response, next: express.NextFunction
    ) => {
      /** **********************
       * Production Environment
       * 에러메세지에서 Error Stack 정보를 출력하는 것은 대단히 위험한 일이다.
       * 내부적인 코드 구조와 프레임웍 구조를 외부에 노출함으로써, 해커들에게, 해킹을 할 수 있는 정보를 제공하기 때문이다.
       * 일반적인 서비스 구조에서는 아래와 같은 에러 스택정보를 API 에러 메세지에 포함 시키지 않는 것이 바람직 하다.
       * 그렇지만, 내부 개발중이거나 디버깅 시에는 매우 유용한데, API 서비스를 개발시,
       * 서버의 모드를 production과 dev 모드로 분리해서, 옵션에 따라 dev 모드등으로 기동시,
       * REST API의 에러 응답 메세지에 에러 스택 정보를 포함해서 리턴하도록 하면, 디버깅에 매우 유용하게 사용할 수 있다.
       * from https://bcho.tistory.com/914
       ********************** */
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      if (err) {
        // render the error page
        res.status(err.status || 500);
        res.send({
          code: err.status,
          message: err.message || 'Internal Server Error'
        });
      }
    });
  }
}

// console.log('ENVIRONMENT: ', process.env.NODE_ENV);
// console.log(`SCHEDULER: [${taxBillScheduler.name}] - ON `);

// 선언만 하고 start는 bin에서 시작
module.exports = OnadWebApi;
