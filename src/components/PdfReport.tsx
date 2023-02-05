import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Ticker, AggregatedBarData } from '@/types';
import Chart from '@/shared/components/candlestick-chart/Chart';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export default function Report({
  data,
}: {
  data: Array<{ ticker: Ticker; barData: AggregatedBarData }>;
}) {
  return (
    <Document>
      {data.map((tickerData) => {
        return (
          <Page size="A4" style={styles.page} key={tickerData.ticker.ticker}>
            <View style={styles.section}>
              <Text>
                {tickerData.ticker.ticker} {tickerData.ticker.name}
              </Text>
              <Text>Max price: {tickerData.barData.maxPrice}</Text>
              <Text>Min price: {tickerData.barData.minPrice}</Text>
              <Chart
                data={tickerData.barData}
                width={400}
                height={300}
                forPdf
              />
            </View>
          </Page>
        );
      })}
    </Document>
  );
}
