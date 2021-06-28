import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMerchandiseOrdersDetail1623723695161 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = /* sql */ `
      CREATE TABLE merchandiseOrdersDetail (
        id int(11) unsigned NOT NULL AUTO_INCREMENT,
        orderId int(11) unsigned DEFAULT NULL COMMENT '연결된 주문아이디',
        settlementLogId int(11) unsigned DEFAULT NULL COMMENT '연결된 정산실행내역 (실제 정산 실행 내역과 연결)',
        purchaseChannel varchar(50) NOT NULL DEFAULT '일반채널' COMMENT '구매채널(일반채널-응원메세지 없는경우, 방송인채널-응원메세지 있는경우)',
        commissionAmount int(11) unsigned NOT NULL DEFAULT 0 COMMENT '일반수수료(크리에이터+온애드)',
        paymentMethod varchar(50) NOT NULL DEFAULT '' COMMENT '결제방법',
        paymentCommissionAmount int(11) unsigned NOT NULL DEFAULT 0 COMMENT '전자결제수수료(다날/iamport/...)',
        VAT int(11) unsigned NOT NULL DEFAULT 0 COMMENT '부가세(일반수수료합 * 10%)',
        actualSendedAmount int(11) unsigned NOT NULL DEFAULT 0 COMMENT '실지급액',
        purchaseConfirmDate timestamp NULL DEFAULT NULL COMMENT '구매확정 일자',
        createDate timestamp NOT NULL DEFAULT current_timestamp(),
        updateDate timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        bigo varchar(50) NOT NULL DEFAULT '-' COMMENT '비고(취소매출의 경우 ''취소매출'')',
        cancelDate timestamp NULL DEFAULT NULL COMMENT '취소일자',
        PRIMARY KEY (id),
        KEY orderDetail (orderId),
        KEY orderDetailSettlement (settlementLogId),
        CONSTRAINT orderDetail FOREIGN KEY (orderId) REFERENCES merchandiseOrders (id) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT orderDetailSettlement FOREIGN KEY (settlementLogId) REFERENCES marketerSalesIncomeSettlementLogs (id) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `;
    await queryRunner.query(query);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const downQuery = /* sql */ `
      DROP TABLE merchandiseOrdersDetail
    `;
    await queryRunner.query(downQuery);
  }
}
