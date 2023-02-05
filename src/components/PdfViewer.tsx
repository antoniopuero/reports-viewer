import { PDFViewer } from '@react-pdf/renderer';
import { Ticker, AggregatedBarData } from '@/types';
import PdfReport from './PdfReport';

// used mostly for testing on client
// needs to be imported as `dynamic(() => import('@/components/PdfViewer'), { ssr: false });`
export default function PdfView({
  data,
}: {
  data: Array<{ ticker: Ticker; barData: AggregatedBarData }>;
}) {
  return (
    <PDFViewer>
      <PdfReport data={data} />
    </PDFViewer>
  );
}
