import express from 'express';
import Controller from '../index';

export default class CreatorController extends Controller {
  public path = '/creator';

  public router = express.Router();

  constructor() {
    super();
    this.initializeRoutes();
    this.initializeSubRoutes([
      // new SubRoute1(),
      // new SubRoute2(),
    ]);
  }

  private initializeSubRoutes(subRoutes: Controller[]): void {
    subRoutes.forEach((route) => {
      this.router.use(route.path, route.router);
    });
  }

  private initializeRoutes(): void {
    this.router.route(this.path)
      .get(
        this.middlewares.checkSessionExists,
        this.middlewares.withErrorCatch(this.getOneCreator)
      )
      .all(this.middlewares.unusedMethod);
  }

  getOneCreator = async (
    req: express.Request, res: express.Response, next: express.NextFunction
  ): Promise<void> => {
    const query = 'select * from creaotrInfo where creatorId = ?';
    const queryArray = [];
    const result = 'some result';
    res.send(result);
  }
}
