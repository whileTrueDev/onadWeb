import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { Marketer } from '../../../decorators/sessionData.decorator';
import { MarketerInfo } from '../../../entities/MarketerInfo';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { CreateOrUpdateMarketerProfileImageDto } from './dto/createOrUpdateMarketerProfileImageDto.dto';
import { ProfileImageService } from './profile-image.service';

@Controller('marketer/profile-image')
export class ProfileImageController {
  constructor(private readonly profileImageService: ProfileImageService) {}

  @UseGuards(IsAuthGuard)
  @Get()
  findProfileImage(@Marketer() { marketerId }: MarketerSession): Promise<Partial<MarketerInfo>> {
    return this.profileImageService.readProfileImage(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Post()
  createProfileImage(
    @Marketer() { marketerId }: MarketerSession,
    @Body() dto: CreateOrUpdateMarketerProfileImageDto,
  ): Promise<boolean> {
    return this.profileImageService.createOrUpdateProfileImage(marketerId, dto.profileImage);
  }

  @UseGuards(IsAuthGuard)
  @Patch()
  updateProfileImage(
    @Marketer() { marketerId }: MarketerSession,
    @Body() dto: CreateOrUpdateMarketerProfileImageDto,
  ): Promise<boolean> {
    return this.profileImageService.createOrUpdateProfileImage(marketerId, dto.profileImage);
  }

  @UseGuards(IsAuthGuard)
  @Delete()
  deleteProfileImage(@Marketer() { marketerId }: MarketerSession): Promise<boolean> {
    return this.profileImageService.deleteProfileImage(marketerId);
  }
}
