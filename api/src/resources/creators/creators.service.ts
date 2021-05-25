import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { CreatorInfo } from '../../entities/CreatorInfo';
import { CreatorsBroadcastRes } from './interfaces/creatorsBroadcastRes.interface';
import { CreatorsLiveRes } from './interfaces/creatorsLiveRes.interface';
import { CreatorsRes } from './interfaces/creatorsRes.interface';

@Injectable()
export class CreatorsService {
  constructor(
    @InjectRepository(CreatorInfo) private readonly creatorInfoRepo: Repository<CreatorInfo>,
  ) {}

  public async findCreatorsAnalyzed(): Promise<CreatorsRes> {
    const searchQuery = `
      SELECT cI.creatorId, cI.creatorName, cI.creatorLogo, cI.creatorTwitchId, A.followers, A.content, A.openHour
      FROM creatorInfo as cI

      RIGHT JOIN (SELECT creatorId, followers, content, openHour FROM creatorDetail) as A
      
      ON cI.creatorId = A.creatorId
      WHERE creatorContractionAgreement = 1 AND creatorTwitchOriginalId IS NOT NULL
      ORDER BY cI.creatorId DESC
      `;
    const conn = getConnection();
    const result = await conn.query(searchQuery);
    return result;
  }

  public async findNowOnBroadCreators(): Promise<CreatorsLiveRes> {
    const query = `SELECT CI.creatorId
    FROM creatorInfo as CI

    LEFT JOIN
    (SELECT streamerName, viewer
    FROM twitchStreamDetail
    WHERE time > DATE_SUB(NOW(), INTERVAL 10 MINUTE)
    GROUP BY streamerName) as A
    ON CI.creatorName = A.streamerName

    JOIN (
    SELECT creatorId
    FROM campaignTimestamp
    WHERE date > DATE_SUB(NOW(), INTERVAL 10 MINUTE)
    ) AS B ON CI.creatorId = B.creatorId
    WHERE creatorContractionAgreement  = 1
    ORDER BY viewer DESC`;
    const conn = getConnection();
    const result = await conn.query(query);
    return result.map((creator: { creatorId: string }) => creator.creatorId);
  }

  public async findNowOnBroadCount(): Promise<CreatorsBroadcastRes> {
    const query = `SELECT COUNT(creatorId) AS nowBroadcast
      FROM creatorInfo as CI
      RIGHT JOIN
      (SELECT streamerName, viewer
      FROM twitchStreamDetail
      WHERE time > DATE_SUB(NOW(), INTERVAL 10 MINUTE)
      GROUP BY streamerName) as A
      ON CI.creatorName = A.streamerName
      WHERE creatorContractionAgreement = 1`;
    const result = await this.creatorInfoRepo.query(query);
    return result;
  }
}
