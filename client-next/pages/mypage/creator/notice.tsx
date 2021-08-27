import { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useMediaQuery } from '@material-ui/core';
import { useRouter } from 'next/router';
import CircularProgress from '../../../atoms/progress/circularProgress';
import GridItem from '../../../atoms/grid/gridItem';
import GridContainer from '../../../atoms/grid/gridContainer';
import NoticeTable from '../../../components/mypage/shared/notice/noticeTable';
import NoticeTableMobile from '../../../components/mypage/shared/notice/noticeTableMobile';
import NoticeContents from '../../../components/mypage/shared/notice/noticeContents';
import { NoticeData, useNoticeList } from '../../../utils/hooks/query/useNoticeList';
import DashboardLayout from '../../../components/mypage/layouts/creatorDashboardLayout';

const useStyles = makeStyles(() => ({
  contentBox: { maxWidth: 1200, margin: '0 auto' },
}));

export default function PublicNoticeList(): JSX.Element {
  const classes = useStyles();
  const isDesktopWidth = useMediaQuery('(min-width:990px)');
  // 공지사항 데이터 요청
  const notice = useNoticeList();
  const router = useRouter();

  // 공지사항 선택 스테이트
  const [selectedNotice, setSelectedNotice] = useState<NoticeData>();

  function handleNoticeSelect(_notice: NoticeData): void {
    setSelectedNotice(_notice);
  }

  useEffect(() => {
    const mainPanel = document.getElementById('onad-main-panel');
    if (mainPanel) {
      mainPanel.scroll({ top: 0, behavior: 'smooth' });
    }
    if (router.query && router.query.selectedNotice && notice.data) {
      // 대시보드로부터 선택된 공지사항 찾기
      const targetNoti = notice.data.find(
        noti => Number(noti.code) === Number(router.query.selectedNotice),
      );
      // 선택된 공지사항이 없고, 대시보드로부터 선택된 공지사항이 있는 경우
      if (!selectedNotice && targetNoti) handleNoticeSelect(targetNoti);
    }
  }, [router.query, notice.data, selectedNotice]);

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
                selectedNotice={selectedNotice}
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

PublicNoticeList.layout = DashboardLayout;
