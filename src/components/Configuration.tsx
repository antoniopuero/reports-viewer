import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styles from '@/styles/Home.module.css';
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
    <div className={styles.configurator}>
      <Autocomplete
        disablePortal
        value={config.ticker ?? ''}
        options={tickers.map((ticker) => ticker.ticker)}
        sx={{ width: 400 }}
        renderInput={(params) => <TextField {...params} label="Ticker" />}
        onSelect={(event) => {
          const ticker = (event.target as any).value?.replace(/\s\[.+\]/, '');
          changeConfig({ ticker });
        }}
      />

      <FormControl sx={{ width: 200 }}>
        <InputLabel id="duration-select">Duration</InputLabel>
        <Select
          labelId="duration-select"
          value={config.duration ?? ''}
          label="Duration for report"
          onChange={(event: SelectChangeEvent) => {
            changeConfig({ duration: event.target.value });
          }}
        >
          <MenuItem value="week">week</MenuItem>
          <MenuItem value="month">month</MenuItem>
          <MenuItem value="year">year</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
