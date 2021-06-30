import { useMemo, useState, useLayoutEffect } from 'react';
import { Button, Typography, CircularProgress } from '@material-ui/core';
import { nanoid } from 'nanoid';
import { useLocation } from 'react-router-dom';
import styles from '../style/HowToUse.style';

interface HowToUseProps {
  source: {
    content: string[];
  };
  // timer: NodeJS.Timeout | undefined;
}

function HowToUse({ source }: HowToUseProps): JSX.Element {
  const classes = styles();

  const { pathname } = useLocation();
  const isMarketerPage = useMemo(() => pathname.includes('/marketer'), [pathname]);

  const [loading, setLoading] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);

  function handleClick(): void {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  useLayoutEffect(() => {
    const iframeDocument = document.getElementById('onadYouTube') as HTMLIFrameElement;
    iframeDocument.src = 'https://www.youtube.com/embed/E3HQlhMF-eg';

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
          <div className={isMarketerPage ? classes.bottomLine : classes.bottomLine2} />
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
