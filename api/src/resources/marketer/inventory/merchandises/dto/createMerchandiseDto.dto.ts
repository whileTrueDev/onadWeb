import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

class CreateMerchandisePickupAddressDto {
  @IsString() roadAddress: string; // 도로명 주소
  @IsString() roadAddressEnglish: string; // 도로명 영어 주소
  @IsOptional() @IsString() roadAddressDetail?: string; // 사용자 입력 상세 주소
  @IsString() jibunAddress: string; // 지번 주소
  @IsString() jibunAddressEnglish: string; // 지번 영어 주소
  @IsString() buildingCode: string; // 건물 코드
  @IsString() sido: string; // 시/도
  @IsString() sigungu: string; // 시군구 이름
  @IsString() sigunguCode: string; // 시군구 코드
  @IsString() bname: string; // 법정동 이름
  @IsString() bCode: string; // 법정동 코드
  @IsString() roadname: string; // 도로명
  @IsString() roadnameCode: string; // 도로명코드
  @IsString() zoneCode: string; // 우편번호
}

class CreateMerchandiseOptionsDto {
  @IsString() type: string;
  @IsString() name: string;
  @IsNotEmpty() additionalPrice: number;
}

export class CreateMerchandiseDto {
  @IsString() name: string;
  @IsNotEmpty() regularPrice: number;
  @IsNotEmpty() price: number;
  @IsNotEmpty() stock: number;

  @IsOptional()
  @IsBoolean()
  optionFlag?: boolean;

  @IsOptional()
  @IsBoolean()
  pickupFlag?: boolean;

  @IsString() description: string;
  @IsArray() images: string[];
  @IsArray() descImages: string[];

  @ValidateIf((obj: CreateMerchandiseDto) => obj.pickupFlag)
  @ValidateNested()
  @Type(() => CreateMerchandisePickupAddressDto)
  pickupAddress?: CreateMerchandisePickupAddressDto;

  @ValidateIf((obj: CreateMerchandiseDto) => obj.optionFlag)
  @ValidateNested()
  @Type(() => CreateMerchandiseOptionsDto)
  options?: CreateMerchandiseOptionsDto[];
}
