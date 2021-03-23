import express from 'express';
import createHttpError from 'http-errors';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';

export interface Merchandise {
  id?: number;
  name: string;
  price: number;
  stock: number;
  optionFlag?: boolean;
  description: string;
  images: string[];
  descImages: string[];
  pickupFlag?: boolean;
  pickupAddress?: {
    roadAddress: string; // 도로명 주소
    roadAddressEnglish: string; // 도로명 영어 주소
    roadAddressDetail?: string; // 사용자 입력 상세 주소
    jibunAddress: string; // 지번 주소
    jibunAddressEnglish: string; // 지번 영어 주소
    buildingCode: string; // 건물 코드
    sido: string; // 시/도
    sigungu: string; // 시군구 이름
    sigunguCode: string; // 시군구 코드
    bname: string; // 법정동 이름
    bCode: string; // 법정동 코드
    roadname: string; // 도로명
    roadnameCode: string; // 도로명코드
    zoneCode: string; // 우편번호
  };
  options?: {
    type: string;
    name: string;
    additionalPrice: number;
  }[];
  createDate?: Date;
  updateDate?: Date;
  mallUploadFlag?: boolean;
  soldCount?: number;
  uploadState?: number;
  itemSiteUrl?: string;
}

const router = express.Router();

/**
 * 입력받은 ID에 해당하는 상품 상세 정보를 반환합니다.
 * @param merchandiseId 상품 고유 ID
 * @returns 상품 정보 객체 (픽업주소, 옵션 포함)
 */
const findOne = async (merchandiseId: string): Promise<Merchandise | null> => {
  const selectQuery = `
  SELECT mr.*, mm.itemSiteUrl, mm.soldCount, mm.uploadState
    FROM merchandiseRegistered AS mr
    LEFT JOIN merchandiseMallItems AS mm ON mr.id = mm.merchandiseId
  WHERE mr.id = ?`;
  const selectQueryArray = [merchandiseId];

  const merchandise = await doQuery(selectQuery, selectQueryArray);
  if (merchandise.result.length === 0) return null;
  const targetMerchandise = merchandise.result[0];

  if (targetMerchandise.optionFlag) {
    const optionSelectQuery = 'SELECT * FROM merchandiseOptions WHERE merchandiseId = ?';
    const merchandiseOptions = await doQuery(optionSelectQuery, [merchandiseId]);
    if (merchandiseOptions.result.length === 0) return null;
    const targetMerchandiseOptions = merchandiseOptions.result;
    targetMerchandise.options = targetMerchandiseOptions;
  }

  if (targetMerchandise.pickupFlag) {
    const pickupSelectQuery = 'SELECT * FROM merchandisePickupAddresses WHERE id = ?';
    const merchandisePickupAddress = await doQuery(pickupSelectQuery, [targetMerchandise.pickupId]);
    if (merchandisePickupAddress.result.length === 0) return null;
    const targetMerchandisePickupAddress = merchandisePickupAddress.result[0];
    targetMerchandise.pickupAddress = targetMerchandisePickupAddress;
  }

  const imageListString = targetMerchandise.images.split(',');
  targetMerchandise.images = imageListString;
  targetMerchandise.imagesRes = imageListString;
  return targetMerchandise;
};

/**
 * 입력한 상품명과 중복되는 상품이 있는 지 체크합니다. 있으면 true를 없으면 false를 반환합니다.
 * @param merchandiseName 중복 체크할 상품명
 * @returns {boolean}
 */
const checkNameDulicated = async (merchandiseName: string): Promise<boolean> => {
  const query = 'SELECT COUNT(*) AS duplicatedRowCount FROM merchandiseRegistered WHERE name = ?';
  const { result } = await doQuery(query, [merchandiseName]);
  if (!result || result.length === 0) return false;
  return true;
};

/**
 * 상품 개수 정보 반환 함수
 * @param marketerId 마케터 고유 아이디
 */
const getMerchandiseListLength = async (marketerId: string): Promise<number> => {
  const query = 'SELECT COUNT(*) AS rowCount FROM merchandiseRegistered WHERE marketerId = ?';
  const { result } = await doQuery(query, [marketerId]);
  if (!result || result.length === 0) return 0;
  return result[0].rowCount;
};

