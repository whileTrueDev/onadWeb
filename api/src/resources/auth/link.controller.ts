import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AfreecaLinkCertification } from '../../entities/AfreecaLinkCertification';
import { IsAuthGuard } from './guards/isAuth.guard';
import { TwitchLinkExceptionFilter } from './guards/twitchLink.filter';
import { TwitchLinkGuard } from './guards/twitchLink.guard';
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
  twitchLink(@Req() req: Request): Express.User {
    return req.user;
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
  deleteTwitchLink(@Req() req: Request): Promise<'success' | 'fail'> {
    const { creatorId } = req.user;
    return this.linkService.removeTwitchInfo(creatorId);
  }

  // *********************************************
  // * afreecaTV 계정 연동
  // *********************************************
  // 아프리카 쪽지 인증 기록 조회
  @UseGuards(IsAuthGuard)
  @Get('afreeca/cert')
  findAfreecaCert(@Req() req: Request): Promise<AfreecaLinkCertification> {
    const { creatorId } = req.user;
    return this.linkService.findAfreecaCert(creatorId);
  }

  // 아프리카 쪽지 연동을 이용한 채널 연동
  @UseGuards(IsAuthGuard)
  @Post('afreeca/cert')
  createAfreecaCert(
    @Req() req: Request,
    @Body('afreecaId') afreecaId: string,
  ): Promise<AfreecaLinkCertificationRes> {
    const { creatorId } = req.user;
    return this.linkService.createLinkCert(creatorId, afreecaId);
  }

  // 아프리카 쪽지 연동 취소
  @UseGuards(IsAuthGuard)
  @Delete('afreeca/cert')
  deleteAfreecaCert(@Req() req: Request): Promise<AfreecaLinkCertification> {
    const { creatorId } = req.user;
    return this.linkService.removeLinkCert(creatorId);
  }

  // 아프리카 연동 해제
  @UseGuards(IsAuthGuard)
  @Delete('afreeca')
  deleteAfreecaLink(@Req() req: Request): Promise<'success' | 'fail'> {
    const { creatorId } = req.user;
    return this.linkService.removeAfreecaInfo(creatorId);
  }
}
