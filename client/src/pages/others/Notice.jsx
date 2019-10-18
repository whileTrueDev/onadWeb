import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useMediaQuery } from '@material-ui/core';
import CircularProgress from '../../atoms/Progress/CircularProgress';

import GridItem from '../../atoms/Grid/GridItem';
import GridContainer from '../../atoms/Grid/GridContainer';
import NoticeTable from '../../organisms/main/Notice/NoticeTable';
import NoticeTableMobile from '../../organisms/main/Notice/NoticeTableMobile';
import NoticeContents from '../../organisms/main/Notice/NoticeContents';
import AppAppBar from '../../organisms/main/layout/AppAppBar';
import AppFooter from '../../organisms/main/layout/AppFooter';

import useFetchData from '../../utils/lib/hooks/useFetchData';


const useStyles = makeStyles(() => ({
  root: {
    marginTop: 70
  },
  contentBox: {
    width: 980,
    margin: '150px auto',
    minHeight: 924,
  }
}));

export default function PublicNotification(props) {
  const classes = useStyles();
  const { match } = props;
  const { code } = match.params;
  const isDesktopWidth = useMediaQuery('(min-width:990px)');
  const noticeData = useFetchData('/api/dashboard/notice');

  return (
    <div>
      <AppAppBar noButtons />

      <div className={classes.root}>

        {isDesktopWidth ? (
          <div className={classes.contentBox}>
            <GridContainer>
              <GridItem xs={12}>
                {noticeData.loading && (<CircularProgress small />)}
                {!noticeData.loading && noticeData.payload && (
                <div>
                  {!code ? (
                    <NoticeTable data={noticeData.payload} />
                  ) : (
                    <NoticeContents
                      data={noticeData.payload
                        .filter(obj => String(obj.code) === code)[0]}
                    />
                  )}
                </div>
                )}
              </GridItem>
            </GridContainer>
          </div>
        ) : (
          <div>
            {noticeData.loading && (<CircularProgress small />)}
            {!noticeData.loading && noticeData.payload && (
              <NoticeTableMobile data={noticeData.payload} />
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

PublicNotification.propTypes = {
  match: PropTypes.object.isRequired
};
