import React, { useEffect } from 'react';
import {
  Button, Typography, CircularProgress
} from '@material-ui/core';
import styles from '../style/HowToUse.style';
import shortid from 'shortid';

interface HowToUseProps {
  source: {
    content: string[]
  };
  MainUserType: boolean;
}

function HowToUse({ source, MainUserType }: HowToUseProps): JSX.Element {
  const classes = styles();

  const [loading, setLoading] = React.useState(false);
  const [iframeLoading, setIframeLoading] = React.useState(false);

  function handleClick(): void {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  useEffect(() => {
    const iframeDocument = document.getElementById('onadYouTube') as HTMLIFrameElement
    iframeDocument.onload = function() {
      if (!iframeLoading) { 
        setIframeLoading(true)
        iframeDocument.src += '?autoplay=1'
      } else {
        return;
      }
    }
  }, [iframeLoading])

  return (
    <div className={classes.root}>
        <div className={classes.wrapper}>
          <iframe
            src={"https://www.youtube.com/embed/hwUgWypZyh8"}
            title="onadYouTube"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={classes.onadVideo}
            id="onadYouTube"
          />
          <div className={classes.contentWapper}>
            {source.content.map((text) => (
              <Typography variant="h4" key={shortid.generate()} className={classes.content}>{text}</Typography>
            ))}
            <div className={MainUserType ? classes.bottomLine : classes.bottomLine2} />
            <Button className={classes.button}
              onClick={handleClick}
            >
              <Typography variant="subtitle1">
              <a href="/howtouse/온애드서비스소개서.pdf" download="온애드서비스소개서" style={{color: 'black'}}>소개 자료 다운로드</a>
                {loading && (
                  <CircularProgress
                    disableShrink
                    size={16}
                    thickness={5}
                    variant="indeterminate"
                  />
                )}
              </Typography>
            </Button>
          </div>
        </div>
    </div>
  );
}

export default HowToUse;
