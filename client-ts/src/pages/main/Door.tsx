import React from 'react';
import { Typography, Button } from '@material-ui/core';
import classNames from 'classnames';
import shortid from 'shortid';
import source from './source/doorSource';
import useStyles from './style/Door.style';

export default function Door(): JSX.Element {
  const css = useStyles();
  const wavePathMd = `
  M 0 66.6 c 0 0 184.7 -66.6 480 -66.6 s 480 66.6 480 66.6 s 203.3 66.6 480 66.6 s 480 -66.6 480 -66.6;
  M 0 66.6 c 0 0 203.3 66.6 480 66.6 s 480 -66.6 480 -66.6 s 184.7 -66.6 480 -66.6 s 480 66.6 480 66.6;
  M 0 66.6 c 0 0 184.7 -66.6 480 -66.6 s 480 66.6 480 66.6 s 203.3 66.6 480 66.6 s 480 -66.6 480 -66.6;
  `;
  return (
    <div className={classNames(css.root, css.rowCenterAlign)}>
      <div className={css.contentWrapper}>
        <img src="/logo/textLogo.png" alt="textlogo" className={css.logo} />
        <div className={css.content}>
          <div className={css.leftContent}>
            <div>
              {source.title.map((title) => (
                <Typography
                  variant="h4"
                  style={{ fontWeight: 500 }}
                  className={css.mainTitle}
                  key={shortid.generate()}
                >
                  {title}
                </Typography>
              ))}
            </div>

            <div className={classNames(css.buttonWrapper, css.columnCenterAlign)}>
              {source.buttonTitle.map((title) => (
                <Button
                  className={css.button}
                  href={title === '광고주' ? '/marketer' : '/creator'}
                  key={shortid.generate()}
                >
                  <Typography variant="h6" className={css.buttonText}>{title}</Typography>
                </Button>
              ))}
            </div>

          </div>
          <div className={classNames(css.rightContent, css.rowCenterAlign)}>
            <div>
              <div className={css.InnerLeft}>
                <img src="/door/mainCharacter.png" className={css.mainCharacter} alt="mainCharacter" />
                <div className={css.banner}>
                  <Typography variant="subtitle1" style={{ fontWeight: 600 }}>{source.banner}</Typography>
                </div>
              </div>
              <div className={css.InnerLeftBottom}>
                <img src="/logo/iconLogo.png" alt="iconlogo" className={css.onadLogo} />
                <div className={css.bottomText}>
                  <Typography variant="body2" style={{ fontWeight: 600 }}>{source.capationTitle}</Typography>
                  <Typography variant="caption">{source.captionContent}</Typography>
                </div>
              </div>
            </div>
            <div className={css.InnerRight}>
              <div className={css.flipWrapper}>
                <div className={css.flip}>
                  {source.chatting.map((row) => (
                    <div key={shortid.generate()} className={css.chatting}>
                      <Typography variant="body2" style={{ fontWeight: 600, color: `${row.color}` }}>{row.userName}</Typography>
                      <Typography variant="body2" style={{ fontWeight: 600 }}>{row.text}</Typography>
                    </div>
                  ))}
                </div>
              </div>
              <div className={css.chattingBottom}>
                <div id="chatControl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 바탕 그라데이션 */}
      <div className={css.bgParent} />

      {/* 웨이브 애니메이션 커스터마이징 */}
      <svg className={css.wave} viewBox="0 0 1920 140">
        <defs>
          <path
            id="waveMotion"
            strokeWidth="2px"
            fill="none"
            stroke="#b1e4ff"
            strokeLinecap="round"
          >
            <animate
              id="waving"
              attributeName="d"
              values={wavePathMd}
              dur="30s"
              repeatCount="indefinite"
            />
          </path>
        </defs>
        <use xlinkHref="#waveMotion" />
      </svg>

    </div>

  );
}
