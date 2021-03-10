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
}

const router = express.Router();

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
  const { result } = await doQuery(query, [merchandiseId]);
  return result;
};

/**
 * 상품 리스트 정보 반환 함수
 * @param marketerId 마케터 고유 아이디
 */
const findWithPagination = async (
  marketerId: string, page: number, offset: number
): Promise<Merchandise[]> => {
  const query = `
    SELECT id, name, price, stock, optionFlag, description, images, pickupFlag, pickupId
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
    name, price, stock, optionFlag, description, images, pickupFlag, pickupAddress, options,
  } = merchandise;
  const insertQuery = `
    INSERT INTO merchandiseRegistered
    (name, price, stock, optionFlag, description, images, pickupFlag, marketerId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const insertQueryArray = [
    name, price, stock, optionFlag, description, images.join(','), pickupFlag, marketerId
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
      if (!marketerId) throw createHttpError[401];
      const [page, offset] = responseHelper.getParam(['page', 'offset'], 'get', req);
      const searchPage = Number(page * offset);
      const searchOffset = Number(offset);

      const result = await findWithPagination(marketerId, searchPage, searchOffset);
      responseHelper.send(result, 'GET', res);
    }))
  )
  .post(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch((async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw createHttpError[401];

      const [
        name, price, stock, optionFlag, pickupFlag, description, images
      ] = responseHelper.getParam([
        'name', 'price', 'stock', 'optionFlag', 'pickupFlag', 'description', 'images',
      ], 'post', req);

      const [pickupAddress, options] = responseHelper.getOptionalParam(
        ['pickupAddress', 'options'], 'post', req
      );

      const result = await createMerchandise(marketerId, {
        name, price, stock, optionFlag, description, images, pickupFlag, pickupAddress, options,
      });

      responseHelper.send(result, 'post', res);
    }
    ))
  )
  .patch()
  .delete(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw createHttpError[401];
      const id = responseHelper.getParam('id', 'delete', req);
      const reuslt = await removeMerchandise({ marketerId, id });
      responseHelper.send(reuslt, 'delete', res);
    })
  );

/**
 * 마케터의 총 랜딩URL 리스트 목록 길이를 반환하는 라우터
 */
router.route('/length')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw createHttpError[401];
      const lengthCount = await getMerchandiseListLength(marketerId);
      responseHelper.send(lengthCount, 'get', res);
    })
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/campaigns')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const id = responseHelper.getParam('id', 'get', req);
      const lengthCount = await getConnectedCampaigns(id);
      responseHelper.send(lengthCount, 'get', res);
    })
  );
export default router;
