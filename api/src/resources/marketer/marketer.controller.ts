import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import nanoid from 'nanoid';
import { Marketer } from '../../decorator/sessionData.decorator';
import { MarketerInfo } from '../../entities/MarketerInfo';
import { MarketerSession } from '../../interfaces/Session.interface';
import { IsAuthGuard } from '../auth/guards/isAuth.guard';
import { MailService } from '../mail/mail.service';
import { CreateNewMarketerDto } from './dto/createNewMarketerDto.dto';
import { CreateNewMarketerWithSocialLoginDto } from './dto/createNewMarketerWithSocialLoginDto.dto';
import { FindMarketerIdDto } from './dto/findMarketerIdDto.dto';
import { UpdateMarketerInfoDto } from './dto/UpdateMarketerInfo.dto';
import { CreateNewMarketerRes } from './interfaces/createNewMarketerRes.interface';
import { FindMarketerIdRes } from './interfaces/findMarketerIdRes.interface';
import { TmpPasswordRes } from './interfaces/tmpPasswordRes.interface';
import { MarketerService } from './marketer.service';

@Controller('marketer')
export class MarketerController {
  constructor(
    private readonly marketerService: MarketerService,
    private readonly mailService: MailService,
  ) {}

  // * 광고주 정보 조회
  @UseGuards(IsAuthGuard)
  @Get()
  async findMarketerInfo(
    @Marketer() { marketerId }: MarketerSession,
  ): Promise<Partial<MarketerInfo>> {
    const marketer = await this.marketerService.findOne(marketerId);
    return {
      marketerId: marketer.marketerId,
      marketerName: marketer.marketerName,
      marketerMail: marketer.marketerMail,
      marketerPhoneNum: marketer.marketerPhoneNum,
      marketerBusinessRegNum: marketer.marketerBusinessRegNum,
      marketerContraction: marketer.marketerContraction,
      platformType: marketer.platformType,
      profileImage: marketer.profileImage,
    };
  }

  // * 광고주 생성
  @Post()
  createMarketer(@Body() dto: CreateNewMarketerDto): Promise<CreateNewMarketerRes> {
    return this.marketerService.createNewMarketer(dto);
  }

  // * 광고주 생성 ( 소셜 플랫폼 로그인 시 )
  @Post('/platform')
  createMarketerWithSocialLogin(
    dto: CreateNewMarketerWithSocialLoginDto,
  ): Promise<CreateNewMarketerRes> {
    return this.marketerService.createNewMarketerWithSocialLogin(dto);
  }

  // * 광고주 정보 변경
  @UseGuards(IsAuthGuard)
  @Patch()
  async updateMarketerInfo(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: UpdateMarketerInfoDto,
  ): Promise<boolean> {
    switch (dto.type) {
      case 'password': {
        await this.marketerService.changePassword(marketerId, dto.value);
        return true;
      }
      case 'name':
      case 'phone':
      case 'mail':
      case 'profileImage': {
        const entityName = this.convertDtoTypeToEntityName(dto.type);
        await this.marketerService.updateMarketerInfo(marketerId, entityName, dto.value);
        return true;
      }
      default:
        return false;
    }
  }

  // * 광고주 회원 탈퇴 (soft delete)
  @UseGuards(IsAuthGuard)
  @Delete()
  async deleteMarketerInfo(
    @Req() req: Request,
    @Marketer() { marketerId }: MarketerSession,
  ): Promise<boolean> {
    req.logout();
    req.session.destroy(() => {
      console.log(`${marketerId}님 회원탈퇴`);
    });
    const result = await this.marketerService.deleteMarketerInfo(marketerId);
    return result;
  }

  // * 회원가입시, 아이디 중복 체크
  @Post('checkId')
  async checkIdDuplicate(@Body('idValue') idValue: string): Promise<boolean> {
    const alreadyExists = await this.marketerService.findOne(idValue);
    if (!alreadyExists) return false;
    return true;
  }

  // * social 세션 데이터 전송
  @UseGuards(IsAuthGuard)
  @Get('social')
  getSocialData(
    @Marketer() { marketerPlatformData, marketerMail }: MarketerSession,
  ): Partial<MarketerSession> {
    return { marketerPlatformData, marketerMail };
  }

  // * 아이디 찾기
  @Get('id')
  async findMarketerId(@Query(ValidationPipe) dto: FindMarketerIdDto): Promise<FindMarketerIdRes> {
    const marketer = await this.marketerService.findMarketerId(dto);
    if (!marketer) return { error: true, message: '입력하신 정보에 해당하는 회원이 없습니다.' };
    return { error: false, message: marketer.marketerId };
  }

  // * 비밀번호 찾기 시, 임시 비밀번호 발급
  /**
   * @todo by hwasurr 21. 05. 26.
   * 온애드 가입시, 본인인증을 통해 가입하므로, 이메일 인증없이 곧바로 가입하는 상황에서, 이메일을 통해 임시 비밀번호를 전달하는 것은 부적절하다고 느껴진다.
   * 비밀번호 찾기 시, [본인인증 -> 동일 인물인 경우 비밀번호 변경] 의 과정으로 나아가는 것이 올바른 것으로 보인다.
   */
  @Patch('tmp-password')
  async generateTmpPassword(
    @Body('marketerId', ValidationPipe) marketerId: MarketerInfo['marketerId'],
    @Body('marketerMail') marketerMail: MarketerInfo['marketerMail'],
  ): Promise<TmpPasswordRes> {
    const marketer = await this.marketerService.findOne(marketerId);
    if (!marketer) return { error: true, message: '해당 ID의 회원이 존재하지 않습니다.' };
    if (!(marketer.marketerMail === marketerMail)) {
      return { error: true, message: 'EMAIL이 일치하지 않습니다.' };
    }
    // 임시 비번 생성
    const tmpPassword = nanoid.nanoid(10); // 10자리 난수
    // 광고주 비밀번호를 임시 비밀번호로 설정
    const success = this.marketerService.changePassword(marketer.marketerId, tmpPassword, true);
    if (!success) return { error: true, message: '임시비밀번호 변경중 오류' };
    // 임시 비번 메일링
    const mailId = await this.mailService.sendTmpPasswordMailToMarketer(
      marketerId,
      marketerMail,
      tmpPassword,
    );
    return { error: false, mailId };
  }

  // *****************************************************
  // * private Utils
  // *****************************************************
  private convertDtoTypeToEntityName(typename: Omit<UpdateMarketerInfoDto['type'], 'password'>) {
    switch (typename) {
      case 'name':
        return 'marketerName';
      case 'phone':
        return 'marketerPhoneNum';
      case 'mail':
        return 'marketerMail';
      case 'profileImage':
        return 'profileImage';
      default:
        throw new BadRequestException();
    }
  }
}
