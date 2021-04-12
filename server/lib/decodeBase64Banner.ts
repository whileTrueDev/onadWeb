export default function decodeBase64Banner(base64Banner: string): {
  bannerImgBuffer: Buffer;
  contentType: string;
  fileExt: string;
} {
  const fileType = base64Banner.substring('data:'.length, base64Banner.indexOf(';base64'));

  const bannerImg = Buffer.from(base64Banner.replace(/^data:\/\w+;base64,/, ''), 'base64');

  console.log(base64Banner.replace(/^data:image\/\w+;base64,/, ''));
  let extension = '';

  if (fileType.startsWith('image/')) {
    extension = base64Banner.substring('data:image/'.length, base64Banner.indexOf(';base64'));
  }
  if (fileType.startsWith('video/')) {
    extension = base64Banner.substring('data:video/'.length, base64Banner.indexOf(';base64'));
  }

  return {
    bannerImgBuffer: bannerImg,
    contentType: fileType,
    fileExt: extension,
  };
}
