export default function isVideo(src) {
  const videoRegex = /video\/mp4/;
  return videoRegex.test(src);
}
