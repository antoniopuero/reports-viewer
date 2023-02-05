import { useCallback } from 'react';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import styles from '@/styles/Home.module.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { REPORT_STATUSES } from '@/constants';

export default function ReportList({
  reports,
  progress,
  addReport,
}: {
  reports: Record<string, string> | null;
  progress: Record<string, number> | null;
  addReport: (report: { reportId: string; status: string }) => void;
}) {
  const requestReport = useCallback(async () => {
    const res = await fetch('/api/request-report');
    const data = await res.json();
    addReport(data);
  }, [addReport]);
  return (
    <div className={styles.reportList}>
      {reports ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 600 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Report id</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Progress</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(reports).map(([reportId, status]) => (
                <TableRow
                  key={reportId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {reportId}
                  </TableCell>
                  <TableCell align="right">{status}</TableCell>
                  <TableCell align="right">
                    {status === REPORT_STATUSES.pending
                      ? `${progress?.[reportId] || 0}%`
                      : ''}
                  </TableCell>
                  <TableCell align="right">
                    <LoadingButton
                      loading={status === REPORT_STATUSES.pending}
                      disabled={status !== REPORT_STATUSES.finished}
                      variant="contained"
                      href={`/api/download-report?reportId=${reportId}`}
                      target="_blank"
                    >
                      Download
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
      <Button
        sx={{ margin: '2rem' }}
        variant="contained"
        onClick={requestReport}
      >
        Requent pdf report
      </Button>
    </div>
  );
}
