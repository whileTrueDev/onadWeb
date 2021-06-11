import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Ip,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Creator } from '../../decorators/sessionData.decorator';
import { CreatorInfo } from '../../entities/CreatorInfo';
import { CreatorRoyaltyLevel } from '../../entities/CreatorRoyaltyLevel';
import { CreatorSession } from '../../interfaces/Session.interface';
import { IsAuthGuard } from '../auth/guards/isAuth.guard';
import { SlackService } from '../slack/slack.service';
import { CreatorService } from './creator.service';
import { CheckIdDuplicateDto } from './dto/checkIdDuplicateDto.dto';
import { CreateCreatorDto } from './dto/createCreatorDto.dto';
import { CreateCreatorPreUserDto } from './dto/createCreatorPreUserDto.dto';
import { FindCreatorLandingUrlDto } from './dto/findCreatorLandingUrlDto.dto';
import { FindPasswordDto } from './dto/findPasswordDto.dto';
import { UpdateCreatorInfoDto } from './dto/updateCreatorInfoDto.dto';
import { UpdateCreatorSettlementInfoDto } from './dto/updateCreatorSettlementInfoDto.dto';
import { UpdatePasswordDto } from './dto/updatePasswordDto.dto';

@Controller('creator')
export class CreatorController {
  constructor(
    private readonly creatorService: CreatorService,
    private readonly slackService: SlackService,
  ) {}

  @UseGuards(IsAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findCreatorInfo(
    @Creator() { creatorId }: CreatorSession,
    @Ip() ip: string,
  ): Promise<CreatorInfo & { NowIp: string; AccountImg?: string; BussinessRegiImg?: string }> {
    const result = await this.creatorService.findCreatorInfo(creatorId);
    return {
      ...result,
      accountImg: '',
      AccountImg: result.accountImg,
      NowIp: ip,
      password: '',
      passwordSalt: '',
    };
  }

  @Post()
  createCreator(@Ip() ip: string, @Body(ValidationPipe) dto: CreateCreatorDto): Promise<string> {
    return this.creatorService.createCreator(ip, dto);
  }

  @UseGuards(IsAuthGuard)
  @Patch()
  updateCreatorInfo(
    @Creator() { creatorId }: CreatorSession,
    @Body(ValidationPipe) dto: UpdateCreatorInfoDto,
  ): Promise<boolean> {
    return this.creatorService.updateCreatorInfo(creatorId, dto);
  }

  @Post('pre-user')
  createCreatorInfoPreUser(@Body() dto: CreateCreatorPreUserDto): Promise<boolean> {
    // * 기존 유저 통합 로그인 정보 생성
    return this.creatorService.createCreatorInfoPreUser(dto);
  }

  @UseGuards(IsAuthGuard)
  @Patch('settlement')
  async updateSettlementInfo(
    @Creator() { creatorId }: CreatorSession,
    @Body(ValidationPipe) dto: UpdateCreatorSettlementInfoDto,
  ): Promise<[boolean]> {
    const result = await this.creatorService.updateSettlementInfo(creatorId, dto);
    if (!result) return [false];

    this.slackService.jsonMessage({
      summary: '방송인 정산 등록 알림',
      text: '방송인이 정산을 등록했습니다. 확인해주세요.',
      fields: [
        { title: '방송인 아이디', value: creatorId, short: true },
        { title: '은행', value: dto.bankName, short: true },
      ],
    });
    return [true];
  }

  @Get('check-id')
  async checkIdDuplicate(
    @Query(ValidationPipe) dto: CheckIdDuplicateDto,
  ): Promise<'duplicate' | 'allow'> {
    const duplicateUser = await this.creatorService.findOneByTwitchOriginalId(dto.userid);
    if (duplicateUser) return 'duplicate';
    return 'allow';
  }

  @UseGuards(IsAuthGuard)
  @Get('landing-url')
  async findCreatorLandingUrl(
    @Creator() { creatorId }: CreatorSession,
    @Query(ValidationPipe) dto: FindCreatorLandingUrlDto,
  ): Promise<null | { url: string }> {
    const landingUrl = await this.creatorService.findCreatorLandingUrl(creatorId, dto.type);
    if (!landingUrl) return null;
    return { url: landingUrl };
  }

  @UseGuards(IsAuthGuard)
  @Get('adchat/agreement')
  findAdchatAgreement(
    @Creator() { creatorId }: CreatorSession,
  ): Promise<Pick<CreatorInfo, 'adChatAgreement'>> {
    return this.creatorService.findAdchatAgreement(creatorId);
  }

  @UseGuards(IsAuthGuard)
  @Patch('adchat/agreement')
  updateAdchatAgreement(
    @Creator() { creatorId }: CreatorSession,
    @Body('targetOnOffState') targetOnOffState: number,
  ): Promise<boolean> {
    return this.creatorService.updateAdchatAgreement(creatorId, targetOnOffState);
  }

  @UseGuards(IsAuthGuard)
  @Get('level')
  findCreatorLevel(@Creator() { creatorId }: CreatorSession): Promise<CreatorRoyaltyLevel> {
    return this.creatorService.findCreatorLevel(creatorId);
  }

  // * 비밀번호 확인
  @UseGuards(IsAuthGuard)
  @Post('password')
  findPassword(
    @Creator() { creatorId }: CreatorSession,
    @Body(ValidationPipe) dto: FindPasswordDto,
  ): Promise<boolean> {
    return this.creatorService.findPassword(creatorId, dto.password);
  }

  @UseGuards(IsAuthGuard)
  @Patch('password')
  updatePassword(
    @Creator() { creatorId }: CreatorSession,
    @Body(ValidationPipe) dto: UpdatePasswordDto,
  ): Promise<boolean> {
    return this.creatorService.updatePassword(creatorId, dto.password);
  }
}
