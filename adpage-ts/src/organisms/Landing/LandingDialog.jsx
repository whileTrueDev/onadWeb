import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Flag from '@material-ui/icons/Flag';
import ReDo from '@material-ui/icons/Redo';
// own function
import { Typography } from '@material-ui/core';
import setNumberFormat from '../../utils/lib/setNumberFormat';
import isVideo from '../../utils/lib/isVideo';
import VideoBanner from '../../atoms/Banner/VideoBanner';

const useStyles = makeStyles(theme => ({
  content: {
    padding: '0',
    '&:first-child': {
      padding: '0',
    }
  },
  imageWrapper: {
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  },
  image: {
    width: 300,
    height: 150,
    maxWidth: theme.breakpoints.width('sm'),
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%'
    },
    '&:hover': {
      opacity: 0.8
    }
  },
  description: {
    maxWidth: theme.breakpoints.width('sm'),
    padding: 15,
  },
  descriptionIcons: {
    fontWeight: 'bold'
  },
  flagicon: {
    color: theme.palette.primary.light
  },
  redirecticon: {
    color: theme.palette.warning.main
  },
  button: {
    color: theme.palette.common.white
  },
  paper: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0
    }
  },
  link: {
    textDecoration: 'underline',
    marginLeft: 10,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'none'
    }
  }
}));

export default function LandingDialog(props) {
  const {
    open, handleClose, data, handleTransferClick, indexOfThisData
  } = props;
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      classes={{
        paper: classes.paper
      }}
    >
      {/* dialog wrapper */}
      <DialogContent
        classes={{
          root: classes.content
        }}
      >
        {/* title */}
        <DialogTitle disableTypography style={{ borderBottom: '1px solid #ddd' }}>
          <Typography variant="h6">{data.marketerName}</Typography>
        </DialogTitle>

        {/* banner Image */}
        <div style={{ textAlign: 'center' }}>
          <ButtonBase
            className={classes.imageWrapper}
            onClick={() => {
              // primary 링크를 찾아 인덱스전달.
              handleTransferClick(indexOfThisData,
                data.links.links[
                  data.links.links.findIndex(link => link.primary === true)
                ].linkTo);
            }}
          >
            {isVideo(data.bannerSrc) ? (
              <VideoBanner src={data.bannerSrc} alt="banner" className={classes.image} />
            ) : (
              <img src={data.bannerSrc} alt="banner" className={classes.image} />
            )}
          </ButtonBase>
        </div>

        {/* Description */}
        <div className={classes.description}>
          {/* view, transfer Count */}
          <DialogContentText className={classes.descriptionIcons}>
            <Flag className={classes.flagicon} />
            {`${setNumberFormat(data.clickCount)} 조회 `}
            <ReDo className={classes.redirecticon} />
            {`${setNumberFormat(data.transferCount)} 이동 `}
          </DialogContentText>

          {/* description1 */}
          {data.companyDescription ? (
            <DialogContentText>
              {`- ${data.companyDescription}`}
            </DialogContentText>
          ) : (
            <div style={{ height: 20 }} />
          )}

          {/* description2 */}
          {data.bannerDescription ? (
            <DialogContentText>
              {`- ${data.bannerDescription}`}
            </DialogContentText>
          ) : (
            <div style={{ height: 20 }} />
          )}

          {/* 링크들 */}
          {data.links.links.map((link, linkIndex) => {
            if (link) {
              return (
                <DialogContentText
                  color="primary"
                  key={link}
                  className={classes.link}
                  onClick={() => {
                    handleTransferClick(indexOfThisData, link.linkTo);
                  }}
                >
                  {link.linkName ? link.linkName : `링크 바로가기${linkIndex + 1}`}
                </DialogContentText>
              );
            }
            return null;
          })}

          {/* date */}
          <DialogContentText variant="body2">
            {`${data.regiDate} ~`}
          </DialogContentText>
        </div>

        <div className={classes.actions}>

          <DialogActions>
            <Button
              onClick={() => {
                handleTransferClick(indexOfThisData,
                  data.links.links[
                    data.links.links.findIndex(link => link.primary === true)
                  ].linkTo);
              }}
              color="primary"
              variant="contained"
              className={classes.button}
            >
                이동
            </Button>
            <Button
              onClick={handleClose}
              color="default"
              variant="contained"
              className={classes.button}
            >
                취소
            </Button>
          </DialogActions>
        </div>
      </DialogContent>

    </Dialog>
  );
}

LandingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  handleTransferClick: PropTypes.func.isRequired,
  indexOfThisData: PropTypes.number.isRequired
};
