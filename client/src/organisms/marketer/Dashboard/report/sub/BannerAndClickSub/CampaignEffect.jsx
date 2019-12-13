import React from 'react';
import { Typography } from '@material-ui/core';
import Whatshot from '@material-ui/icons/Whatshot';
import CardTemplate from '../common/CardTemplate';

export default function CampaignEffect(props) {
  const { color, IconComponent } = props;

  return (
    <CardTemplate title="지표 준비중!" color={color} IconComponent={IconComponent}>
      <div
        style={{
          display: 'flex',
          height: 300,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ position: 'absolute' }}>
          <Whatshot
            color="secondary"
            fontSize="large"
            style={{ fontSize: 96, opacity: 0.6, marginRight: '5px' }}
          />
        </div>
        <div style={{ zIndex: 1 }}>
          <Typography variant="caption">
            필요한 지표가 있으시면 support@onad.io로 아이디어를 전달해주시면 감사드리겠습니다.
          </Typography>
        </div>
      </div>
    </CardTemplate>
  );
}
