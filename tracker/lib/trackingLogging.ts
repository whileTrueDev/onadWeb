export default function trackingLogging(
  channelType: string, creatorId: string, message: string,
): void{
  console.log(`[${new Date().toLocaleString()}] ${channelType}|${creatorId} - ${message}`);
}
