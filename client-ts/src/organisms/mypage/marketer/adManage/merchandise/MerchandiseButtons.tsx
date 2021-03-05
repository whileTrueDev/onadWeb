import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
// import { useDialog } from '../../../../../utils/hooks';

const useStyles = makeStyles((theme) => ({
  container: { marginBottom: theme.spacing(1) },
}));
export default function MerchandiseButtons(): JSX.Element {
  const classes = useStyles();
  // const urlUploadDialog = useDialog();

  return (
    <div className={classes.container}>
      <Button color="primary" variant="outlined" onClick={() => { alert('상품 등록 다이얼로그'); }}>
        + 새 상품 등록
      </Button>
    </div>
  );
}
