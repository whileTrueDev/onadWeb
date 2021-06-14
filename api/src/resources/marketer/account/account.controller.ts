import { Body, Controller, Get, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { Marketer } from '../../../decorators/sessionData.decorator';
import { MarketerInfo } from '../../../entities/MarketerInfo';
import { MarketerSession } from '../../../interfaces/Session.interface';
import { IsAuthGuard } from '../../auth/guards/isAuth.guard';
import { AccountService } from './account.service';
import { UpdateMarketerAccountDto } from './dto/updateMarketerAccountDto.dto';

@Controller('marketer/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(IsAuthGuard)
  @Get()
  findMarketerAccount(@Marketer() { marketerId }: MarketerSession): Promise<Partial<MarketerInfo>> {
    return this.accountService.findMarketerAccount(marketerId);
  }

  @UseGuards(IsAuthGuard)
  @Put()
  updateMarketerAccount(
    @Marketer() { marketerId }: MarketerSession,
    @Body(ValidationPipe) dto: UpdateMarketerAccountDto,
  ): Promise<boolean> {
    return this.accountService.updateMarketerAccount(marketerId, dto);
  }
}
