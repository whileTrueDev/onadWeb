import classnames from 'classnames';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { OpenInNew } from '@material-ui/icons';
import React from 'react';
import { OnadTheme } from '../../../../../../../theme';
import { CreatorDataInterface, CreatorDataCPSInterface } from '../../../../dashboard/interfaces';
import ContentsPie from '../../../../shared/ContentsPie';
import TimeChart from '../../../../shared/TimeChart';

const useStyles = makeStyles((theme: OnadTheme) => ({
  flexCenter: { display: 'flex', alignItems: 'center' },
  platformLinkButton: { margin: theme.spacing(1, 1, 1, 0) },
  chartContainer: {
    maxWidth: 600,
    display: 'flex',
    overflow: 'auto',
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
  },
  chart: { width: 300 },
  twitchColor: {
    color: theme.palette.platform.twitchContrastText,
    backgroundColor: theme.palette.platform.twitch,
    '&:hover': {
      backgroundColor: theme.palette.platform.twitch,
    },
  },
  afreecaColor: {
    color: theme.palette.platform.afreecaContrastText,
    backgroundColor: theme.palette.platform.afreeca,
    '&:hover': {
      backgroundColor: theme.palette.platform.afreeca,
    },
  },
}));

export interface CreatorsReportDetailProps {
  selectedCreator: CreatorDataInterface | CreatorDataCPSInterface;
}
export default function CreatorsReportDetail({
  selectedCreator,
}: CreatorsReportDetailProps): JSX.Element {
  const classes = useStyles();
  return (
    <div>
      {selectedCreator.creatorTwitchId && (
        <Button
          size="small"
          variant="outlined"
          className={classnames(classes.twitchColor, classes.platformLinkButton)}
          onClick={(): void => {
            window.open(`https://twitch.tv/${selectedCreator.creatorTwitchId}`);
          }}
        >
          트위치 채널 가기
          <OpenInNew fontSize="small" style={{ verticalAlign: 'middle' }} />
        </Button>
      )}

      {selectedCreator.afreecaId && (
        <Button
          size="small"
          variant="outlined"
          className={classnames(classes.afreecaColor, classes.platformLinkButton)}
          onClick={(): void => {
            window.open(`http://play.afreecatv.com/${selectedCreator.afreecaId}`);
          }}
        >
          아프리카 방송국 가기
          <OpenInNew fontSize="small" style={{ verticalAlign: 'middle' }} />
        </Button>
      )}

      {(selectedCreator.contentsGraphData || selectedCreator.contentsGraphDataAfreeca) && (
        <div className={classes.chartContainer}>
          {!selectedCreator.contentsGraphData &&
          !selectedCreator.contentsGraphDataAfreeca &&
          !selectedCreator.timeGraphData &&
          !selectedCreator.timeGraphDataAfreeca ? (
            <Typography variant="body2">해당 방송인은 아직 분석된 정보가 없습니다.</Typography>
          ) : (
            <>
              <div className={classes.chart}>
                {/* 방송 카테고리 파이차트 */}
                {selectedCreator.contentsGraphData && (
                  <ContentsPie selectedChartData={JSON.parse(selectedCreator.contentsGraphData)} />
                )}
                {!selectedCreator.contentsGraphData && selectedCreator.contentsGraphDataAfreeca && (
                  <ContentsPie
                    selectedChartData={JSON.parse(selectedCreator.contentsGraphDataAfreeca)}
                  />
                )}
                <Typography align="center" variant="body1">
                  방송 컨텐츠
                </Typography>
              </div>
              {/* 방송 시간대 바차트 */}
              <div className={classes.chart}>
                {selectedCreator.timeGraphData && (
                  <TimeChart selectedChartData={JSON.parse(selectedCreator.timeGraphData)} />
                )}
                {!selectedCreator.timeGraphData && selectedCreator.timeGraphDataAfreeca && (
                  <TimeChart selectedChartData={JSON.parse(selectedCreator.timeGraphDataAfreeca)} />
                )}
                <Typography align="center" variant="body1">
                  주 방송 시간
                </Typography>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
