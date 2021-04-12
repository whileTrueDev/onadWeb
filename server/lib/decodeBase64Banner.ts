export default function decodeBase64Banner(base64Banner: string): {
  bannerImgBuffer: Buffer;
  contentType: string;
  fileExt: string;
} {
  const fileType = base64Banner.substring('data:'.length, base64Banner.indexOf(';base64'));

  let bannerImg: any;
  let extension = '';

  if (fileType.startsWith('image/')) {
    extension = base64Banner.substring('data:image/'.length, base64Banner.indexOf(';base64'));
    bannerImg = Buffer.from(base64Banner.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  }
  if (fileType.startsWith('video/')) {
    bannerImg = Buffer.from(base64Banner.replace(/^data:video\/\w+;base64,/, ''), 'base64');
    extension = base64Banner.substring('data:video/'.length, base64Banner.indexOf(';base64'));
  }

  return {
    bannerImgBuffer: bannerImg,
    contentType: fileType,
    fileExt: extension,
  };
}
