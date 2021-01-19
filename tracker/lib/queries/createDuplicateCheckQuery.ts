export interface DuplicateCheckParams {
  creatorId: string; campaignId: string; connectedLinkId: string; nowIp?: string | string[];
}
/**
 * tracking 정보 중복을 체크하는 쿼리와 쿼리 파라미터 배열을 반환하는 함수.
 * @param params tracking 정보 중복 적재 체크를 위한 파라미터
 */
export default function createDuplicateCheckQuery(
  params: DuplicateCheckParams
): [string, Array<any>] {
  const {
    creatorId, campaignId, connectedLinkId, nowIp,
  } = params;
  const alreadyInsertedCheckQuery = `
      SELECT id FROM tracking
        WHERE creatorId = ?
        AND campaignId = ? AND linkId = ? AND ip = ?
        AND clickedTime > DATE_SUB(now(), INTERVAL 7 DAY)`;
  const alreadyInsertedCheckArray = [creatorId, campaignId, connectedLinkId, nowIp];
  return [alreadyInsertedCheckQuery, alreadyInsertedCheckArray];
}
