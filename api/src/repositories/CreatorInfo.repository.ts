import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreatorInfo } from '../entities/CreatorInfo';
import { TwitchProfile } from '../interfaces/TwitchProfile.interface';
import { UpdateCreatorSettlementInfoDto } from '../resources/creator/dto/updateCreatorSettlementInfoDto.dto';

interface UpdateInfoTwitchPreUserParams {
  loginId: string;
  password: string;
  passwordSalt: string;
  creatorId: string;
}

type updateSettlementInfoParams = Omit<
  UpdateCreatorSettlementInfoDto,
  'AccountNumber' | 'CreatorPhone' | 'CreatorIdentity'
> & {
  encryptedCreatorIdentity: string;
  encryptedAccountNumber: string;
  encryptedCreatorPhone: string;
};

@Injectable()
@EntityRepository(CreatorInfo)
export class CreatorInfoRepository extends Repository<CreatorInfo> {
  public async _updateTwitchInfo(
    creatorId: string,
    refreshToken: string,
    profile: TwitchProfile,
  ): Promise<number> {
    const result = await this.createQueryBuilder()
      .update(CreatorInfo)
      .set({
        creatorTwitchOriginalId: profile.id,
        creatorName: profile.display_name,
        creatorTwitchId: profile.login,
        creatorMail: profile.email,
        creatorLogo: profile.profile_image_url,
        creatorTwitchRefreshToken: refreshToken,
      })
      .where('creatorId = :creatorId', { creatorId })
      .execute();
    return result.affected;
  }

  public async _updateAfreecaInfo(
    creatorId: string,
    nickname: string,
    logo: string,
  ): Promise<'success' | 'fail'> {
    const result = await this.__update(creatorId, { afreecaName: nickname, afreecaLogo: logo });
    if (result) return 'success';
    return 'fail';
  }

  public async _replaceTwitchRefreshToken(
    creatorId: string,
    refreshToken: string,
  ): Promise<boolean> {
    return this.__update(creatorId, { creatorTwitchRefreshToken: refreshToken });
  }

  public async _updateCreatorIp(creatorId: string, newIp: string): Promise<boolean> {
    return this.__update(creatorId, { creatorIp: newIp });
  }

  public async _updateCreatorContraction(
    creatorId: string,
    advertiseUrl: string,
    remoteControllerUrl: string,
  ): Promise<boolean> {
    return this.__update(creatorId, {
      creatorContractionAgreement: 1,
      advertiseUrl,
      remoteControllerUrl,
    });
  }

  public async _updateCreatorCPAAgreement(creatorId: string, agreement: 0 | 1): Promise<boolean> {
    return this.__update(creatorId, { cpaAgreement: agreement });
  }

  public async _updateInfoTwitchPreUser(params: UpdateInfoTwitchPreUserParams): Promise<boolean> {
    return this.__update(params.creatorId, {
      loginId: params.loginId,
      password: params.password,
      passwordSalt: params.passwordSalt,
      creatorTwitchOriginalId: params.creatorId,
    });
  }

  public async _updateSettlementInfo(
    creatorId: string,
    dto: updateSettlementInfoParams,
  ): Promise<boolean> {
    return this.__update(creatorId, {
      name: dto.CreatorName,
      settlementState: 1,
      identificationNumber: dto.encryptedCreatorIdentity,
      phoneNumber: dto.encryptedCreatorPhone,
      creatorType: dto.CreatorType,
      identificationImg: dto.CreatorIDImg,
      accountImg: dto.CreatorAccountImg,
      bussinessRegiImg: dto.CreatorBussinessImg,
      creatorAccountNumber: dto.encryptedAccountNumber,
      realName: dto.bankRealName,
    });
  }

  public async _updateAdChatAgreement(creatorId: string, targetState: number): Promise<boolean> {
    return this.__update(creatorId, { adChatAgreement: targetState });
  }

  public async _updateCreatorPassword(
    creatorId: string,
    newPw: string,
    newPwSalt: string,
  ): Promise<boolean> {
    return this.__update(creatorId, { password: newPw, passwordSalt: newPwSalt });
  }

  public async _signOut(creatorId: string): Promise<boolean> {
    const user = await this.findOne({ where: { creatorId } });
    if (!user) throw new UnauthorizedException('creatorId 가 올바르지 못합니다.');
    const result = await this.createQueryBuilder()
      .update()
      .set({
        creatorName: null,
        creatorIp: null,
        creatorMail: null,
        realName: null,
        creatorAccountNumber: null,
        advertiseUrl: null,
        creatorAlarmAgreement: 0,
        creatorContractionAgreement: 0,
        creatorTwitchId: null,
        creatorLogo: null,
        arrested: null,
        noticeReadState: null,
        adChatAgreement: 0,
        settlementState: null,
        identificationNumber: null,
        name: null,
        phoneNumber: null,
        creatorType: 0,
        identificationImg: null,
        accountImg: null,
        bussinessRegiImg: null,
        cpaAgreement: 0,
        remoteControllerUrl: null,
        loginId: null,
        password: null,
        passwordSalt: null,
        creatorTwitchOriginalId: null,
        creatorTwitchRefreshToken: null,
        afreecaId: null,
        afreecaName: null,
        afreecaRefreshToken: null,
        afreecaLogo: null,
        deleteFlag: true,
      })
      .where('creatorId = :creatorId', { creatorId })
      .execute();

    if (result.affected > 0) return true;
    return false;
  }

  // ****************************
  // * Private Methods
  // ****************************

  private async __update(creatorId: string, updateObj: Partial<CreatorInfo>): Promise<boolean> {
    const result = await this.createQueryBuilder()
      .update(CreatorInfo)
      .set(updateObj)
      .where('creatorId = :creatorId', { creatorId })
      .execute();

    if (result.affected > 0) return true;
    return false;
  }
}
