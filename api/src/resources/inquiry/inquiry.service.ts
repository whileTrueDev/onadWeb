import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorInquiry } from '../../entities/CreatorInquiry';
import { MarketerInquiry } from '../../entities/MarketerInquiry';
import { SlackService } from '../slack/slack.service';
import { CreatorInquiryDto } from './dto/creatorInquiryDto.dto';
import { MarketerInquiryDto } from './dto/marketerInquiryDto.dto';

@Injectable()
export class InquiryService {
  constructor(
    private readonly slackService: SlackService,
    @InjectRepository(MarketerInquiry)
    private readonly marketerInquiryRepo: Repository<MarketerInquiry>,
    @InjectRepository(CreatorInquiry)
    private readonly creatorInquiryRepo: Repository<CreatorInquiry>,
  ) {}

  createMarketerInquiry(dto: MarketerInquiryDto): Promise<MarketerInquiry> {
    const inqiury = this.marketerInquiryRepo.create({
      name: dto.name,
      email: dto.email,
      contactNumber: dto.contactNumber,
      brandName: dto.brandName,
      homepage: dto.homepage,
      inquiryContents: dto.inquiryContents,
      privacyAgreement: dto.privacyAgreement ? 1 : 0,
    });

    const insertedInquiry = this.marketerInquiryRepo.save(inqiury);

    // 슬랙
    this.slackService.jsonMessage({
      summary: '마케터 문의 요청 알림',
      text: '관리자 페이지에서 방금 등록된 마케터의 문의를 확인하고, 응답하세요.',
      fields: [
        { title: '마케터 이름', value: dto.name, short: true },
        { title: '브랜드 이름', value: dto.brandName || '입력안함', short: true },
        { title: '마케터 홈페이지', value: dto.homepage || '입력안함', short: true },
        {
          title: '문의 내용',
          value:
            dto.inquiryContents.length >= 20
              ? `${dto.inquiryContents.slice(0, 20)}...`
              : dto.inquiryContents,
          short: true,
        },
      ],
    });

    return insertedInquiry;
  }

  createCreatorInquiry(dto: CreatorInquiryDto): Promise<CreatorInquiry> {
    const inquiry = this.creatorInquiryRepo.create({
      name: dto.name,
      email: dto.email,
      usingPlatform: dto.usingPlatform,
      inquiryContents: dto.inquiryContents,
      privacyAgreement: dto.privacyAgreement ? 1 : 0,
    });

    const insertedInquiry = this.creatorInquiryRepo.save(inquiry);

    // 슬랙
    this.slackService.jsonMessage({
      summary: '방송인 문의 요청 알림',
      text: '관리자 페이지에서 방금 등록된 방송인의 문의를 확인하고, 응답하세요.',
      fields: [
        { title: '방송인 이름', value: dto.name, short: true },
        { title: '이용중인 플랫폼', value: dto.usingPlatform, short: true },
        {
          title: '문의 내용',
          value:
            dto.inquiryContents.length >= 20
              ? `${dto.inquiryContents.slice(0, 20)}...`
              : dto.inquiryContents,
          short: true,
        },
      ],
    });

    return insertedInquiry;
  }
}
