import dayjs from 'dayjs';
import { useMemo } from 'react';
import Heatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';
import { useMarketerCampaignAnalysisHeatmap } from '../../../utils/hooks/query/useMarketerCampaignAnalysisHeatmap';
import CenterLoading from '../../loading/centerLoading';
import getMeanStd from './getMeanStd';

type ClickData = { count: number; date: string };
interface ClickHeatmap {
  campaignId: string;
}
export default function ClickHeatmap({ campaignId }: ClickHeatmap): JSX.Element {
  const clickData = useMarketerCampaignAnalysisHeatmap(campaignId);

  const getTooltipDataAttrs = (value: ClickData): { 'data-tip': string } | null => {
    // Temporary hack around null value.date issue
    if (!value || !value.date) {
      return null;
    }
    // Configuration for react-tooltip
    return {
      'data-tip': `${dayjs(value.date).format('YYYY년 MM월 DD일')}, ${value.count}회 클릭`,
    };
  };

  const statistics = useMemo(() => {
    if (clickData.data) {
      return getMeanStd(clickData.data.map(d => d.count));
    }
    return null;
  }, [clickData.data]);

  function makeDateOptions(): { startDate: Date; endDate: Date } {
    const today = new Date();
    const today2 = new Date();

    today.setDate(today.getDate() - 250);
    today2.setDate(today2.getDate() + 50);
    const startDate = today;
    const endDate = today2;
    return { startDate, endDate };
  }

  return (
    <div style={{ height: 220, overflow: 'auto' }}>
      {clickData.isLoading && <CenterLoading />}
      {!clickData.isLoading && clickData.data && (
        <>
          <Heatmap
            showMonthLabels
            showWeekdayLabels
            startDate={makeDateOptions().startDate}
            endDate={makeDateOptions().endDate}
            weekdayLabels={['일', '월', '화', '수', '목', '금', '토']}
            monthLabels={[
              '1월',
              '2월',
              '3월',
              '4월',
              '5월',
              '6월',
              '7월',
              '8월',
              '9월',
              '10월',
              '11월',
              '12월',
            ]}
            values={clickData.data}
            tooltipDataAttrs={getTooltipDataAttrs}
            classForValue={(value): string => {
              if (!value || !statistics) {
                return 'color-empty';
              }
              if (value.count < statistics.mean - 2 * statistics.stddev) {
                return 'color-github-0';
              }
              if (value.count < statistics.mean - statistics.stddev) {
                return 'color-github-1';
              }
              if (value.count < statistics.mean) {
                return 'color-github-2';
              }
              if (value.count < statistics.mean + statistics.stddev) {
                return 'color-github-3';
              }
              return 'color-github-4';
            }}
          />
          {clickData.data.length > 0 && (
            <ReactTooltip type="success" effect="solid" border={false} />
          )}
        </>
      )}
    </div>
  );
}
