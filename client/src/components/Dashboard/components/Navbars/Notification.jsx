import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Divider } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function Notification(props) {
  const { anchorEl, handleMenuClose } = props;
  return (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
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
      <MenuItem
        onClick={() => { window.open('https://forms.gle/BTXTpvEpQJWfgPDz5'); handleMenuClose(); }}
        style={{
          maxWidth: 420,
          borderBottom: '1px solid',
          marginBottom: 10
        }}
      >
        <div>
          <Typography variant="h5" gutterBottom noWrap>
                  # 클로즈 베타 테스트 종료 안내
          </Typography>
          <Typography variant="subtitle2" gutterBottom noWrap>
                  19-08-30 / onad 개발자
          </Typography>
          <Divider style={{ marginBottom: 10 }} />
          <div>
            <Typography variant="body2" gutterBottom noWrap>
              금일 19-08-30 18:00 를 기점으로 1차 클로즈베타가 종료됩니다.
            </Typography>
            <Typography variant="body2" gutterBottom noWrap>
              금일 18시까지 적립된 금액을 기준으로 정산이 될 예정입니다.
            </Typography>
            <Typography variant="body2" gutterBottom noWrap>
              정산금의 지급은  온애드 서비스 이용에 관한 미흡하였던 부분과
            </Typography>
            <Typography variant="body2" gutterBottom noWrap>
            개선점들에 대한 설문이 완료됨을 확인한 이후,
            </Typography>
            <Typography variant="body2" gutterBottom noWrap>
              19-09-15 이내로 지급됩니다.
            </Typography>
            <Typography variant="body2" gutterBottom noWrap>
              여러분의 피드백을 받아 더욱더 발전한 모습으로
            </Typography>
            <Typography variant="body2" gutterBottom noWrap>
              10월 중으로 2차 테스트로 찾아 뵙도록 하겠습니다.
            </Typography>
            <Typography variant="body2" gutterBottom noWrap>
              크리에이터와 함께 성장하는 온애드🧞가 되겠습니다.
            </Typography>
            <Typography variant="body2" gutterBottom noWrap style={{ fontWeight: 'bold' }}>
              해당 공지를 클릭하면 설문조사를 진행할 수 있습니다.😀
            </Typography>
          </div>
        </div>
      </MenuItem>
      <MenuItem onClick={handleMenuClose} style={{ maxWidth: 420 }}>
        <div>
          <Typography variant="h5" gutterBottom noWrap>
                  # 오류 관련 공지
          </Typography>
          <Typography variant="subtitle2" gutterBottom noWrap>
                  19-08-16 17시 / onad 개발자
          </Typography>
          <Divider style={{ marginBottom: 10 }} />
          <div>
            <Typography variant="body2" gutterBottom noWrap>
                  서버 및 DB 관련 문제로 인해
            </Typography>
            <Typography variant="body2" gutterBottom noWrap>
                  19-08-16 00:00 ~ 19-08-16 09:40 까지
            </Typography>
            <Typography variant="body2" gutterBottom noWrap>
                  수익금이 올바르게 입력되지 않는 현상이 발견되었습니다.
            </Typography>
            <Typography variant="body2" gutterBottom noWrap>
                  현재 수익금 데이터 모두 복구 하였습니다.
            </Typography>
            <Typography variant="body2" gutterBottom noWrap>
                  빠른 피드백 너무나 감사드립니다!
            </Typography>
            <Typography variant="body2" gutterBottom noWrap>
                  불편을 드려 대단히 죄송합니다.
            </Typography>
          </div>
        </div>
      </MenuItem>
    </Menu>
  );
}

Notification.propTypes = {
  anchorEl: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  handleMenuClose: PropTypes.func.isRequired,
};

Notification.defaultProps = {
  anchorEl: '',
};
