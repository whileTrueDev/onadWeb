// DB 연결하여 캠페인의 이미지 저장.
const fs = require('fs');

require('dotenv').config();

process.env.ROOT_PATH = __dirname;
process.env.NODE_ENV = (process.env.NODE_ENV
  && (process.env.NODE_ENV).trim().toLowerCase() === 'production')
  ? 'production' : 'development';
let FRONT_HOST = process.env.DEV_REACT_HOSTNAME;
if (process.env.NODE_ENV === 'production') {
  FRONT_HOST = process.env.PRODUCTION_REACT_HOSTNAME;
}

const doQuery = require('./model/doQuery');


// 이미 저장된 캠페인의 경우 저장하지 않는다.
const getSavedImageList = () => {
  const selectQuery = `
  select distinct bannerId
  from bannerFrames
  `;

  return new Promise((resolve, reject) => {
    doQuery(selectQuery, [])
      .then((inrow) => {
        const banners = inrow.result.map(({ bannerId }) => bannerId);
        resolve(banners);
      });
  });
};

const saveInCheckBanners = ({ bannerId, bannerSrc }) => {
  const insertQuery = `
  INSERT bannerFrames
  (bannerId, bannerSrc) 
  VALUES (?, ?)
  `;

  return new Promise((resolve, reject) => {
    doQuery(insertQuery, [bannerId, bannerSrc])
      .then((inrow) => {
        resolve();
      });
  });
};

const updateCheckBanner = (banners) => {
  const imageListQuery = `
  select A.bannerId, bannerSrc
  from (
  select distinct bannerId
  from campaign
  left join marketerInfo
  on campaign.marketerId = marketerInfo.marketerId 
  where NOT campaign.optionType = 2
  AND campaign.deletedState = 0
  ) as A
  inner join bannerRegistered
  on A.bannerId = bannerRegistered.bannerId
  `;

  return new Promise((resolve, reject) => {
    doQuery(imageListQuery, [])
      .then((inrow) => {
        // 동일한 배너인데 캠페인이 여러개일 수 있다.
        Promise.all(
          inrow.result.map(({ bannerId, bannerSrc }) => {
            if (banners.includes(bannerId)) {
              return;
            }
            const ext = bannerSrc.split(';')[0].match(/jpeg|png|gif|jpg/)[0];
            // strip off the data: url prefix to get just the base64-encoded bytes
            if (ext === 'gif') {
              // 현재 table에 존재하는 캠페인일 경우 저장하지 않는다.
              const base64Image = bannerSrc.replace(/^data:image\/\w+;base64,/, '');
              const buf = Buffer.from(base64Image, 'base64');
              fs.writeFile(`./banners/gif/${bannerId}.${ext}`, buf, (err) => {
                console.log(`${bannerId}.${ext} File created`);
              });
              return;
            }
            return saveInCheckBanners({ bannerId, bannerSrc });
            // gif가 아닌 경우 저장시키지 않는다.
          })
        )
          .then(() => {
            console.log('gif를 제외한 모든 ');
            resolve();
          });
      })
      .catch((errorData) => {
        console.log(errorData);
        reject(errorData);
      });
  });
};

// table에 저장된 배너를 제외한 업데이트되는 banner의 frame들을 저장한다.
const saveGifBanners = (banners) => {
  const path = './banners/frames/';
  fs.readdir(path, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      // 폴더 내부의 frame들의 이름을 각각 확인하여 bannerId가 존재할 경우 넘어간다.
      const filenameList = file.split('_');
      const bannerId = `${filenameList[0]}_${filenameList[1]}`;
      if (banners.includes(bannerId)) {
        return;
      }
      fs.readFile(path + file, { encoding: 'base64' }, (err, banner) => {
        const fileHead = 'data:image/jpeg;base64,';
        const bannerSrc = fileHead + banner;
        // const buf = Buffer.from(base64Image, 'base64');
        // fs.writeFile(`./banners/${file}`, buf, (err) => {
        //   console.log('File created');
        // });
        saveInCheckBanners({ bannerId, bannerSrc })
          .then(() => {
            console.log(`${bannerId}의 frame을 저장하였습니다.`);
          });
      });
    });
  });
};


// 올라간 배너 체크
const checkUploadBanners = () => {
  const imageListQuery = `
  select bannerId, bannerSrc
  from bannerFrames
  `;

  return new Promise((resolve, reject) => {
    doQuery(imageListQuery, [])
      .then((inrow) => {
        // 동일한 배너인데 캠페인이 여러개일 수 있다.
        inrow.result.forEach(({ bannerId, bannerSrc }, index) => {
          const ext = bannerSrc.split(';')[0].match(/jpeg|png|gif|jpg/)[0];
          const base64Image = bannerSrc.replace(/^data:image\/\w+;base64,/, '');
          const buf = Buffer.from(base64Image, 'base64');
          fs.writeFile(`./banners/${bannerId}_${index}.${ext}`, buf, (err) => {
            console.log(`${bannerId}_${index}.${ext} File created`);
          });
        });
      });
  });
};

async function calculation() {
  const banners = await getSavedImageList();

  // 새롭게 저장되는 배너를 확인한다.
  // updateCheckBanner(banners);

  // gif를 frame으로 잘라서 frame 디렉토리에 저장후 아래의 함수를 실행한다.
  saveGifBanners(banners);

  // checkUploadBanners();
}

calculation();
