import { Get, Patch, Controller, UseGuards, Query, ValidationPipe, Body } from '@nestjs/common';

import { Creator } from '../../../decorators/sessionData.decorator';
import { CreatorSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { FindCampaignsRemoteControlDto } from './dto/findCampaignsRemoteControlDto.dto';
import { UpdateRemoteOnOffDto } from './dto/updateRemoteOnOffDto.dto';
import { FindCampaignsRemoteControlRes } from './interfaces/findCampaignsRemoteControlRes.interface';
import { RemoteService } from './remote.service';

@Controller('creator/remote')
export class RemoteController {
  constructor(private readonly remoteService: RemoteService) {}

  @UseGuards(IsAuthGuard)
  @Get('page-url')
  findRemotePageUrl(@Creator() { creatorId }: CreatorSession): Promise<string> {
    return this.remoteService.findRemotePageUrl(creatorId);
  }

  @Get('campaigns')
  findCampaignsRemoteControl(
    @Query(ValidationPipe) dto: FindCampaignsRemoteControlDto,
  ): Promise<FindCampaignsRemoteControlRes> {
    return this.remoteService.findCampaignsRemoteControl(dto.remoteControllerUrl);
  }

  @Patch('onoff')
  updateRemoteOnOff(@Body(ValidationPipe) dto: UpdateRemoteOnOffDto): Promise<boolean> {
    return this.remoteService.updateRemoteOnOff(dto);
  }
}
