import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketerActionLog } from '../../entities/MarketerActionLog';

export enum MarketerActionLogType {
  "이벤트캐시충전",
  "자가캐시충전",
  '배너등록',
  "배너승인",
  "배너거절",
  "캠페인생성",
  "캠페인on/off",
  "광고on/off" ,
  "세금계산서발행/미발행",
  "환불요청",
  "환불요청결과" ,
  "배너삭제",
  "캠페인삭제" ,
  "링크거절",
  "링크승인",
}

@Injectable()
export class MarketerActionLogService {
  constructor(@InjectRepository(MarketerActionLog) private readonly actionLogRepo: Repository<MarketerActionLog>) {}

  public async createLog(marketerId: string, type: MarketerActionLogType, detail: string) {
    const newLog = this.actionLogRepo.create({ marketerId, type, detail });
    return this.actionLogRepo.save(newLog);
  }
}
