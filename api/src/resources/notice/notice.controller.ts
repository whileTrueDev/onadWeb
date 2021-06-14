import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PublicNotice } from '../../entities/PublicNotice';
import { IsAuthGuard } from '../auth/guards/isAuth.guard';
import { NoticeService } from './notice.service';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  findNotice(): Promise<PublicNotice[]> {
    return this.noticeService.findAllNotice();
  }

  @UseGuards(IsAuthGuard)
  @Get('read-flag')
  getReadFlag(@Req() req: Request): Promise<{ noticeReadState: boolean | number }> {
    const { userType, creatorId, marketerId } = req.user;
    const targetId = userType === 'marketer' ? marketerId : creatorId;
    return this.noticeService.getReadFlag(userType, targetId);
  }

  @UseGuards(IsAuthGuard)
  @Patch('read-flag')
  setReadFlag(@Req() req: Request): Promise<number> {
    const { userType, creatorId, marketerId } = req.user;
    const targetId = userType === 'marketer' ? marketerId : creatorId;
    return this.noticeService.setReadFlag(userType, targetId);
  }
}
