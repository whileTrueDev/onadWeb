import { Controller, Get } from '@nestjs/common';
import { CreatorsAnalysisService } from './creators-analysis/creators-analysis.service';
import { CreatorsDetail } from './creators-analysis/interfaces/creatorsDetail.interface';
import { CreatorsGames } from './creators-analysis/interfaces/creatorsGames.interface';
import { CreatorsService } from './creators.service';
import { CreatorsBroadcastRes } from './interfaces/creatorsBroadcastRes.interface';
import { CreatorsLiveRes } from './interfaces/creatorsLiveRes.interface';
import { CreatorsRes } from './interfaces/creatorsRes.interface';

@Controller('creators')
export class CreatorsController {
  constructor(
    private readonly creatorsService: CreatorsService,
    private readonly creatorsAnalysisService: CreatorsAnalysisService,
  ) {}

  @Get()
  creators(): Promise<CreatorsRes> {
    return this.creatorsService.findCreatorsAnalyzed();
  }

  @Get('/live')
  liveCreators(): Promise<CreatorsLiveRes> {
    return this.creatorsService.findNowOnBroadCreators();
  }

  @Get('broadcast')
  nowOnBroadCount(): Promise<CreatorsBroadcastRes> {
    return this.creatorsService.findNowOnBroadCount();
  }

  // ************************************
  // creators/analysis
  // ************************************
  @Get('analysis/detail')
  detail(): Promise<CreatorsDetail> {
    return this.creatorsAnalysisService.findCreatorDetail();
  }

  @Get('analysis/games')
  games(): Promise<CreatorsGames> {
    return this.creatorsAnalysisService.findGames();
  }
}
