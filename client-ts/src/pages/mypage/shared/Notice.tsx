import { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useMediaQuery } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import CircularProgress from '../../../atoms/Progress/CircularProgress';
import GridItem from '../../../atoms/Grid/GridItem';
import GridContainer from '../../../atoms/Grid/GridContainer';
import NoticeTable from '../../../organisms/mypage/shared/notice/NoticeTable';
import NoticeTableMobile from '../../../organisms/mypage/shared/notice/NoticeTableMobile';
import NoticeContents from '../../../organisms/mypage/shared/notice/NoticeContents';
import { NoticeData, useNoticeList } from '../../../utils/hooks/query/useNoticeList';

const useStyles = makeStyles(() => ({
  contentBox: { maxWidth: 1200, margin: '0 auto' },
}));

export default function PublicNoticeList(): JSX.Element {
  const classes = useStyles();
  const isDesktopWidth = useMediaQuery('(min-width:990px)');
  // 공지사항 데이터 요청
  const notice = useNoticeList();

  // 공지사항 선택 스테이트
  const [selectedNotice, setSelectedNotice] = useState<NoticeData>();
  function handleNoticeSelect(_notice: NoticeData): void {
    setSelectedNotice(_notice);
  }
  // 특정 공지사항으로의 history push 처리
  const location = useLocation<{ selectedNotice: string }>();

  const mainPanel = document.getElementById('onad-main-panel');
  useEffect(() => {
    if (mainPanel) {
      mainPanel.scroll({ top: 0, behavior: 'smooth' });
    }

    if (location.state && location.state.selectedNotice && notice.data) {
      // 대시보드로부터 선택된 공지사항 찾기
      const targetNoti = notice.data.find(noti => noti.code === location.state.selectedNotice);
      // 선택된 공지사항이 없고, 대시보드로부터 선택된 공지사항이 있는 경우
      if (!selectedNotice && targetNoti) handleNoticeSelect(targetNoti);
    }
  }, [location.state, mainPanel, notice.data, selectedNotice]);

  return (
    <div className={classes.contentBox}>
      <GridContainer>
        <GridItem xs={12}>
          {isDesktopWidth ? (
            <div>
              {selectedNotice && <NoticeContents selectedNotice={selectedNotice} />}
              <NoticeTable
                data={notice.data || []}
                loading={notice.isLoading}
                onNoticeClick={handleNoticeSelect}
              />
            </div>
          ) : (
            <div>
              {notice.isLoading && <CircularProgress small />}
              {!notice.isLoading && notice.data && <NoticeTableMobile data={notice.data} />}
            </div>
          )}
        </GridItem>
      </GridContainer>
    </div>
  );
}
