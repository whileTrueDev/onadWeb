import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Divider
} from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import HOST from '../../../../config';
import axios from '../../../../utils/axios';

function Notification(props) {
  const {
    anchorEl, handleMenuClose, notificationData,
  } = props;

  const updateReadState = (index) => {
    axios.post(`${HOST}/api/dashboard/creator/notification/readState`, { index })
      .then().catch('에러삐삑');
  };
  return (

    <Menu
      elevation={0}
      // anchorOrigin={{
      //   vertical: 'bottom',
      //   horizontal: 'right',
      // }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id="simple-menu"
      keepMounted
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      {/* 공지 메뉴 컴포넌트 */}
      { !notificationData.loading && !notificationData.error
        && (

        <div>
          {notificationData.payload.map(noti => (
            <MenuItem
              key={noti.index}
              style={{
                width: 420,
                borderBottom: '1px solid',
                marginBottom: 10
              }}
            >

              <details style={{
                width: '100%'
              }}
              >
                <summary
                  role="button"
                  tabIndex="-1"
                  // onClick={() => updateReadState(noti.index)}
                  onKeyDown={() => updateReadState(noti.index)}
                >
                  <Typography variant="h5" gutterBottom noWrap>
                    <p>{noti.title}</p>
                  </Typography>
                  <Typography align="right" variant="subtitle2" gutterBottom noWrap>
                    <span>{noti.dateform}</span>
                    {' '}
                      / ONAD
                  </Typography>
                </summary>
                <Divider style={{ marginBottom: 10 }} />
                <Typography variant="body2" gutterBottom noWrap>
                  <span style={{
                    whiteSpace: 'pre-line'
                  }}
                  >
                    {noti.content}
                  </span>
                </Typography>
              </details>

            </MenuItem>

          ))}
        </div>

        )
    }

    </Menu>
  );
}

Notification.propTypes = {
  anchorEl: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  handleMenuClose: PropTypes.func.isRequired,
  notificationData: PropTypes.object.isRequired,
};

Notification.defaultProps = {
  anchorEl: '',
};

export default Notification;
