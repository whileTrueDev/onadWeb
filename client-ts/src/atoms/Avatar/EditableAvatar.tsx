import React from 'react';
import classnames from 'classnames';
import {
  Avatar,
  Button,
  CircularProgress,
  makeStyles,
  Typography
} from '@material-ui/core';
import { CameraAlt } from '@material-ui/icons';
import { useDialog } from '../../utils/hooks';

const useStyles = makeStyles((theme) => ({
  avatarButton: {
    margin: theme.spacing(1, 2, 1, 0),
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  small: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  avatarBackgroundOnHover: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: '100%',
    height: '100%'
  },
  avatarBackdrop: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    visibility: 'hidden',
  },
  backdropText: {
    color: theme.palette.common.white,
  }
}));

export interface EditableAvatarProps {
  src?: string;
  small?: boolean;
  changeLoading?: boolean;
  avatarClassName?: string;
  onProfileImageChange: (e: React.FormEvent<HTMLElement>) => void;
}
export default function EditableAvatar({
  src,
  small,
  changeLoading,
  avatarClassName,
  onProfileImageChange,
}: EditableAvatarProps): JSX.Element {
  const classes = useStyles();
  // 마우스 hover 감지를 위해
  const isAvatarHover = useDialog();

  return (
    <Button
      className={classes.avatarButton}
      onMouseEnter={isAvatarHover.handleOpen}
      onMouseLeave={isAvatarHover.handleClose}
      component="label"
      onChange={onProfileImageChange}
      disabled={changeLoading}
    >
      {!changeLoading ? (
        <Avatar
          variant="circular"
          className={classnames(
            classes.avatar,
            avatarClassName,
            { [classes.small]: small }
          )}
          src={changeLoading ? '' : src}
        />
      ) : (
        <Avatar variant="circular" className={classnames(classes.avatar, avatarClassName)}>
          <CircularProgress />
        </Avatar>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png"
        tabIndex={-1}
        hidden
      />
      {isAvatarHover.open && (
        <div className={classes.avatarBackgroundOnHover} />
      )}
      {isAvatarHover.open && (
        <div
          className={classes.avatarBackdrop}
          style={{ visibility: isAvatarHover.open ? 'visible' : 'hidden' }}
        >
          <Typography variant="body2" className={classes.backdropText}>
            <CameraAlt fontSize="small" />
            <br />
            편집
          </Typography>
        </div>
      )}
    </Button>
  );
}