/**
 * 해당 상품이 연결된 캠페인 목록 정보 반환 함수
 * @param marketerId 마케터 고유 아이디
 */
const getConnectedCampaigns = async <T = any>(merchandiseId: number): Promise<T> => {
  const query = `SELECT campaignId
  FROM campaign
  WHERE merchandiseId = ? AND deletedState = 0`;
  const { result } = await doQuery<T>(query, [merchandiseId]);
  return result;
};

const findAllbyMarketer = async (marketerId: string): Promise<Merchandise[]> => {
  const query = 'SELECT * FROM merchandiseRegistered WHERE marketerId = ? ORDER BY createDate DESC';
  const { result } = await doQuery<Merchandise[]>(query, [marketerId]);
  return result;
};

/**
 * 해당 마케터의 캠페인에 연결되지 않은 상품들을 반환합니다.
 * @param marketerId 마케터 고유 아이디
 */
const findNotconnectedMerchandises = async (marketerId: string): Promise<Merchandise[]> => {
  const query = `SELECT *
  FROM merchandiseRegistered AS mr
  LEFT JOIN campaign ON merchandiseId = mr.id
  WHERE mr.marketerId = ? AND campaignId IS NULL
  ORDER BY createDate DESC
  `;
  const { result } = await doQuery(query, [marketerId]);
  return result;
};

/**
 * 상품 리스트 정보를 페이지네이션에 따라 반환하는 함수
 * @param marketerId 마케터 고유 아이디
 */
const findWithPagination = async (
  marketerId: string, page: number, offset: number
): Promise<Merchandise[]> => {
  const query = `
    SELECT *
    FROM merchandiseRegistered WHERE marketerId = ?
    ORDER BY createDate DESC
    LIMIT ?, ?
  `;

  const { result } = await doQuery<Merchandise[]>(query, [marketerId, page, offset]);
  return result;
};

/**
 * 상품을 생성하는 함수
 * @param marketerId 마케터 고유 아이디
 * @param merchandise 상품 정보
 */
