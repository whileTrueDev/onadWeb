import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CreditCard from '@material-ui/icons/CreditCard';
import Input from '@material-ui/icons/Input';

const useStyles = makeStyles(theme => ({
  buttons: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

interface CashPopperProps {
  anchorEl: HTMLElement | null;
  handleOpen: () => void;
  handleAnchorClose: () => void;
}

export default function CashPopper(props: CashPopperProps): JSX.Element {
  const { anchorEl, handleOpen, handleAnchorClose } = props;
  const classes = useStyles();

  const POPUP_WIDTH = process.env.NODE_ENV === 'production' ? 900 : 700;
  const POPUP_HEIGHT = process.env.NODE_ENV === 'production' ? 800 : 700;
  const POPUP_X =
    process.env.NODE_ENV === 'production'
      ? window.screen.width / 2 - 450
      : window.screen.width / 2 - 350;
  const POPUP_Y =
    process.env.NODE_ENV === 'production'
      ? window.screen.height / 2 - 400
      : window.screen.height / 2 - 350;

  function handleListKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    if (event.key === 'Tab') {
      event.preventDefault();
      handleAnchorClose();
    }
  }

  return (
    <Popper
      placement="bottom"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      disablePortal
      modifiers={{
        flip: {
          enabled: true,
        },
        preventOverflow: {
          enabled: true,
          boundariesElement: 'scrollParent',
        },
      }}
      transition
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
        >
          <Paper>
            <ClickAwayListener onClickAway={handleAnchorClose}>
              <MenuList
                autoFocusItem={Boolean(anchorEl)}
                id="menu-list-grow"
                onKeyDown={handleListKeyDown}
              >
                <MenuItem
                  onClick={(): void => {
                    window.open(
                      `/mypage/marketer/charge`,
                      '_blank',
                      `width=${POPUP_WIDTH}, height=${POPUP_HEIGHT}, left=${POPUP_X}, top=${POPUP_Y}`,
                    );
                    handleAnchorClose();
                  }}
                  className={classes.buttons}
                >
                  <ListItemIcon>
                    <CreditCard />
                  </ListItemIcon>
                  전자결제
                </MenuItem>
                <MenuItem
                  onClick={(): void => {
                    handleOpen();
                    handleAnchorClose();
                  }}
                  className={classes.buttons}
                >
                  <ListItemIcon>
                    <Input />
                  </ListItemIcon>
                  무통장
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}
