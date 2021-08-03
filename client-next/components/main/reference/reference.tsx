// material-UI
import { Grid } from '@material-ui/core';
// 내부 소스
// 프로젝트 내부 모듈
import { nanoid } from 'nanoid';
import Image from 'next/image';
import urlsource from '../../../source/clientMainSource';
// 컴포넌트
// util 계열
// 스타일
import useStyles from '../../../styles/main/reference/reference.style';

function Reference(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
        direction="row"
        justifyContent="center"
        alignItems="center"
        className={classes.wrapper}
      >
        {urlsource.Reference.map(element => (
          <Grid item key={nanoid()} className={classes.ImageSelector}>
            <div className={classes.image}>
              <Image src={element.imageUrl} alt="clientImage" layout="fill" />
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Reference;