const createMerchandise = async (
  marketerId: string, merchandise: Merchandise
): Promise<Merchandise> => {
  const {
    name, price, stock, optionFlag, description,
    images, descImages, pickupFlag, pickupAddress, options,
  } = merchandise;
  const insertQuery = `
    INSERT INTO merchandiseRegistered
    (name, price, stock, optionFlag, description, images, descImages, pickupFlag, marketerId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const insertQueryArray = [
    name, price, stock, optionFlag, description, images.join(','), descImages.join(','), pickupFlag, marketerId
  ];
  const { result } = await doQuery(insertQuery, insertQueryArray);
  const merchandiseId = result.insertId;

  // *********************************************************************
  // 상품 픽업 주소가 존재하는 경우
  if (pickupAddress) {
    const {
      roadAddress, roadAddressEnglish, roadAddressDetail, jibunAddress, jibunAddressEnglish,
      buildingCode, sido, sigungu, sigunguCode, bname, bCode, roadname, roadnameCode, zoneCode,
    } = pickupAddress;

    const pickupAddressQuery = `
    INSERT INTO merchandisePickupAddresses (
      roadAddress, roadAddressEnglish, roadAddressDetail, jibunAddress,
      jibunAddressEnglish, buildingCode, sido, sigungu,
      sigunguCode, bname, bCode, roadname, roadnameCode, zoneCode
    ) VALUES (
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )`;

    const pickupAddressQueryArray = [
      roadAddress, roadAddressEnglish, roadAddressDetail, jibunAddress,
      jibunAddressEnglish, buildingCode, sido, sigungu,
      sigunguCode, bname, bCode, roadname, roadnameCode, zoneCode
    ];

    const pickupAddressQueryResult = await doQuery(pickupAddressQuery, pickupAddressQueryArray);
    const pickupAddressId = pickupAddressQueryResult.result.insertId;

    // merchandise pickupId 업데이트
    const pickupAddressUpdateQuery = `
      UPDATE merchandiseRegistered SET pickupId = ? WHERE id = ?
    `;
    const pickupAddressUpdateQueryArray = [pickupAddressId, merchandiseId];
    await doQuery(pickupAddressUpdateQuery, pickupAddressUpdateQueryArray);
  }

  // *************************************************************
  // 옵션이 존재하는 경우
  if (options) {
    options.forEach((option) => {
      const { type, name: optionName, additionalPrice } = option;
      const insertOptionQuery = `INSERT INTO merchandiseOptions
        (merchandiseId, type, name, additionalPrice) VALUES (?, ?, ?, ?)`;
      doQuery(insertOptionQuery, [merchandiseId, type, optionName, additionalPrice]);
    });
  }

  const insertedMerchandise = await doQuery(
    'SELECT * FROM merchandiseRegistered WHERE id = ?',
    [merchandiseId]
  );
  return insertedMerchandise.result[0];
};

/**
 * 상품 삭제 함수
 * @param param0 { marketerId: 광고주 고유 ID, id: 상품고유ID }
 */
const removeMerchandise = async ({
  marketerId, id
}: { marketerId: string; id: number }): Promise<number> => {
  const query = 'DELETE FROM merchandiseRegistered WHERE marketerId = ? AND id = ?';
  const { result } = await doQuery(query, [marketerId, id]);
  return result.affectedRows;
};

// ******************************************************
// Routers

router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch((async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();
      const [page, offset] = responseHelper.getOptionalParam(['page', 'offset'], 'get', req);
      const searchPage = Number(page * offset);
      const searchOffset = Number(offset);

      // 캠페인에 연결되지 않은 상품만을 반환하기를 요청하는 경우
      const onlyNotConnected = responseHelper.getOptionalParam('onlyNotConnected', 'get', req);
      if (onlyNotConnected) {
        const result = await findNotconnectedMerchandises(marketerId);
        return responseHelper.send(result, 'GET', res);
      }

      if (page && offset) {
        const result = await findWithPagination(marketerId, searchPage, searchOffset);
        return responseHelper.send(result, 'GET', res);
      }
      const result = await findAllbyMarketer(marketerId);
      return responseHelper.send(result, 'GET', res);
    }))
  )
  .post(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch((async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();

      const [
        name, price, stock, optionFlag, pickupFlag, description, images, descImages
      ] = responseHelper.getParam([
        'name', 'price', 'stock', 'optionFlag', 'pickupFlag', 'description', 'images', 'descImages',
      ], 'post', req);

      const [pickupAddress, options] = responseHelper.getOptionalParam(
        ['pickupAddress', 'options'], 'post', req
      );

      const result = await createMerchandise(marketerId, {
        name,
        price,
        stock,
        optionFlag,
        description,
        images,
        pickupFlag,
        pickupAddress,
        options,
        descImages,
      });

      responseHelper.send(result, 'post', res);
    }
    ))
  )
  .patch(responseHelper.middleware.unusedMethod)
  .delete(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();
      const id = responseHelper.getParam('id', 'delete', req);

      const connectedCampaigns = await getConnectedCampaigns(id);
      if (connectedCampaigns) return responseHelper.send('connectedCampaign exists', 'delete', res);

      const reuslt = await removeMerchandise({ marketerId, id });
      return responseHelper.send(reuslt, 'delete', res);
    })
  );

/**
 * 개별 상품 상세 정보 라우터
 */
router.route('/:id')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();
      const { id } = req.params;
      if (!id) throw new createHttpError[400]();

      const merchandise = await findOne(id);

      return responseHelper.send(merchandise, 'get', res);
    })
  ).all(responseHelper.middleware.unusedMethod);

/**
 * 마케터의 총 랜딩URL 리스트 목록 길이를 반환하는 라우터
 */
router.route('/length')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();
      const lengthCount = await getMerchandiseListLength(marketerId);
      responseHelper.send(lengthCount, 'get', res);
    })
  )
  .all(responseHelper.middleware.unusedMethod);

/**
 * 상품과 연결된 캠페인 여부 체크
 */
router.route('/campaigns')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const id = responseHelper.getParam('id', 'get', req);
      const lengthCount = await getConnectedCampaigns(id);
      responseHelper.send(lengthCount, 'get', res);
    })
  );

/**
 * 상품명 중복 체크
 */
router.route('/dup-check')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const name = responseHelper.getParam('name', 'get', req);
      const isDuplicated = await checkNameDulicated(name);
      responseHelper.send(isDuplicated, 'get', res);
    }),
  );
export default router;
