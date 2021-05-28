import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Marketer } from '../../../../decorator/sessionData.decorator';
import { MerchandisePickupAddresses } from '../../../../entities/MerchandisePickupAddresses';
import { MerchandiseRegistered } from '../../../../entities/MerchandiseRegistered';
import { MarketerSession } from '../../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../../auth/guards/isAuth.guard';
import { CreateMerchandiseDto } from './dto/createMerchandiseDto.dto';
import { FindMerchandisesPaginatedDto } from './dto/findMerchandisesPaginatedDto.dto';
import {
  FindMerchandiseDetail,
  FindMerchandiseRes,
} from './interfaces/findMerchandiseRes.interface';
import { MerchandisesService } from './merchandises.service';

@Controller('marketer/merchandises')
export class MerchandisesController {
  constructor(private readonly merchandisesService: MerchandisesService) {}
  @UseGuards(IsAuthGuard)
  @Get()
  findMerchandisesPaginated(
    @Marketer() { marketerId }: MarketerSession,
    @Query() dto: FindMerchandisesPaginatedDto,
  ): Promise<MerchandiseRegistered[] | FindMerchandiseDetail[]> {
    if (dto.onlyNotConnected) {
      return this.merchandisesService.findNotConnectedMerchandises(marketerId);
    }
    if (dto.page && dto.offset) {
      return this.merchandisesService.findMerchandisesPaginated(marketerId, dto);
    }
    return this.merchandisesService.findMerchandisesByMarketer(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Post()
  createMerchandise(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: CreateMerchandiseDto,
  ) {
    return this.merchandisesService.createMerchandise(marketerId, dto);
  }

  @UseGuards(IsAuthGuard)
  @Delete()
  deleteMerchandise() {
    this.merchandisesService.deleteMerchandise();
  }

  @UseGuards(IsAuthGuard)
  @Get('length')
  findMerchandisesCount(@Marketer() { marketerId }: MarketerSession): Promise<number> {
    return this.merchandisesService.findMerchandisesCount(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Get('dup-check')
  duplicateCheck(@Query('name') merchandiseName: string): Promise<boolean> {
    return this.merchandisesService.duplicateCheck(merchandiseName);
  }

  @UseGuards(IsAuthGuard)
  @Get('campaigns')
  findCampaignByMerchandise(
    @Marketer() { marketerId }: MarketerSession,
    @Query('id', ParseIntPipe) merchandiseId: number,
  ): Promise<number> {
    return this.merchandisesService.findCampaignByMerchandise(marketerId, merchandiseId);
  }

  @UseGuards(IsAuthGuard)
  @Get('addresses')
  findAddress(@Marketer() { marketerId }: MarketerSession): Promise<MerchandisePickupAddresses[]> {
    return this.merchandisesService.findMerchandiseAddress(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Get(':id')
  findMerchandise(@Param('id', ParseIntPipe) merchandiseId: number): Promise<FindMerchandiseRes> {
    return this.merchandisesService.findMerchandise(merchandiseId);
  }
}
