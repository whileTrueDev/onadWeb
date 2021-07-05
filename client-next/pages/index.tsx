// material-UI
import { Typography } from '@material-ui/core';
// 내부 소스
import source from '../source/doorSource';
import textLogo from '../public/logo/textLogo.png';
import mainCharacter from '../public/door/mainCharacter.png';
import iconLogo from '../public/logo/iconLogo.png';
// 프로젝트 내부 모듈
import classNames from 'classnames';
import { nanoid } from 'nanoid';
// 컴포넌트
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
// 스타일
import useStyles from '../styles/main/door.style';

const wavePathMd = `
  M 0 66.6 c 0 0 184.7 -66.6 480 -66.6 s 480 66.6 480 66.6 s 203.3 66.6 480 66.6 s 480 -66.6 480 -66.6;
  M 0 66.6 c 0 0 203.3 66.6 480 66.6 s 480 -66.6 480 -66.6 s 184.7 -66.6 480 -66.6 s 480 66.6 480 66.6;
  M 0 66.6 c 0 0 184.7 -66.6 480 -66.6 s 480 66.6 480 66.6 s 203.3 66.6 480 66.6 s 480 -66.6 480 -66.6;
  `;

export default function Door(): JSX.Element {
  const css = useStyles();

  return (
    <div className={classNames(css.root, css.rowCenterAlign)}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <div className={css.logo}><Image src={textLogo} alt="textlogo" /></div>
      <div className={css.contentWrapper}>
        <div className={css.content}>
          <div className={css.leftContent}>
            <div>
              {source.title.map(title => (
                <Typography
                  variant="h4"
                  style={{ fontWeight: 500 }}
                  className={css.mainTitle}
                  key={nanoid()}
                >
                  {title}
                </Typography>
              ))}
            </div>

            <div className={classNames(css.buttonWrapper, css.columnCenterAlign)}>
              {source.buttonTitle.map(title => (
                <Link
                  href={title === '광고주' ? '/marketer' : '/creator'}
                  key={nanoid()}
                >
                  <a className={css.button}>
                    <Typography variant="h6" className={css.buttonText}>
                      {title}
                    </Typography>
                  </a>
                </Link>
              ))}
            </div>
          </div>
          <div className={classNames(css.rightContent, css.rowCenterAlign)}>
            <div>
              <div className={css.InnerLeft}>
                <div className={css.mainCharacter}>
                  <Image
                    src={mainCharacter}
                    alt="mainCharacter"
                  />
                </div>
                <div className={css.banner}>
                  <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                    {source.banner}
                  </Typography>
                </div>
              </div>
              <div className={css.InnerLeftBottom}>
                <div className={css.onadLogo}><Image src={iconLogo} alt="iconlogo"/></div>
                <div className={css.bottomText}>
                  <Typography variant="body2" style={{ fontWeight: 600 }}>
                    {source.capationTitle}
                  </Typography>
                  <Typography variant="caption">{source.captionContent}</Typography>
                </div>
              </div>
            </div>
            <div className={css.InnerRight}>
              <div className={css.flipWrapper}>
                <div className={css.flip}>
                  {source.chatting.map(row => (
                    <div key={nanoid()} className={css.chatting}>
                      <Typography
                        variant="body2"
                        className={css.chattingText}
                        style={{ fontWeight: 600, color: `${row.color}` }}
                      >
                        {row.userName}
                      </Typography>
                      <Typography
                        variant="body2"
                        className={css.chattingText}
                        style={{ fontWeight: 600 }}
                      >
                        {row.text}
                      </Typography>
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
  )
}
