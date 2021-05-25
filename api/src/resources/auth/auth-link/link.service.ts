import shortid from 'shortid';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AfreecaLinkCertification } from '../../../entities/AfreecaLinkCertification';
import { CreatorInfo } from '../../../entities/CreatorInfo';

export interface AfreecaLinkCertificationRes {
  status: 'already-linked' | 'duplicate-request' | 'created';
  user?: {
    creatorId: string;
    loginId: string;
  };
  cert?: AfreecaLinkCertification;
}

@Injectable()
export class LinkService {
  AFREECA_LINK_PENDING = 0;
  AFREECA_LINK_SUCESS = 1;

  constructor(
    @InjectRepository(CreatorInfo) private readonly creatorInfoRepo: Repository<CreatorInfo>,
    @InjectRepository(AfreecaLinkCertification)
    private readonly afreecaLinkCertRepo: Repository<AfreecaLinkCertification>,
  ) {}

  /**
   * 크리에이터의 연동 진행 정보를 조회합니다. 연동이 진행중인 경우에만.
   * @param creatorId 크리에이터 아이디
   * @returns AfreecaLinkCertification
   */
  public async findAfreecaCert(
    creatorId: CreatorInfo['creatorId'],
  ): Promise<AfreecaLinkCertification> {
    return this.afreecaLinkCertRepo.findOne({
      where: { creatorId, certState: this.AFREECA_LINK_PENDING },
    });
  }

  /**
   * 아프리카 쪽지 연동 시작 메서드
   * @param creatorId 크리에이터 아이디
   * @param requestedAfreecaId 아프리카ID
   * @returns AfreecaLinkCertificationRes
   */
  public async createLinkCert(
    creatorId: CreatorInfo['creatorId'],
    requestedAfreecaId: CreatorInfo['afreecaId'],
  ): Promise<AfreecaLinkCertificationRes> {
    // 다른 유저에게 연동된 afreecaId인지 검사
    const alreadyLinked = await this.creatorInfoRepo.findOne({
      where: { afreecaId: requestedAfreecaId },
    });
    if (alreadyLinked)
      return {
        status: 'already-linked',
        user: { creatorId: alreadyLinked.creatorId, loginId: alreadyLinked.loginId },
      };

    // 동일한 온애드 유저로부터 동일한 afreecaId로의 인증번호 발급의 경우
    const duplicateRequestCheck = await this.afreecaLinkCertRepo.findOne({
      creatorId,
      afreecaId: requestedAfreecaId,
    });
    if (duplicateRequestCheck) {
      return {
        status: 'duplicate-request',
        cert: duplicateRequestCheck,
      };
    }

    // 올바른 요청의 경우.
    const certCode = `${new Date().getTime()}${shortid.generate()}`;
    const newCertItem = await this.afreecaLinkCertRepo.save(
      this.afreecaLinkCertRepo.create({
        tempCode: certCode,
        creatorId,
        certState: this.AFREECA_LINK_PENDING,
        afreecaId: requestedAfreecaId,
      }),
    );

    return {
      status: 'created',
      cert: newCertItem,
    };
  }

  /**
   * 현재 진행중인 쪽지 연동을 중단합니다.
   * @param creatorId 크리에이터 아이디
   * @returns AfreecaLinkCertification
   */
  public async removeLinkCert(
    creatorId: CreatorInfo['creatorId'],
  ): Promise<AfreecaLinkCertification> {
    const cert = await this.findAfreecaCert(creatorId);
    return this.afreecaLinkCertRepo.remove(cert);
  }

  /**
   * 크리에이터의 아프리카 연동정보를 제거합니다.
   * @param creatorId 크리에이터 아이디
   * @returns success | fail
   */
  public async removeAfreecaInfo(creatorId: CreatorInfo['creatorId']): Promise<'success' | 'fail'> {
    const result = await this.creatorInfoRepo
      .createQueryBuilder()
      .update(CreatorInfo)
      .set({
        afreecaId: null,
        afreecaName: null,
        afreecaLogo: null,
        afreecaRefreshToken: null,
      })
      .where('creatorId = :creatorId', { creatorId })
      .execute();

    if (result.affected > 0) return 'success';
    return 'fail';
  }

  /**
   * 크리에이터의 트위치 연동정보를 제거합니다.
   * @param creatorId 크리에이터 고유 아이디
   * @returns success | fail
   */
  public async removeTwitchInfo(creatorId: CreatorInfo['creatorId']): Promise<'success' | 'fail'> {
    const result = await this.creatorInfoRepo
      .createQueryBuilder()
      .update(CreatorInfo)
      .set({
        creatorTwitchOriginalId: null,
        creatorName: null,
        creatorTwitchId: null,
        creatorMail: null,
        creatorLogo: null,
        creatorTwitchRefreshToken: null,
      })
      .where('creatorId = :creatorId', { creatorId })
      .execute();

    if (result.affected > 0) return 'success';
    return 'fail';
  }
}
