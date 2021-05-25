import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { CreatorDetail } from '../../../entities/CreatorDetail';
import { CreatorsDetail } from './interfaces/creatorsDetail.interface';
import { CreatorsGames } from './interfaces/creatorsGames.interface';

@Injectable()
export class CreatorsAnalysisService {
  constructor(
    @InjectRepository(CreatorDetail) private readonly creatorDetailRepo: Repository<CreatorDetail>,
  ) {}

  public async findCreatorDetail(): Promise<CreatorsDetail> {
    const query = `
    SELECT
        C.creatorLogo,
        C.creatorName,
        C.afreecaName,
        C.afreecaLogo,
        A.*,
        B.creatorId AS creatorIdAfreeca,
        B.followers AS followersAfreeca,
        B.viewer AS viewerAfreeca,
        B.peakview AS peakviewAfreeca,
        B.airtime AS airtimeAfreeca,
        B.impression AS impressionAfreeca,
        B.ctr AS ctrAfreeca,
        B.cost AS costAfreeca,
        B.rip AS ripAfreeca,
        B.content AS contentAfreeca,
        B.openHour AS openHourAfreeca,
        B.timeGraphData AS timeGraphDataAfreeca,
        B.contentsGraphData AS contentsGraphDataAfreeca,
        B.date AS dateAfreeca,
        B.viewerHeatmapData AS viewerHeatmapDataAfreeca
      FROM creatorInfo AS C
      LEFT JOIN creatorDetail AS A ON C.creatorId = A.creatorId
      LEFT JOIN creatorDetailAfreeca AS B ON C.creatorId = B.creatorId 
      WHERE A.rip > 0.5 OR B.rip > 0.5
      ORDER BY IFNULL(A.viewer, 0) + IFNULL(B.viewer, 0) DESC`;

    const conn = getConnection();
    const result = await conn.query(query);
    return result;
  }

  public async findGames(): Promise<CreatorsGames> {
    const query = `
      SELECT
        count(content) AS count, content, gameId, gameName, gameNameKr, boxArt
      FROM creatorDetail
      JOIN twitchGame ON content = gameName
      WHERE content IS NOT NULL
      GROUP BY content ORDER BY count(content) DESC
      `;
    return this.creatorDetailRepo.query(query);
  }
}
