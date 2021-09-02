// material-UI
import { Button, Typography, CircularProgress } from '@material-ui/core';
// 내부 소스
// 프로젝트 내부 모듈
import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
// 컴포넌트
// util 계열
// 스타일
import styles from '../../../../styles/mainpage/main/howToUse/howToUse.style';

interface HowToUseProps {
  source: {
    content: string[];
  };
  MainUserType: boolean;
}

function HowToUse({ source, MainUserType }: HowToUseProps): JSX.Element {
  const classes = styles();
  const [loading, setLoading] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);

  function handleClick(): void {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  useEffect(() => {
    const iframeDocument = document.getElementById('onadYouTube') as HTMLIFrameElement;

    function handleLoad() {
      if (!iframeLoading) {
        setIframeLoading(true);
        iframeDocument.src += '?autoplay=1';
      }
    }
    iframeDocument.addEventListener('load', handleLoad);

    return () => {
      iframeDocument.removeEventListener('load', handleLoad);
    };
  }, [iframeLoading]);

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.iframeWrapper}>
          <iframe
            title="onadYouTube"
            src="https://www.youtube-nocookie.com/embed/E3HQlhMF-eg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={!iframeLoading ? classes.onadVideo : classes.onadVideoReady}
            id="onadYouTube"
          />
        </div>
        <div className={classes.contentWapper}>
          {source.content.map(text => (
            <Typography variant="h4" key={nanoid()} className={classes.content}>
              {text}
            </Typography>
          ))}
          <div className={MainUserType ? classes.bottomLine : classes.bottomLine2} />
          <Button
            className={classes.button}
            onClick={() => {
              handleClick();
              window.open(
                'https://onad-static-files.s3.ap-northeast-2.amazonaws.com/pdfs/onadIntro.pdf',
                '_blank',
              );
            }}
          >
            <Typography variant="subtitle1">
              소개 자료 다운로드
              {loading && (
                <CircularProgress disableShrink size={16} thickness={5} variant="indeterminate" />
              )}
            </Typography>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HowToUse;
