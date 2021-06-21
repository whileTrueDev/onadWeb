import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid,
  CircularProgress,
  Typography,
  Divider,
  Chip,
  List,
  ListItem,
  Collapse,
  Button,
} from '@material-ui/core';
import { CheckCircle, ExpandMore } from '@material-ui/icons';
import { CampaignCreateInterface, CampaignCreateAction } from '../reducers/campaignCreate.reducer';

import useGetRequest from '../../../../../utils/hooks/useGetRequest';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    marginTop: '0px',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  formControl: { margin: theme.spacing(1), minWidth: 120, maxWidth: 300 },
  categoryTitle: {
    cursor: 'pointer',
    '&:hover': { color: theme.palette.primary.main, textDecoration: 'underline' },
  },
  categoryTitleSelected: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
  chipContainer: { marginTop: theme.spacing(1) },
  chip: { margin: theme.spacing(0.5) },
  icon: { verticalAlign: 'middle' },
  selected: { color: theme.palette.primary.main },
}));

interface AfreecaCategory {
  categoryId: string;
  categoryNameKr: string;
  isSub: boolean;
  parentCategoryId: string;
}
interface GameSelectProps {
  state: CampaignCreateInterface;
  dispatch: React.Dispatch<CampaignCreateAction>;
  handleComplete: () => void;
  handleIncomplete: () => void;
}

