import express from 'express';
import Controller from '../index';

export default class CreatorController extends Controller {
  public path = '/creator';

  public router = express.Router();

  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(this.path, this.getOneCreator);
    // this.router.post(this.path, this.createCreator);
  }

  getOneCreator = (
    req: express.Request, res: express.Response, next: express.NextFunction
  ): void => {
    const query = 'select * from creaotrInfo where creatorId = ?';
    const queryArray = [];
    const result = 'some result';
    res.send(result);
  }
}
