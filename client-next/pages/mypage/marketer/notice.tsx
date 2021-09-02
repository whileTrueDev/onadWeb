import { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useMediaQuery } from '@material-ui/core';
import CircularProgress from '../../../atoms/progress/circularProgress';
import GridItem from '../../../atoms/grid/gridItem';
import GridContainer from '../../../atoms/grid/gridContainer';
import NoticeTable from '../../../components/mypage/shared/notice/noticeTable';
import NoticeTableMobile from '../../../components/mypage/shared/notice/noticeTableMobile';
import NoticeContents from '../../../components/mypage/shared/notice/noticeContents';
import { NoticeData, useNoticeList } from '../../../utils/hooks/query/useNoticeList';
import DashboardLayout from '../../../components/mypage/layouts/marketerDashboardLayout';

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

  useEffect(() => {
    const mainPanel = document.getElementById('onad-main-panel');
    if (mainPanel) {
      mainPanel.scroll({ top: 0, behavior: 'smooth' });
    }
  }, [notice.data, selectedNotice]);

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
