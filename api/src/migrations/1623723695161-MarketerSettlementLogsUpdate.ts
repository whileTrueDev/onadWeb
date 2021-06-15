import { MigrationInterface, QueryRunner } from 'typeorm';

export class MarketerSettlementLogsUpdate1623723695161 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = /* sql */ `
        ALTER TABLE marketerSalesIncomeSettlementLogs
        -- 결제방법
        ADD COLUMN paymentMethod VARCHAR(50) NOT NULL
        COMMENT '결제방법',

        -- 구매채널(일반채널-응원메세지 없는경우, 방송인채널-응원메세지 있는경우)
        ADD COLUMN purchaseChannel VARCHAR(50) NOT NULL DEFAULT '일반채널'
        COMMENT '구매채널(일반채널-응원메세지 없는경우, 방송인채널-응원메세지 있는경우)',

        -- 일반수수료 ( 크리에이터 응원 메세지 있는 경우 총합 20% : 10%() + 10%, 없는 경우 10% )
        ADD COLUMN commissionAmount INT(11) UNSIGNED NOT NULL DEFAULT 0
        COMMENT '일반수수료(크리에이터+온애드)',

        -- 전자결제수수료(다날/iamport/...)
        ADD COLUMN paymentCommissionAmount INT(11) UNSIGNED NOT NULL DEFAULT 0
        COMMENT '전자결제수수료(다날/iamport/...)',

        -- 부가세(일반수수료합 * 10%)
        ADD COLUMN VAT INT(11) UNSIGNED NOT NULL DEFAULT 0
        COMMENT '부가세(일반수수료합 * 10%)',

        -- 실지급액
        ADD COLUMN actualSendedAmount INT(11) UNSIGNED NOT NULL DEFAULT 0
        COMMENT '실지급액',

        -- 지급상태(지급완료, 지급예정, 취소매출)
        ADD COLUMN sendStatus VARCHAR(50) NOT NULL DEFAULT '지급예정'
        COMMENT '지급상태(지급완료, 지급예정, 취소매출)',

        -- 주문일자
        ADD COLUMN orderDate TIMESTAMP NULL
        COMMENT '주문일자',

        -- 취소일자
        ADD COLUMN cancelDate TIMESTAMP NULL
        COMMENT '취소일자',

        -- 주문확정 일자
        ADD COLUMN purchaseConfirmDate TIMESTAMP NULL
        COMMENT '주문확정 일자';
        -- 배송비 -> 이미 있음 (amountDeliveryFee)
    `;
    await queryRunner.query(query);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const downQuery = /* sql */ `
      ALTER TABLE marketerSalesIncomeSettlementLogs
        DROP paymentMethod,
        DROP purchaseChannel,
        DROP commissionAmount,
        DROP paymentCommissionAmount,
        DROP VAT,
        DROP actualSendedAmount,
        DROP sendStatus,
        DROP orderDate,
        DROP cancelDate,
        DROP purchaseConfirmDate;
      `;
    await queryRunner.query(downQuery);
  }
}
