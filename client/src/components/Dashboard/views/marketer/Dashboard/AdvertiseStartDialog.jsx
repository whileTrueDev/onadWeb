import React, { useState, useEffect, useCallback } from 'react';
import shortId from 'shortid';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import axios from '../../../../../utils/axios';
// custom components
import Dialog from '../../../components/Dialog/Dialog';
import Button from '../../../components/CustomButtons/Button';
import HOST from '../../../../../config';
// 상수
const CONFIRMED_BANNER_STATE = 1; // 승인됨 배너 스테이트
const STARTED_BANNER_STATE = 3; // 광고중 배너 스테이트

function useConfirmDialog() {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  function handleConfirmDialogOpen() {
    setConfirmDialogOpen(true);
  }

  function handleConfirmDialogClose() {
    setConfirmDialogOpen(false);
  }

  return { confirmDialogOpen, handleConfirmDialogClose, handleConfirmDialogOpen };
}

function useFetchCreatorData(selectedBanner, tableData) {
  const [creatorData, setCreatorData] = useState();
  const callUrl = useCallback(async () => {
    const url = `${HOST}/api/dashboard/marketer/contraction/creatorList`;
    const { bannerId } = selectedBanner;
    try {
      const res = await axios.get(url, { params: { bannerId } });
      if (res.data.length > 0) {
        setCreatorData(res.data);
      } else {
        const creators = [];
        tableData.map((data) => {
          creators.push(data[0]);
          return null;
        });
        setCreatorData(creators);
      }
    } catch {
      setCreatorData([]);
    }
  }, [selectedBanner, tableData]);

  useEffect(() => {
    if (selectedBanner.confirmState === CONFIRMED_BANNER_STATE) {
      callUrl();
    }
  }, [callUrl, selectedBanner.confirmState]);

  return { creatorData };
}

function AdvertiseStartDialog(props) {
  const {
    open, marketerDebit, onClose, selectedBanner, tableData, history,
  } = props;

  const {
    confirmDialogOpen, handleConfirmDialogClose, handleConfirmDialogOpen,
  } = useConfirmDialog();

  // 중단된 배너일 시, 이전에 계약했던 크리에이터 목록을 가져온다.
  const { creatorData } = useFetchCreatorData(selectedBanner, tableData);

  // 해당 배너 광고 시작 버튼 클릭 시
  async function handleClick() {
    // 광고중인 배너가 아닌 경우
    if (selectedBanner.confirmState === CONFIRMED_BANNER_STATE) {
      // matchedBanner에, 해당 배너와 크리에이터들의 연결을 저장 DONE
      // bannerRegistered에, 배너 state를 3 으로 수정. (광고 중)

      const creators = [];
      tableData.map((data) => {
        creators.push(data[0]);
        return null;
      });

      const matchedBannerUrl = `${HOST}/api/dashboard/marketer/bannerStart`;
      const matchedBannerData = { bannerId: selectedBanner.bannerId, creators };
      await axios.post(matchedBannerUrl, matchedBannerData)
        .catch((err) => {
          console.log(err);
        });

      const bannerRegisteredUrl = `${HOST}/api/dashboard/marketer/bannerStartStateChange`;
      const bannerRegisteredData = { bannerId: selectedBanner.bannerId };
      await axios.post(bannerRegisteredUrl, bannerRegisteredData)
        .catch((err) => {
          console.log(err);
        });
    } else if (selectedBanner.confirmState === STARTED_BANNER_STATE) {
      // 광고중인 배너인 경우

      const creators = [];
      tableData.map((data) => {
        creators.push(data[0]);
        return null;
      });

      const matchedBannerUrl = `${HOST}/api/dashboard/marketer/bannerStop`;
      const matchedBannerData = { bannerId: selectedBanner.bannerId, creators };
      await axios.post(matchedBannerUrl, matchedBannerData)
        .catch((err) => {
          console.log(err);
        });

      const bannerRegisteredUrl = `${HOST}/api/dashboard/marketer/bannerStopStateChange`;
      const bannerRegisteredData = { bannerId: selectedBanner.bannerId };
      await axios.post(bannerRegisteredUrl, bannerRegisteredData)
        .catch((err) => {
          console.log(err);
        });
    }
    history.push('/dashboard/marketer/main');
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      title={
        selectedBanner.confirmState === CONFIRMED_BANNER_STATE
          ? '해당 배너 광고 시작하기'
          : '해당 배너 광고 중단하기'
        }
      buttons={(
        <div>
          { selectedBanner.confirmState === 1 ? (
            <Button color="info" onClick={handleConfirmDialogOpen}>
            해당 배너 광고 시작
            </Button>
          ) : (
            <Button color="blueGray" onClick={handleConfirmDialogOpen}>
            해당 배너 광고 중단
            </Button>
          )}
          <Button onClick={onClose}>
            취소
          </Button>
        </div>
      )}
    >
      <div>
        {/* 모달내용 */}
        <div>
          <img src={selectedBanner.bannerSrc} alt="selectedBanner" height="400px" width="600px" />
          <Typography variant="h6">{`광고 캐시 잔액 : ${marketerDebit}`}</Typography>
          {/* 승인된 배너 / 일시정지가 아닌 배너 */}
          { selectedBanner.confirmState === CONFIRMED_BANNER_STATE && (
            <div>
              <Typography variant="h6">광고가 송출될 크리에이터 :</Typography>
              {creatorData ? creatorData.map(data => (
                // 일시정지된 배너인 경우 creatorData가 있으므로 해당 데이터를 사용한다
                <span key={data}>{`${data}, `}</span>
              )) : (
                // 일시정지된 배너가 아닌 경우 광고될 크리에이터 목록에서 가져온다.
                tableData.map(data => (
                  <span key={shortId.generate()}>{`${data[0]}, `}</span>
                ))
              )}
            </div>
          )}
        </div>

        {/* confirm dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={handleConfirmDialogClose}
          buttons={(
            <div>
              <Button
                onClick={() => handleClick()}
                color={selectedBanner.confirmState === CONFIRMED_BANNER_STATE
                  ? 'info' : 'blueGray'}
              >
                진행
              </Button>
              <Button onClick={handleConfirmDialogClose}>
                취소
              </Button>
            </div>
          )}
        >
          <DialogContent>
            { selectedBanner.confirmState === 1 ? (
              <Typography variant="h6" marked="center">
                해당 배너로 광고를 시작하시겠어요?
              </Typography>
            ) : (
              <Typography variant="h6" marked="center">
                해당 배너 광고를 중단 하시겠어요?
              </Typography>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Dialog>
  );
}

AdvertiseStartDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  marketerDebit: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedBanner: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
};

export default AdvertiseStartDialog;
