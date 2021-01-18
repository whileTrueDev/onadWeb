/**
 * 특정 크리에이터의 경험치를 상승시키는 쿼리 및 쿼리파라미터 배열을 반환하는 함수.
 * @param creatorId 레벨 경험치가 상승될 크리에이터 아이디
 */
export default function createLevelUpQuery(creatorId: string): [string, string[]] {
  const levelQuery = `
      UPDATE creatorRoyaltyLevel
        SET exp = exp + 1
        WHERE creatorId = ?`;
  const levelQueryArray = [creatorId];

  return [levelQuery, levelQueryArray];
}
