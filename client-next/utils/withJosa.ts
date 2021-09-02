export type JosaType = '을/를' | '은/는' | '이/가' | '과/와' | '으로/로';

function checkJongSung(wordCode: number): boolean {
  return (wordCode - 0xac00) % 28 > 0;
}

export default function withJosa(word: string, josaType: JosaType): string {
  const strCode = word.charCodeAt(word.length - 1);
  // 한글이 아닌 경우
  if (strCode < 0xac00 || strCode > 0xd7a3) {
    return word;
  }
  switch (josaType) {
    case '을/를':
      return checkJongSung(strCode) ? `${word}을` : `${word}를`;
    case '은/는':
      return checkJongSung(strCode) ? `${word}은` : `${word}는`;
    case '이/가':
      return checkJongSung(strCode) ? `${word}이` : `${word}가`;
    case '과/와':
      return checkJongSung(strCode) ? `${word}과` : `${word}와`;
    case '으로/로':
      return checkJongSung(strCode) ? `${word}으로` : `${word}로`;
    default:
      throw new Error('getJosa 함수는 josaType 파라미터가 필요합니다.');
  }
}
