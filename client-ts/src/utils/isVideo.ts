export default function isVideo(src: string): boolean {
  const isBase64 = (s: string): boolean => /data:image\/([a-zA-Z]*);base64,([^\\"]*)/.test(s);

  if (isBase64(src)) {
    const videoRegex = /\/mp4;base64,/;
    return videoRegex.test(src);
  }
  const videoRegex = /.mp4/;
  return videoRegex.test(src);
}
