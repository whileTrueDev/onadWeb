import moment from 'moment';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemSecondaryAction,
  makeStyles,
  CircularProgress,
} from '@material-ui/core';
import React from 'react';
import { Alert } from '@material-ui/lab';
import GreenRadio from '../../../../../atoms/Radio/GreenRadio';
import StyledItemText from '../../../../../atoms/StyledItemText';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import { Merchandise } from '../../adManage/interface';
import Button from '../../../../../atoms/CustomButtons/Button';
import { CampaignCreateAction, CampaignCreateInterface } from '../reducers/campaignCreate.reducer';

const useStyles = makeStyles(theme => ({
  merchandiseList: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: theme.palette.background.paper,
    maxHeight: 300,
    overflow: 'auto',
    marginBottom: theme.spacing(2),
  },
}));

export interface SelectMerchandiseProps {
  merchandiseData: UseGetRequestObject<Merchandise[]>;
  state: CampaignCreateInterface;
  dispatch: React.Dispatch<CampaignCreateAction>;
  handleDialogOpen: () => void;
}

export default function SelectMerchandise({
  merchandiseData,
  state,
  dispatch,
  handleDialogOpen,
}: SelectMerchandiseProps): JSX.Element {
  const classes = useStyles();

  return (
    <div>
      <StyledItemText
        primary="판매 상품 선택하기"
        secondary={
          <div>
            <Typography variant="body2" color="textSecondary">
              선택된 상품은 온애드샵에서 판매됩니다.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              다른 캠페인에 연결되지 않은 상품만 표시됩니다.
              <Typography component="span" color="error" variant="body2">
                {' (상품은 1개의 캠페인에만 연결될 수 있습니다.)'}
              </Typography>
            </Typography>
          </div>
        }
        // className={classes.label}
      />

      <div>
        {merchandiseData.loading && (
          <div style={{ padding: 72 }}>
            <CircularProgress />
          </div>
        )}
        {!merchandiseData.loading && merchandiseData.data && merchandiseData.data.length > 0 && (
          <List className={classes.merchandiseList}>
            {merchandiseData.data.map(merchandise => (
              <ListItem
                key={merchandise.id}
                button
                selected={String(merchandise.id) === String(state.selectedMerchandiseId)}
                onClick={(): void => {
                  dispatch({ type: 'SET_MERCHANDISE', value: merchandise.id });
                }}
              >
                <ListItemText
                  primary={merchandise.name}
                  secondary={`등록일: ${moment(merchandise.createDate).format(
                    'YYYY년 MM월 DD일 HH:mm:ss',
                  )}`}
                />
                <ListItemSecondaryAction>
                  <GreenRadio
                    edge="end"
                    checked={String(merchandise.id) === String(state.selectedMerchandiseId)}
                    onChange={(): void => {
                      dispatch({ type: 'SET_MERCHANDISE', value: merchandise.id });
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
        {!merchandiseData.loading && merchandiseData.data && merchandiseData.data.length === 0 && (
          <Alert severity="warning">
            <Typography variant="body2">선택할 수 있는 상품이 없어요..</Typography>
            <Typography variant="body2">새로운 상품을 등록하세요!</Typography>
          </Alert>
        )}
      </div>

      <div>
        <StyledItemText>새로운 상품을 등록하고 싶으신가요?</StyledItemText>
        {/* 새 상품 등록 다이얼로그 오픈 */}
        <Button onClick={handleDialogOpen} color="primary">
          + 새 상품 등록하기
        </Button>
      </div>
    </div>
  );
}
