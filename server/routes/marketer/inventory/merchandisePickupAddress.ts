import { Router } from 'express';
import createHttpError from 'http-errors';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = Router();

const findAddressByMarketer = async (marketerId: string) => {
  const query = `
  SELECT MPA.* FROM merchandisePickupAddresses AS MPA
  JOIN merchandiseRegistered AS MR ON MR.pickupId = MPA.id
  WHERE marketerId = ?
  ORDER BY MPA.createDate LIMIT 2
  `;
  const queryArray = [marketerId];
  const { result } = await doQuery(query, queryArray);
  return result;
};

router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]('unauthorized');
      const result = await findAddressByMarketer(marketerId);

      return responseHelper.send(result, 'get', res);
    })
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
