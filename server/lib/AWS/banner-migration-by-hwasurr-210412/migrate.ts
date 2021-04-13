import path from 'path';
import cache from 'memory-cache';
import { Router } from 'express';
import * as S3 from '../S3';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

const router = Router();

router.route('/')
  .get(responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const duration = 30; // 30초
    const CACHE_KEY = 'TEST_IMAGES';
    const cached = cache.get(CACHE_KEY);
    if (cached) {
      console.log('cached items: ', cached.length);
      return responseHelper.send(
        cached.map((x: any) => ({ ...x, bannerSrc: '', })),
        'get',
        res
      );
    }

    const query = 'SELECT * FROM bannerRegistered WHERE marketerId = "gubgoo" LIMIT 3';
    const { result } = await doQuery(query);
    if (!result) next('failed');

    cache.put(CACHE_KEY, result, duration * 1000);
    return responseHelper.send(
      result.map((x: any) => ({ ...x, bannerSrc: '', })),
      'get', res
    );
  }))
  .all(responseHelper.middleware.unusedMethod);

router.route('/migrate')
  .post(responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const query = 'SELECT * FROM bannerRegistered';
    const { result } = await doQuery(query);
    if (!result) next('failed');

    const results = result.map((banner: any) => {
      const fileName = banner.bannerId;
      const fileType = banner.bannerSrc.substring('data:'.length, banner.bannerSrc.indexOf(';base64'));
      let extension = '';
      let imageBuffer: any;
      if (fileType.startsWith('image/')) {
        extension = banner.bannerSrc.substring('data:image/'.length, banner.bannerSrc.indexOf(';base64'));
        imageBuffer = Buffer.from(banner.bannerSrc.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      }
      if (fileType.startsWith('video/')) {
        extension = banner.bannerSrc.substring('data:video/'.length, banner.bannerSrc.indexOf(';base64'));
        imageBuffer = Buffer.from(banner.bannerSrc.replace(/^data:video\/\w+;base64,/, ''), 'base64');
      }
      const file = `${fileName}.${extension}`;
      const s3Path = path.join('banner', banner.marketerId, file);

      if (s3Path && imageBuffer) {
        S3.uploadImageAsync(s3Path, imageBuffer, { ContentType: fileType })
          .then((awsres) => console.log(awsres))
          .catch((err) => console.log(err));
        return true;
      }
    });

    responseHelper.send(results, 'post', res);
  }))
  .all(responseHelper.middleware.unusedMethod);

router.route('/list-all')
  .post(responseHelper.middleware.withErrorCatch(async (req, res, next) => {
    const marketers = await S3.getFolders('banner/');

    if (marketers.CommonPrefixes) {
      const imagesByMarketer = await Promise.all(
        marketers.CommonPrefixes.map((prefix) => {
          const marketer = prefix.Prefix?.replace('banner/', '');
          if (!marketer) return null;
          return S3.getImagesByMarketerId(marketer);
        })
      );

      const lst: { bannerId: string; marketerId: string; imageUrl: string }[] = [];
      imagesByMarketer.map((imageObj) => {
        if (imageObj && imageObj.Contents) {
          imageObj.Contents.forEach((image) => {
            if (image.Key) {
              lst.push({
                bannerId: image.Key?.split('/')[2].split('.')[0],
                marketerId: image.Key?.split('/')[1],
                imageUrl: S3.getBaseUrl() + image.Key,
              });
            }
          });
        }
      });

      Promise.all(
        lst.map((banner) => {
          const query = 'UPDATE bannerRegistered SET bannerSrcUrl = ? WHERE bannerId = ?';
          const queryArray = [banner.imageUrl, banner.bannerId];
          return doQuery(query, queryArray);
        })
      );

      responseHelper.send(lst, 'post', res);
    }
  }))
  .all(responseHelper.middleware.unusedMethod);


export default router;
