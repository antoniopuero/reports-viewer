import React from 'react';
import { CustomLine, CustomRect } from './Elements';
import type { BarData } from '@/types';

const Candle = ({
  data,
  x,
  width,
  getY,
  forPdf,
}: {
  data: BarData;
  x: number;
  width: number;
  getY: (p: number) => number;
  forPdf: boolean;
}) => {
  const isUp = data.c > data.o;
  const top = getY(isUp ? data.c : data.o);
  const bottom = getY(isUp ? data.o : data.c);
  const height = bottom - top;
  const wickTop = getY(data.h);
  const wickBottom = getY(data.l);
  const color = isUp ? '#81dfc4' : '#d75b6d';

  return (
    <>
      <CustomRect
        x={x - width / 2}
        y={top}
        width={width}
        height={height}
        strokeWidth={1}
        stroke={color}
        fill={color}
        forPdf={forPdf}
      />
      <CustomLine
        x1={x}
        y1={top}
        x2={x}
        y2={wickTop}
        strokeWidth={1.5}
        stroke={color}
        forPdf={forPdf}
      />
      <CustomLine
        x1={x}
        y1={bottom}
        x2={x}
        y2={wickBottom}
        strokeWidth={1.5}
        stroke={color}
        forPdf={forPdf}
      />
    </>
  );
};

export default Candle;
