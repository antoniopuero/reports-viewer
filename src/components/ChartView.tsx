import { useEffect, useState } from 'react';
import CandlestickChart from '@/shared/components/candlestick-chart/Chart';
import styles from '@/styles/Home.module.css';
import type { AggregatedBarData } from '@/types';

export default function ChartView({
  ticker,
  duration,
}: {
  ticker?: string;
  duration?: string;
}) {
  const [chartData, setChartData] = useState<AggregatedBarData | null>(null);

  useEffect(() => {
    if (ticker && duration) {
      const fetchTickerData = async () => {
        const res = await fetch(
          `/api/ticker-data?${new URLSearchParams({ ticker, duration })}`
        );
        const data = await res.json();
        setChartData(data);
      };

      fetchTickerData();
    }
  }, [ticker, duration]);

  if (!chartData) {
    return null;
  }

  return (
    <div className={styles.chartContainer}>
      <CandlestickChart data={chartData} width={800} height={500} />
    </div>
  );
}
