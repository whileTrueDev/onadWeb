import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Campaign } from '../entities/Campaign';
import { MerchandiseOrders } from '../entities/MerchandiseOrders';
import { MerchandiseOrdersDetail } from '../entities/MerchandiseOrdersDetail';
import { MerchandiseRegistered } from '../entities/MerchandiseRegistered';
import { FindSettlementLogsRes } from '../resources/marketer/settlement/interfaces/FindSettlementLogsRes.interface';

@Injectable()
@EntityRepository(MerchandiseOrdersDetail)
export class MerchandiseOrdersDetailRepository extends Repository<MerchandiseOrdersDetail> {
  public _findSettlementBySettlementLogId(settlementLogId: number): Promise<FindSettlementLogsRes> {
    return this.createQueryBuilder('detail')
      .select('detail.id AS id, VAT, actualSendedAmount, cancelDate, commissionAmount')
      .addSelect('orderId, paymentCommissionAmount, paymentMethod, bigo')
      .addSelect('purchaseChannel, purchaseConfirmDate, settlementLogId')
      .addSelect('detail.createDate AS createDate, detail.updateDate AS updateDate')
      .addSelect('campaign.campaignId, campaignName')
      .addSelect('orderPrice, deliveryFee, mo.createDate AS orderDate')
      .where('settlementLogId = :settlementLogId', { settlementLogId })
      .innerJoin(MerchandiseOrders, 'mo', 'mo.id = detail.orderId')
      .innerJoin(Campaign, 'campaign', 'campaign.campaignId = mo.campaignId')
      .innerJoin(MerchandiseRegistered, 'mr', 'mo.merchandiseId = mr.id')
      .addSelect('isLiveCommerce')
      .getRawMany();
  }
}
