/**
 * @name 리모컨 URL 생성함수 
 */
export default function makeRemoteControllerUrl(creatorId?: string): string | null {
  if (creatorId && creatorId.length !== 0) {
    const remoteControllerUrl = Buffer.from(creatorId).toString('base64');
    return `/${remoteControllerUrl}`;
  }
  return null;
}
