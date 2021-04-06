import {
  Chip, FormControlLabel, Switch, Table, TableBody, TableCell, TableHead, TableRow,
  Tooltip, Typography
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { OpenInNew } from '@material-ui/icons';
import React from 'react';
import shortid from 'shortid';
import OnadBanner from '../../../../atoms/Banner/OnadBanner';
import Snackbar from '../../../../atoms/Snackbar/Snackbar';
import useDialog from '../../../../utils/hooks/useDialog';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import usePatchRequest from '../../../../utils/hooks/usePatchRequest';
import { CPS_OPTION_TYPE } from '../../../../utils/render_funcs/renderOptionType';
import renderPriorityType from '../../../../utils/render_funcs/renderPriorityType';


const useStyles = makeStyles((theme) => ({
  bold: { fontWeight: 'bold' },
  th: {
    flexDirection: 'column',
    textAlign: 'center',
    width: '170px',
    padding: '5px'
  },
  chip: {
    marginBottom: theme.spacing(0, 0.5, 0.5, 0)
  },
  linkText: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}));
export interface BannerStatus {
  optionType: 1 | 3; // 1 = LIVE배너광고, 3 = 판매형광고
  campaignId: string; index: number;
  marketerName: string; priorityType: number;
  targetList: string[]; date: string; bannerSrc: string;
  state: number; campaignDescription: string;
  creatorName: string;
  merchandiseId?: string;
  merchandiseName?: string;
  merchandisePrice?: number;
  itemSiteUrl?: string;
}

interface RemotePageBannerTableProps {
  pageUrl: string;
}

interface Params {
  remoteControllerUrl: string;
}
const RemotePageBannerTable = (props: RemotePageBannerTableProps): JSX.Element => {
  const {
    pageUrl
  } = props;
  const classes = useStyles();
  const snack = useDialog();
  const failSnack = useDialog();
  const remoteCampaignTableGet = useGetRequest<Params, BannerStatus[]>(
    '/creator/remote/campaigns', { remoteControllerUrl: pageUrl }
  );

  const onOffUpdate = usePatchRequest('/creator/remote/onoff', () => {
    remoteCampaignTableGet.doGetRequest();
  });

  const handleSwitch = (campaignId: string, state: number, url: string): void => {
    onOffUpdate.doPatchRequest({ campaignId, state, url })
      .then(() => snack.handleOpen())
      .catch(() => failSnack.handleOpen());
  };

  const page = 1; // 테이블 페이지
  const rowsPerPage = 8; // 테이블 페이지당 행

  const emptyRows = !remoteCampaignTableGet.loading
    && remoteCampaignTableGet.data && (rowsPerPage - Math.min(
    rowsPerPage, remoteCampaignTableGet.data.length - page * rowsPerPage,
  ));

  const categorySwitch = (
    category: number, targetList: string[], creatorName: string
  ): JSX.Element => {
    switch (category) {
      case 0: return (
        <TableCell>
          <Chip
            className={classes.chip}
            size="small"
            label={renderPriorityType(category)}
          />
          <Typography variant="body2">
            <span style={{ fontWeight: 'bold' }}>
              {creatorName}
            </span>
            님과 매칭된 광고입니다.
          </Typography>
        </TableCell>
      );
      case 1: return (
        <TableCell>
          <Chip
            className={classes.chip}
            color="primary"
            size="small"
            label={renderPriorityType(category)}
          />
          <Typography variant="body2">
            {targetList.length > 20 ? (
              <Tooltip title={targetList.join(', ')}>
                <span style={{ fontWeight: 'bold' }}>
                  {`${targetList.slice(0, 20).join(', ')}...`}
                </span>
              </Tooltip>
            ) : (
              <span style={{ fontWeight: 'bold' }}>
                {targetList.join(', ')}
              </span>
            )}
            카테고리에 매칭 되는 광고입니다.
          </Typography>
        </TableCell>
      );
      case 2: return (
        <TableCell>
          <Typography variant="body2">
            자동으로 매칭되는 광고입니다.
          </Typography>
        </TableCell>
      );
      default: return (
        <TableCell>
          <Typography variant="body2">
            수익이 창출되지 않는 온애드 기본 배너입니다.
          </Typography>
        </TableCell>
      );
    }
  };
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.th}>
              시작일 / 광고주
            </TableCell>
            <TableCell className={classes.th}>
              카테고리
            </TableCell>
            <TableCell className={classes.th}>
              배너 이미지
            </TableCell>
            <TableCell className={classes.th}>
              배너 설명
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {remoteCampaignTableGet.data?.map((value: BannerStatus) => (
            <TableRow key={value.index}>
              <TableCell style={{
                flexDirection: 'column',
                textAlign: 'center',
                padding: '5px'
              }}
              >
                <Typography variant="body1">
                  {value.marketerName}
                </Typography>
                <FormControlLabel
                  label=""
                  control={(
                    <Switch
                      checked={Boolean(value.state)}
                      color="secondary"
                      onChange={(): void => {
                        handleSwitch(value.campaignId, value.state, pageUrl);
                      }}
                      disabled={Boolean(remoteCampaignTableGet.loading)}
                    />
                  )}
                />
                <Typography variant="body1">
                  {value.date.split('T')[0]}
                </Typography>
              </TableCell>

              {/* 카테고리 렌더링 */}
              {value.optionType === CPS_OPTION_TYPE
              && value.merchandiseId
                ? (
                  <TableCell>
                    <div>
                      <Chip size="small" className={classes.chip} label="판매형광고" />
                      <Chip size="small" className={classes.chip} label="10%" />
                    </div>
                    <Typography variant="body2">상품 판매 리워드형 광고입니다.</Typography>
                    {value.merchandiseName && value.itemSiteUrl && (
                      <Typography
                        className={classes.linkText}
                        variant="body2"
                        color="primary"
                        onClick={(): void => {
                          window.open(value.itemSiteUrl, '_blank');
                        }}
                      >
                        {value.merchandiseName}
                        <OpenInNew fontSize="small" color="primary" style={{ verticalAlign: 'middle' }} />
                      </Typography>
                    )}
                    {value.merchandisePrice ? (
                      <div>
                        <Typography variant="body2">
                          {'상품가격: '}
                          <Typography variant="body2" component="span" className={classes.bold}>
                            {value.merchandisePrice.toLocaleString()}
                          </Typography>
                        </Typography>
                        <Typography variant="body2">
                          {'판매수익: '}
                          <Typography variant="body2" component="span" className={classes.bold}>
                            {Math.ceil(value.merchandisePrice * 0.1).toLocaleString()}
                          </Typography>
                        </Typography>
                      </div>
                    ) : null}
                  </TableCell>
                )
                : categorySwitch(value.priorityType, value.targetList, value.creatorName)}

              <TableCell>
                <div>
                  <OnadBanner src={value.bannerSrc} style={{ maxHeight: '75px', width: '150px' }} />
                </div>
              </TableCell>
              <TableCell>
                {value.campaignDescription}
              </TableCell>
            </TableRow>
          ))}
          {emptyRows && emptyRows > 0 && (
          <TableRow style={{ height: 48 * emptyRows }} key={shortid.generate()}>
            <TableCell colSpan={4} />
          </TableRow>
          )}
        </TableBody>
        {remoteCampaignTableGet.loading && (
        <TableCell
          align="center"
          colSpan={4}
        >
          <CircularProgress />
        </TableCell>
        )}
      </Table>

      <Snackbar
        color="success"
        open={snack.open}
        message="정상적으로 변경 되었습니다."
        onClose={snack.handleClose}
      />

      <Snackbar
        color="error"
        open={failSnack.open}
        message="변경 중 오류가 발생 했습니다."
        onClose={failSnack.handleClose}
      />
    </div>
  );
};

export default RemotePageBannerTable;
