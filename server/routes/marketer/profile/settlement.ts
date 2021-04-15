/* eslint-disable class-methods-use-this */
import express from 'express';
import createHttpError from 'http-errors';
import encrypto from '../../../middlewares/encryption';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
import slack from '../../../lib/slack/messageWithJson';
import settlementLogsRouter from './settlementLogs/settlementLogs';

const router = express.Router();
router.use('/logs', settlementLogsRouter);

export interface MarketerSettlement {
  id: number;
  marketerId: string;
  name: string;
  identificationNumber: string;
  bankAccountOwner: string;
  bankAccountNumber: string;
  state: number;
  businessmanFlag: boolean;
  identificationImgSrc: string;
  bankAccountImgSrc: string;
  createDate: string;
  updateDate: string;
}

type CreateSettlementDto = Omit<MarketerSettlement, 'id' | 'marketerId' | 'createDate' |'updateDate' | 'state'> & { bankName: string };
type UpdateSettlementDto = Omit<MarketerSettlement, 'marketerId' | 'createDate' |'updateDate' | 'state'> & { bankName: string };
type FindSettlemtDto = MarketerSettlement & { bankName: string };
class SettlementService {
  private static _tableName = 'marketerSettlement';

  private static makeAccountNumber(bankName: string, account: string): string {
    return `${bankName}_${account}`;
  }
  private static decomposeAccountNumber(
    accountNumber: string
  ): { bankName: string; account: string } {
    const [bankName, account] = accountNumber.split('_');
    return { bankName, account };
  }

  /**
   * 정산등록 객체의 데이터를 모두 암호화합니다.
   * @param dto 정산등록 POST DTO 
   * @returns 복호화를 진행한 정산 등록 객체를 반환합니다.
   */
  private static encryptSettlement<T extends CreateSettlementDto>(
    dto: T
  ): T {
    return {
      ...dto,
      // 계좌번호 암호화
      bankAccountNumber: encrypto.encipher(
        this.makeAccountNumber(dto.bankName, dto.bankAccountNumber)
      ),
      // 주민등록번호 암호화
      identificationNumber: encrypto.encipher(dto.identificationNumber),
      // 주민등록증 이미지 암호화
      identificationImgSrc: encrypto.encipher(dto.identificationImgSrc),
      // 통장 사본 이미지 암호화
      bankAccountImgSrc: encrypto.encipher(dto.bankAccountImgSrc),
    };
  }

  /**
   * 정산등록 객체의 암호화된 데이터를 모두 복호화합니다.
   * @param settlement 정산등록 객체
   * @returns 복호화를 진행한 정산 등록 객체를 반환합니다.
   */
  private static decryptSettlement(settlement: MarketerSettlement): FindSettlemtDto {
    const decipherAccountNumber = encrypto.decipher(settlement.bankAccountNumber);
    const { account, bankName } = this.decomposeAccountNumber(decipherAccountNumber);
    return {
      ...settlement,
      bankName,
      bankAccountNumber: account,
      identificationNumber: encrypto.decipher(settlement.identificationNumber),
      identificationImgSrc: encrypto.decipher(settlement.identificationImgSrc),
      bankAccountImgSrc: encrypto.decipher(settlement.bankAccountImgSrc),
    };
  }

  /**
   * 해당 광고주의 정산등록 신청을 조회합니다.
   * @param marketerId 마케터 고유 아이디
   * @returns 정산 등록 객체 또는 null
   */
  static async findOne(marketerId: string): Promise<MarketerSettlement | null> {
    const query = `SELECT * FROM ${this._tableName}
    WHERE marketerId = ? ORDER BY createDate LIMIT 1`;
    const queryArray = [marketerId];
    const { result } = await doQuery<MarketerSettlement[]>(query, queryArray);
    if (!result || result.length === 0) return null;
    return this.decryptSettlement(result[0]);
  }

  /**
   * 해당 광고주의 정산 등록 신청 목록을 조회합니다.
   * @param marketerId 마케터 고유 아이디
   * @returns 정산 등록 객체 배열
   */
  static async findAll(marketerId: string): Promise<FindSettlemtDto[]> {
    const query = `SELECT * FROM ${this._tableName} WHERE marketerId = ? ORDER BY createDate`;
    const queryArray = [marketerId];
    const { result } = await doQuery<MarketerSettlement[]>(query, queryArray);
    return result.map((settlement) => this.decryptSettlement(settlement));
  }

  /**
   * 해당 마케터의 정산 등록을 생성합니다.
   * @param marketerId 마케터 고유 아이디
   * @param dto 정산 등록을 위한 데이터 트랜스퍼 오브젝트
   * @returns affectedRows를 반환합니다. 1인 경우 생성이 완료된 것이고, 0인 경우 생성에 실패한 것입니다.
   */
  static async createOne(marketerId: string, dto: CreateSettlementDto): Promise<number> {
    const encryptedDto = this.encryptSettlement(dto);
    const {
      name, identificationNumber, bankAccountOwner,
      bankAccountNumber, businessmanFlag, identificationImgSrc, bankAccountImgSrc,
    } = encryptedDto;

    const query = `INSERT INTO ${this._tableName} (
      marketerId, name, identificationNumber, bankAccountOwner,
      bankAccountNumber, businessmanFlag, identificationImgSrc, bankAccountImgSrc
    ) VALUES (
      ?, ?, ?, ?,
      ?, ?, ?, ?
    )`;
    const queryArray = [marketerId, name, identificationNumber, bankAccountOwner,
      bankAccountNumber, businessmanFlag, identificationImgSrc, bankAccountImgSrc];

    const { result } = await doQuery(query, queryArray);
    if (!result) throw new createHttpError[500]();

    return result.affectedRows;
  }

