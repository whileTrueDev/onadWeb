import { Button, Dialog, makeStyles, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useStyles = makeStyles(theme => ({
  image: {
    minHeight: 200,
    backgroundColor: '#929ef8',
    backgroundImage: 'url(/mypage/platformLink/channel-link.png)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  title: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  button: { height: 50, marginTop: theme.spacing(1) },
}));

export interface PlatformLinkDialogProps {
  open: boolean;
  handleOpen: () => void;
  onClose: () => void;
}
export default function PlatformLinkDialog({
  open,
  handleOpen,
  onClose,
}: PlatformLinkDialogProps): JSX.Element {
  const [alreadyOpened, setAlreadyOpened] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!alreadyOpened) {
      setAlreadyOpened(true);
      handleOpen();
    }
  }, [handleOpen, alreadyOpened, setAlreadyOpened]);

  const classes = useStyles();
  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <div className={classes.image} />
      <div className={classes.title}>
        <Typography variant="h6" color="primary">
          방송 채널을 연동하고
        </Typography>
        <Typography>온애드를 시작하세요!</Typography>

        <br />
        <Typography>온애드를 통해 광고를 진행하기 위해서</Typography>
        <Typography>채널연동을 진행하셔야 합니다.</Typography>

        <Button
          disableElevation
          variant="contained"
          color="primary"
          fullWidth
          className={classes.button}
          onClick={(): Promise<boolean> => router.push('/mypage/creator/user')}
        >
          채널 연동 하러가기
        </Button>
        <Button
          disableElevation
          variant="contained"
          color="default"
          fullWidth
          className={classes.button}
          onClick={onClose}
        >
          연동 않고 둘러보기
        </Button>
      </div>
    </Dialog>
  );
}
