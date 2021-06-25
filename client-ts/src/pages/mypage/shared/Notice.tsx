import { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useMediaQuery } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import CircularProgress from '../../../atoms/Progress/CircularProgress';
import GridItem from '../../../atoms/Grid/GridItem';
import GridContainer from '../../../atoms/Grid/GridContainer';
import NoticeTable, { NoticeData } from '../../../organisms/mypage/shared/notice/NoticeTable';
import NoticeTableMobile from '../../../organisms/mypage/shared/notice/NoticeTableMobile';
import NoticeContents from '../../../organisms/mypage/shared/notice/NoticeContents';

import useGetRequest from '../../../utils/hooks/useGetRequest';

const useStyles = makeStyles(() => ({
  contentBox: { maxWidth: 1200, margin: '0 auto' },
}));

export default function PublicNotification(): JSX.Element {
  const classes = useStyles();
  const isDesktopWidth = useMediaQuery('(min-width:990px)');
  // 공지사항 데이터 요청
  const noticeData = useGetRequest<null, NoticeData[]>('/notice');

  // 공지사항 선택 스테이트
  const [selectedNotice, setSelectedNotice] = useState<NoticeData>();
  function handleNoticeSelect(notice: NoticeData): void {
    setSelectedNotice(notice);
  }
  // 특정 공지사항으로의 history push 처리
  const location = useLocation<{ selectedNotice: string }>();

  const mainPanel = document.getElementById('onad-main-panel');
  useEffect(() => {
    if (mainPanel) {
      mainPanel.scroll({ top: 0, behavior: 'smooth' });
    }

    if (location.state && location.state.selectedNotice && noticeData.data) {
      // 대시보드로부터 선택된 공지사항 찾기
      const targetNoti = noticeData.data.find(noti => noti.code === location.state.selectedNotice);
      // 선택된 공지사항이 없고, 대시보드로부터 선택된 공지사항이 있는 경우
      if (!selectedNotice && targetNoti) handleNoticeSelect(targetNoti);
    }
  }, [location.state, mainPanel, noticeData.data, selectedNotice]);

  return (
    <div className={classes.contentBox}>
      <GridContainer>
        <GridItem xs={12}>
          {isDesktopWidth ? (
            <div>
              {selectedNotice && <NoticeContents selectedNotice={selectedNotice} />}
              <NoticeTable
                data={noticeData.data || []}
                loading={noticeData.loading}
                onNoticeClick={handleNoticeSelect}
              />
            </div>
          ) : (
            <div>
              {noticeData.loading && <CircularProgress small />}
              {!noticeData.loading && noticeData.data && (
                <NoticeTableMobile data={noticeData.data} />
              )}
            </div>
          )}
        </GridItem>
      </GridContainer>
    </div>
  );
}