  /**
   * 해당 마케터의 정산 등록을 수정합니다.
   * @param marketerId 마케터 고유 아이디
   * @param dto 정산 등록 수정을 위한 DTO
   * @returns affectedRows를 반환합니다. 1인 경우 수정이 완료된 것이고, 0인 경우 수정에 실패한 것입니다.
   */
  static async updateOne(marketerId: string, dto: UpdateSettlementDto): Promise<number> {
    const encryptedDto = this.encryptSettlement(dto);
    const {
      id, name, identificationNumber, bankAccountOwner,
      bankAccountNumber, businessmanFlag, identificationImgSrc, bankAccountImgSrc,
    } = encryptedDto;

    const query = `UPDATE ${this._tableName}
    SET name = ?, identificationNumber = ?, bankAccountOwner = ?,
    bankAccountNumber = ?, businessmanFlag = ?, identificationImgSrc = ?, bankAccountImgSrc = ?,
    state = 0
    WHERE id = ? AND marketerId = ?`;
    const queryArray = [name, identificationNumber, bankAccountOwner,
      bankAccountNumber, businessmanFlag, identificationImgSrc, bankAccountImgSrc, id, marketerId];

    const { result } = await doQuery(query, queryArray);
    if (!result) throw new createHttpError[500]();

    return result.affectedRows;
  }

  /**
   * 해당 정산 등록을 삭제합니다.
   * @param marketerId 마케터 고유 아이디
   * @param id 정산등록 아이디
   * @returns affectedRows를 반환합니다. 1인 경우 삭제가 완료된 것이고, 0인 경우 삭제에 실패한 것입니다.
   */
  static async deleteOne(marketerId: string, id: number): Promise<number> {
    const query = `DELETE FROM ${this._tableName} WHERE id = ? AND marketerId = ?`;
    const queryArray = [id, marketerId];

    const { result } = await doQuery(query, queryArray);
    if (!result) throw new createHttpError[500]();

    return result.affectedRows;
  }
}

router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();

      const result = await SettlementService.findOne(marketerId);
      return responseHelper.send(result, 'get', res);
    })
  )
  .post(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();

      const [
        name, identificationNumber, bankName, bankAccountOwner,
        bankAccountNumber, businessmanFlag, identificationImgSrc, bankAccountImgSrc,
      ] = responseHelper.getParam([
        'name', 'identificationNumber', 'bankName', 'bankAccountOwner',
        'bankAccountNumber', 'businessmanFlag', 'identificationImgSrc', 'bankAccountImgSrc',
      ], 'post', req);

      const result = await SettlementService.createOne(
        marketerId,
        {
          name,
          identificationNumber,
          bankName,
          bankAccountOwner,
          bankAccountNumber,
          businessmanFlag,
          identificationImgSrc,
          bankAccountImgSrc,
        }
      );

      slack({
        summary: '광고주 판매대금 정산 등록 알림',
        text: '광고주가 판매대금 정산을 등록했습니다. 확인하고 검수를 진행해주세요.',
        fields: [
          { title: '방송인 아이디', value: marketerId!, short: true },
          { title: '은행', value: bankName!, short: true },
        ]
      });

      return responseHelper.send(result, 'post', res);
    })
  )
  .patch(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();

      const [
        id, name, identificationNumber, bankName, bankAccountOwner,
        bankAccountNumber, businessmanFlag, identificationImgSrc, bankAccountImgSrc,
      ] = responseHelper.getParam([
        'id', 'name', 'identificationNumber', 'bankName', 'bankAccountOwner',
        'bankAccountNumber', 'businessmanFlag', 'identificationImgSrc', 'bankAccountImgSrc',
      ], 'patch', req);

      const result = await SettlementService.updateOne(
        marketerId,
        {
          id,
          name,
          identificationNumber,
          bankName,
          bankAccountOwner,
          bankAccountNumber,
          businessmanFlag,
          identificationImgSrc,
          bankAccountImgSrc,
        }
      );

      slack({
        summary: '광고주 판매대금 정산 재등록(수정) 알림',
        text: '광고주가 판매대금 정산을 재등록(수정)했습니다. 확인하고 검수를 진행해주세요.',
        fields: [
          { title: '방송인 아이디', value: marketerId!, short: true },
          { title: '은행', value: bankName!, short: true },
        ]
      });

      return responseHelper.send(result, 'patch', res);
    })
  )
  .delete(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();

      const id = responseHelper.getParam('id', 'delete', req);

      const result = await SettlementService.deleteOne(marketerId, id);
      responseHelper.send(result, 'delete', res);
    })
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/list')
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res) => {
      const { marketerId } = responseHelper.getSessionData(req);
      if (!marketerId) throw new createHttpError[401]();

      const result = await SettlementService.findAll(marketerId);
      return responseHelper.send(result, 'get', res);
    })
  );

export default router;
