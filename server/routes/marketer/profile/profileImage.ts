import express from 'express';
import axios from 'axios';
import createHttpError from 'http-errors';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
import encrypto from '../../../middlewares/encryption';
import setTemporaryPassword from '../../../middlewares/auth/setTemporyPassword';

const router = express.Router();

/**
 * 광고주의 프로필사진을 생성 또는 수정합니다. 프로필사진이 없는 경우 생성, 있는 경우 수정됩니다.
 * @param imageSrc 프로필사진 base64 문자열
 * @param marketerId 프로필 사진을 생성/수정할 광고주 아이디
 * @author hwasurr
 */
const createOrUpdateProfileImage = async (imageSrc: string, marketerId: string) => {
  const query = 'UPDATE marketerInfo SET profileImage = ? WHERE marketerId = ?';
  const { error, result } = await doQuery(query, [imageSrc, marketerId]);
  if (error) throw error;
  return result;
};
/**
 * 광고주의 프로필사진을 조회합니다. 프로필사진이 존재하는 경우 base64 문자열이 반환되고, 없는 경우 null 이 반환됩니다.
 * @param marketerId 프로필 사진을 조회할 광고주 아이디
 * @author hwasurr
 */
const readProfileImage = async (marketerId: string) => {
  const query = 'SELECT profileImage, marketerId FROM marketerInfo WHERE marketerId = ?';
  const { error, result } = await doQuery(query, [marketerId]);
  if (error) throw error;
  return result;
};
/**
 * 광고주의 프로필 사진을 삭제합니다.
 * @param marketerId 프로필 사진을 삭제할 광고주 아이디
 * @author hwasurr
 */
const deleteProfileImage = async (marketerId: string) => {
  const query = 'UPDATE marketerInfo SET profileImage = NULL WHERE marketerId = ?';
  const { error, result } = await doQuery(query, [marketerId]);
  if (error) throw error;
  return result;
};

router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) return responseHelper.promiseError(new createHttpError[401](), next);

      const profileImage = await readProfileImage(marketerId);
      return responseHelper.send(profileImage, 'GET', res);
    })
  )
  .patch(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) return responseHelper.promiseError(new createHttpError[401](), next);

      const profileImage = responseHelper.getParam('profileImage', 'PATCH', req);
      const result = await createOrUpdateProfileImage(profileImage, marketerId);
      return responseHelper.send(result, 'PATCH', res);
    })
  )
  .post(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) return responseHelper.promiseError(new createHttpError[401](), next);

      const profileImage = responseHelper.getParam('profileImage', 'POST', req);
      const result = await createOrUpdateProfileImage(profileImage, marketerId);
      return responseHelper.send(result, 'POST', res);
    })
  )
  .delete(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) return responseHelper.promiseError(new createHttpError[401](), next);

      const result = deleteProfileImage(marketerId);
      return responseHelper.send(result, 'DELETE', res);
    })
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
