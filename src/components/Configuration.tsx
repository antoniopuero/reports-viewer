import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import type { Ticker } from '@/types';

type Config = { ticker?: string; duration?: string };
export default function Configuration({
  tickers,
  config,
  changeConfig,
}: {
  tickers: Ticker[];
  config: Config;
  changeConfig: (params: Config) => void;
}) {
  return (
    <Stack spacing={2} direction="row" justifyContent="center">
      <FormControl sx={{ width: 200 }}>
        <InputLabel id="ticker-select">Ticker</InputLabel>
        <Select
          labelId="ticker-select"
          value={config.ticker ?? ''}
          label="Ticker"
          onChange={(event: SelectChangeEvent) => {
            changeConfig({ ticker: event.target.value });
          }}
        >
          {tickers.map((ticker) => (
            <MenuItem value={ticker.ticker} key={ticker.ticker}>
              <b style={{ width: '5rem', display: 'inline-block' }}>
                {ticker.ticker}
              </b>{' '}
              {ticker.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: 200 }}>
        <InputLabel id="duration-select">Duration</InputLabel>
        <Select
          labelId="duration-select"
          value={config.duration ?? ''}
          label="Duration"
          onChange={(event: SelectChangeEvent) => {
            changeConfig({ duration: event.target.value });
          }}
        >
          <MenuItem value="week">week</MenuItem>
          <MenuItem value="month">month</MenuItem>
          <MenuItem value="year">year</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
