export default function isVideo(src: string): boolean {
  const videoRegex = /video\/mp4/;
  return videoRegex.test(src);
}
