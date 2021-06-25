import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import Heatmap from 'react-calendar-heatmap';
import getMeanStd from './getMeanStd';
import './heatmap.css';

type ClickData = { count: number; date: string };
interface ClickHeatmapProps {
  data: ClickData[];
}
export default function ClickHeatmap(props: ClickHeatmapProps): JSX.Element {
  const { data } = props;

  const getTooltipDataAttrs = (value: ClickData): { 'data-tip': string } | null => {
    // Temporary hack around null value.date issue
    if (!value || !value.date) {
      return null;
    }
    // Configuration for react-tooltip
    return {
      'data-tip': `${moment(value.date).format('YYYY년 MM월 DD일')}, ${value.count}회 클릭`,
    };
  };

  const { mean, stddev } = getMeanStd(data.map(d => d.count));

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
        values={data}
        tooltipDataAttrs={getTooltipDataAttrs}
        classForValue={(value): string => {
          if (!value) {
            return 'color-empty';
          }
          if (value.count < mean - 2 * stddev) {
            return 'color-github-0';
          }
          if (value.count < mean - stddev) {
            return 'color-github-1';
          }
          if (value.count < mean) {
            return 'color-github-2';
          }
          if (value.count < mean + stddev) {
            return 'color-github-3';
          }
          return 'color-github-4';
        }}
      />
      {data.length > 0 && <ReactTooltip type="success" effect="solid" border={false} />}
    </div>
  );
}
