import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  itmeTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 100,
    backgroundColor: theme.palette.success.main,
    padding: 32,
    color: theme.palette.getContrastText(theme.palette.success.dark)
  }
}));

interface AdDescriptionDialogProps {
  open: boolean; onClose: () => void;

}
export default function AdDescriptionDialog(props: AdDescriptionDialogProps): JSX.Element {
  const { open, onClose } = props;
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      {/* 광고 상품 이름 및 광고 구성 선택  */}

      <div style={{
        padding: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
      >
        제목 + 보고싶은 광고 구성 선택
        <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
          <div>1 뭐시기</div>
          <div>2 뭐시기</div>
          <div>3 뭐시기</div>
        </div>
      </div>


      {/* 선택된 구성 타이틀 */}
      <div className={classes.itmeTitle}>
        <Typography variant="h6" style={{ padding: 16, fontWeight: 700, }}>배너광고</Typography>
        <Typography variant="body2">배너광고 설명배너광고 설명배너광고 설명배너광고 설명배너광고 설명</Typography>
      </div>

      {/* 이미지 및 설명 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 32
      }}
      >
        <div style={{ padding: 16, textAlign: 'center' }}>
          <Typography variant="h6">모바일 화면</Typography>
          <img height={500} src="/pngs/dashboard/ad_desc/모바일배너.png" alt="logo" />
        </div>
        <div style={{ padding: 16, textAlign: 'center' }}>
          <Typography variant="h6">피시 화면</Typography>
          <img height={500} src="/pngs/dashboard/ad_desc/피시배너.png" alt="logo" />
        </div>
      </div>
    </Dialog>
  );
}
