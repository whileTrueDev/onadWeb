import Head from 'next/head';

export default function HeadCompo(): JSX.Element {
  const MainURL = 'https://onad.io';
  return (
    <Head>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
      <link
        href="https://fonts.googleapis.com/css?family=Gothic+A1|Noto+Sans+KR|Nanum+Gothic&display=swap"
        rel="stylesheet"
      />
      {/* naver: wt_onad */}
      <meta name="naver-site-verification" content={process.env.NEXT_PUBLIC_NAVER_CONTENT} />
      {/* Favicon */}l
      <link rel="apple-touch-icon" sizes="57x57" href="./favicons/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/favicons/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/favicons/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/favicons/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/favicons/apple-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/favicons/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/favicons/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/favicons/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-icon-180x180.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/favicons/android-icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/favicons/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
      <meta name="theme-color" content="#fff" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="ONAD" />
      <meta property="og:url" content="https://onad.io" />
      <meta name="canonical" ref={MainURL} />
      <link rel="manifest" href="/manifest.json" />
      <title>온애드 | 1인 미디어 실시간 광고 플랫폼</title>
      <meta
        property="og:description"
        content="ONAD는 1인 미디어 실시간 방송에 배너광고를 송출하는 플랫폼입니다. 방송인은 ONAD를 통해 추가 수익을, 광고주는 온애드를 통해 효율적인 광고 채널을 확보할 수 있습니다."
      />
      <meta
        property="og:image"
        content="https://onad-static-files.s3.ap-northeast-2.amazonaws.com/open-graph/logo_opengraph.png"
      />
    </Head>
  );
}
