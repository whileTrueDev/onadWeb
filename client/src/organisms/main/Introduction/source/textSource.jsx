

const textSource = {
  heroSector: {
    creator: {
      text: {
        title: '데이터 분석을 통해\n관련 있는 방송에 자동으로.\n실시간으로 광고를 송출하세요.',
      },
    },
    marketer: {
      text: {
        title: '간단한 설정으로\n자동으로 송출되는 광고\n지속적인 추가수입을 창출하세요.'
      }
    },
    backImage: '/pngs/main/mainImage.jpg',
  },
  topSector: [
    {
      url: '/pngs/introduction/service_main_1.png',
      width: '50%',
      trigger: {
        threshold: 400,
        timeout: 500
      }
    },
    {
      url: '/pngs/introduction/service_main_2.png',
      width: '50%',
      trigger: {
        threshold: 400,
        timeout: 1000
      }
    },
    {
      url: '/pngs/introduction/service_main_3.png',
      width: '50%',
      trigger: {
        threshold: 700,
        timeout: 500
      }
    },
    {
      url: '/pngs/introduction/service_main_4.png',
      width: '50%',
      trigger: {
        threshold: 700,
        timeout: 1000
      }
    },
  ],
  creator: {
    firstSector: {
      image: 'pngs/introduction/serviceMain.png',
      head: '크리에이터',
      body: '방송에 배너를 띄우기만 하세요.\n시청자 수와 방송시간에 비례해서\n추가수익을 창출할 수 있습니다.',
    },
    secondSector: {
      head: '이용안내',
      subTitle: '',
      firstContent: '트위치 아이디로\n 쉽게 가입하실 수 있습니다',
      secondContent: '대시보드로 이동해서\n생성된 URL을 복사해주시면 됩니다',
      thirdContent: 'X-Split이나 OBS로 생성된 URL을\n 붙여놓으면 사용하실 수 있습니다',
      fourthContent: '광고로 인한 수익을\n환전할 수 있습니다.',
    },
  },
  marketer: {
    firstSector: {
      image: 'pngs/introduction/serviceMain.png',
      head: '마케터',
      body: '배너 이미지를 업로드한 이후\n실시간 방송에 배너가 송출됩니다.\n또한, 광고 페이지를 통해 구매로 이어질 수 있습니다.',
    },
    secondSector: {
      head: '이용안내',
      subTitle: '',
      firstContent: '간단하게\n 회원가입하세요.',
      secondContent: '실시간 방송에 송출될\n 배너를 등록해주세요',
      thirdContent: '분석된 관련성에 따라\n 배너가 송출됩니다.',
      fourthContent: '예산에 맞게\n원하는 만큼 광고하세요.',
    },
  },

};

export default textSource;
