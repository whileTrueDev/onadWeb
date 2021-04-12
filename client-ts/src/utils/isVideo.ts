export default function isVideo(src: string): boolean {
  const videoRegex = /.mp4/;
  return videoRegex.test(src);
}