const GameSelectAfreeca = (props: GameSelectProps): JSX.Element => {
  const { state, dispatch, handleComplete, handleIncomplete } = props;
  const classes = useStyles();

  // **********************************************************
  // 게임데이터 로딩 및 클릭 핸들러
  const gamesData = useGetRequest<null, AfreecaCategory[]>('/games');

  function handleGameClick(game: string): void {
    if (state.selectedGames.includes(game)) {
      dispatch({ type: 'DELETE_SELECTED_GAMES', value: game });
    } else {
      dispatch({ type: 'SET_SELECTED_GAMES', value: game });
    }
  }
  // 상위 카테고리 모두 선택
  function handleParentCategoryClick(gameList: string[]): void {
    dispatch({ type: 'SET_SELECTED_GAMES_MANY', value: gameList });
  }
  // 상위 카테고리 모두 해제
  function handleParentCategoryRemove(gameList: string[]): void {
    dispatch({ type: 'DELETE_SELECTED_GAMES_MANY', value: gameList });
  }

  // **********************************************************
  // "다음" 버튼 핸들러
  useEffect(() => {
    if (state.selectedPriorityType !== 'type1-1') {
      return;
    }
    if (state.selectedGames.length >= 1) {
      handleComplete();
    } else {
      handleIncomplete();
    }
  }, [handleComplete, handleIncomplete, state.selectedGames.length, state.selectedPriorityType]);

  /**
   * 하위 카테고리가 있는지 확인하는 함수
   * @param lst 카테고리 목록
   * @param categoryId 하위 카테고리가 있는 지 확인할 카테고리
   */
  function hasChildCategory(lst: AfreecaCategory[], categoryId: string): boolean {
    return lst.findIndex(g => g.parentCategoryId === categoryId) > -1;
  }

  // 아프리카 부모카테고리 열기 상태
  const [openedCategory, setOpenedCategory] = useState('');
  function handleCategoryCollapseOpen(targetCategoryId: string): void {
    if (gamesData.data && hasChildCategory(gamesData.data, targetCategoryId)) {
      if (targetCategoryId === openedCategory) setOpenedCategory('');
      else setOpenedCategory(targetCategoryId);
    }
  }

  /**
   * 리스트A 에서 리스트B의 요소가 하나라도 포함되어있는지 확인하는 함수
   * @param listA 비교대상리스트1
   * @param listB 비교대상리스트2
   */
  function arrayIncludeCheck(listA: string[], listB: string[]): boolean {
    let includeResult = false;
    for (let i = 0; i < listA.length; i += 1) {
      if (listB.includes(listA[i])) includeResult = true;
      break;
    }
    return includeResult;
  }

  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item xs={12} lg={8} xl={6}>
        <Typography variant="h6">광고를 송출하려는 카테고리를 선택해주세요.</Typography>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        {gamesData.loading && (
          <div style={{ padding: 72, textAlign: 'center' }}>
            <CircularProgress size={100} disableShrink />
          </div>
        )}
        {!gamesData.loading && gamesData.data && (
          <Grid container spacing={2} style={{ flexWrap: 'wrap' }}>
            <List
              style={{
                maxHeight: 500,
                overflow: 'auto',
                width: 500,
                margin: '16px auto',
              }}
            >
              {gamesData.data
                .filter(cate => !cate.isSub)
                .map(
                  (game: AfreecaCategory): React.ReactNode => (
                    <ListItem key={game.categoryId}>
                      <div style={{ display: 'block' }}>
                        {/* 카테고리 타이틀 */}
                        <Typography
                          className={classnames({
                            [classes.categoryTitle]: true,
                            [classes.categoryTitleSelected]: state.selectedGames.includes(
                              game.categoryNameKr,
                            ),
                          })}
                          variant="body1"
                          component="span"
                          onClick={(): void => {
                            if (gamesData.data) {
                              if (hasChildCategory(gamesData.data, game.categoryId)) {
                                // child cateogry가 있는 경우 세부사항 오픈
                                handleCategoryCollapseOpen(game.categoryId);
                              } else {
                                // child cateogry가 없는 경우 카테고리 선택
                                handleGameClick(game.categoryNameKr);
                              }
                            }
                          }}
                        >
                          {game.categoryNameKr}

                          {state.selectedGames.includes(game.categoryNameKr) && (
                            <CheckCircle
                              color="primary"
                              fontSize="small"
                              className={classes.icon}
                            />
                          )}

                          {gamesData.data && hasChildCategory(gamesData.data, game.categoryId) && (
                            <ExpandMore fontSize="small" className={classes.icon} />
                          )}
                        </Typography>

                        {/* 모두선택 / 모두해제 버튼 */}
                        {gamesData.data && hasChildCategory(gamesData.data, game.categoryId) && (
                          <>
                            {/* 모두 선택 */}
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={(): void => {
                                if (gamesData.data) {
                                  if (openedCategory !== game.categoryId) {
                                    // 방금 선택한 카테고리 collapse가 안열려 있다면 열기
                                    handleCategoryCollapseOpen(game.categoryId);
                                  }
                                  const targetGameList = gamesData.data
                                    .filter(cate => cate.parentCategoryId === game.categoryId)
                                    .map(cate => cate.categoryNameKr);
                                  handleParentCategoryClick(targetGameList);
                                }
                              }}
                            >
                              모두선택
                            </Button>

                            {/* 모두 해제 */}
                            {arrayIncludeCheck(
                              state.selectedGames,
                              gamesData.data
                                .filter(cate => cate.parentCategoryId === game.categoryId)
                                .map(cate => cate.categoryNameKr),
                            ) && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={(): void => {
                                  if (gamesData.data) {
                                    handleParentCategoryRemove(
                                      gamesData.data
                                        .filter(cate => cate.parentCategoryId === game.categoryId)
                                        .map(cate => cate.categoryNameKr),
                                    );
                                  }
                                }}
                              >
                                모두해제
                              </Button>
                            )}
                          </>
                        )}
                        <div>
                          <Collapse in={openedCategory === game.categoryId}>
                            <div className={classes.chipContainer}>
                              {gamesData.data &&
                                gamesData.data
                                  .filter(cate => cate.parentCategoryId === game.categoryId)
                                  .map(cate => (
                                    <Chip
                                      className={classes.chip}
                                      clickable
                                      icon={
                                        state.selectedGames.includes(cate.categoryNameKr) ? (
                                          <CheckCircle />
                                        ) : (
                                          undefined
                                        )
                                      }
                                      onClick={(): void => {
                                        handleGameClick(cate.categoryNameKr);
                                      }}
                                      color={
                                        state.selectedGames.includes(cate.categoryNameKr)
                                          ? 'primary'
                                          : 'default'
                                      }
                                      label={cate.categoryNameKr}
                                      key={cate.categoryId}
                                    />
                                  ))}
                            </div>
                          </Collapse>
                        </div>
                      </div>
                    </ListItem>
                  ),
                )}
            </List>
          </Grid>
        )}

        {state.selectedGames.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6">선택된 카테고리</Typography>
            <div style={{ padding: 16 }}>
              {state.selectedGames.map(game => (
                <Chip
                  key={`selected_${game}`}
                  label={game}
                  color="primary"
                  variant="outlined"
                  onDelete={(): void => {
                    handleGameClick(game);
                  }}
                  style={{ margin: 4 }}
                />
              ))}
            </div>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default GameSelectAfreeca;
