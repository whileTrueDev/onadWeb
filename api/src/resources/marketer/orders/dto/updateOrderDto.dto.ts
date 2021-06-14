import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsInt()
  orderId: number;

  @IsInt()
  status: number;

  @IsOptional()
  @IsString()
  denialReason?: string;

  @IsOptional()
  @IsString()
  courierCompany?: string;

  @IsOptional()
  @IsString()
  trackingNumber?: string;
}
