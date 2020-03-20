import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useMediaQuery } from '@material-ui/core';
import CircularProgress from '../../atoms/Progress/CircularProgress';
import GridItem from '../../atoms/Grid/GridItem';
import GridContainer from '../../atoms/Grid/GridContainer';
import NoticeTable from '../../organisms/main/notice/NoticeTable';
import NoticeTableMobile from '../../organisms/main/notice/NoticeTableMobile';
import NoticeContents from '../../organisms/main/notice/NoticeContents';
import AppAppBar from '../../organisms/main/layouts/AppAppbar';
import AppFooter from '../../organisms/main/layouts/AppFooter';

import useGetRequest from '../../utils/hooks/useGetRequest';


const useStyles = makeStyles(() => ({
  root: {
    paddingTop: 70
  },
  contentBox: {
    width: 980,
    margin: '150px auto',
    minHeight: 924,
  }
}));

interface Props {
  match: { params: { code: string } };
  logout: () => void;
}

interface NoticeData {
  code: string;
  topic: string;
  title: string;
  contents: string;
  regiDate: string;
}

export default function PublicNotification({ match, logout }: Props): JSX.Element {
  const classes = useStyles();
  const { code } = match.params;
  const isDesktopWidth = useMediaQuery('(min-width:990px)');
  const noticeData = useGetRequest<null, NoticeData[]>('/notice');

  return (
    <div>
      <AppAppBar logout={logout} noButtons />

      <div className={classes.root}>

        {isDesktopWidth ? (
          <div className={classes.contentBox}>
            <GridContainer>
              <GridItem xs={12}>
                {noticeData.loading && (<CircularProgress small />)}
                {!noticeData.loading && noticeData.data && (
                  <div>
                    {!code ? (
                      <NoticeTable data={noticeData.data} />
                    )
                      : (
                        <NoticeContents
                          data={noticeData.data
                            .filter((obj) => String(obj.code) === code)[0]}
                        />
                      )}
                  </div>
                )}
              </GridItem>
            </GridContainer>
          </div>
        )
          : (
            <div>
              {noticeData.loading && (<CircularProgress small />)}
              {!noticeData.loading && noticeData.data && (
                <NoticeTableMobile data={noticeData.data} />
              )}
            </div>
          )}

        <div>
          <AppFooter />
        </div>
      </div>
    </div>
  );
}
