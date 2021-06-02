import { Body, Controller, Delete, Get, Post, Res, UseFilters, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Creator } from '../../../decorators/sessionData.decorator';
import { AfreecaLinkCertification } from '../../../entities/AfreecaLinkCertification';
import { CreatorSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../guards/isAuth.guard';
import { TwitchLinkExceptionFilter } from '../guards/twitchLink.filter';
import { TwitchLinkGuard } from '../guards/twitchLink.guard';
import { AfreecaLinkCertificationRes, LinkService } from './link.service';

@Controller('link')
export class LinkController {
  HOST: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly linkService: LinkService,
  ) {
    this.HOST = configService.get('REACT_HOSTNAME');
  }

  // *********************************************
  // * twitch 계정 연동
  // *********************************************
  @UseGuards(TwitchLinkGuard)
  @Get('twitch')
  twitchLink(@Creator() creatorSession: CreatorSession): Express.User {
    return creatorSession;
  }

  // 커스텀 에러 filter 적용 필요
  @UseFilters(TwitchLinkExceptionFilter)
  @UseGuards(TwitchLinkGuard)
  @Get('/twitch/callback')
  twitchLinkCallback(@Res() res: Response): void {
    res.redirect(`${this.HOST}/mypage/creator/user`);
  }

  @UseGuards(IsAuthGuard)
  @Delete('twitch')
  deleteTwitchLink(@Creator() { creatorId }: CreatorSession): Promise<'success' | 'fail'> {
    return this.linkService.removeTwitchInfo(creatorId);
  }

  // *********************************************
  // * afreecaTV 계정 연동
  // *********************************************
  // 아프리카 쪽지 인증 기록 조회
  @UseGuards(IsAuthGuard)
  @Get('afreeca/cert')
  findAfreecaCert(@Creator() { creatorId }: CreatorSession): Promise<AfreecaLinkCertification> {
    return this.linkService.findAfreecaCert(creatorId);
  }

  // 아프리카 쪽지 연동을 이용한 채널 연동
  @UseGuards(IsAuthGuard)
  @Post('afreeca/cert')
  createAfreecaCert(
    @Creator() { creatorId }: CreatorSession,
    @Body('afreecaId') afreecaId: string,
  ): Promise<AfreecaLinkCertificationRes> {
    return this.linkService.createLinkCert(creatorId, afreecaId);
  }

  // 아프리카 쪽지 연동 취소
  @UseGuards(IsAuthGuard)
  @Delete('afreeca/cert')
  deleteAfreecaCert(@Creator() { creatorId }: CreatorSession): Promise<AfreecaLinkCertification> {
    return this.linkService.removeLinkCert(creatorId);
  }

  // 아프리카 연동 해제
  @UseGuards(IsAuthGuard)
  @Delete('afreeca')
  deleteAfreecaLink(@Creator() { creatorId }: CreatorSession): Promise<'success' | 'fail'> {
    return this.linkService.removeAfreecaInfo(creatorId);
  }
}
