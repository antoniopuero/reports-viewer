import React, { useRef, useLayoutEffect } from 'react';

import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { extent } from 'd3-array';
import { ScaleLinear, ScaleTime } from 'd3-scale';

export function LeftAxis({
  scale,
  width,
}: {
  scale: ScaleLinear<number, number>;
  width: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  useLayoutEffect(() => {
    const [start, end] = extent(scale.range());
    if (start == null || end == null) {
      return;
    }
    const pxPerTick = 30;
    const tickCount = Math.ceil((end - start) / pxPerTick);
    const axisGenerator = axisLeft(scale);
    axisGenerator.ticks(tickCount);

    const host = select(ref.current);
    host.select('g').remove();
    const group = host.append('g');
    group.attr('transform', `translate(${width}, 0)`);
    group.call(axisGenerator);
  }, [scale, width]);

  return <g ref={ref} />;
}

export function BottomAxis({
  scale,
  width,
}: {
  scale: ScaleTime<number, number>;
  width: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  useLayoutEffect(() => {
    const axisGenerator = axisBottom(scale);
    const [start, end] = extent(scale.range());
    if (start == null || end == null) {
      return;
    }
    const pxPerTick = 80;
    const tickCount = Math.ceil((end - start) / pxPerTick);
    axisGenerator.ticks(tickCount);

    const host = select(ref.current);
    host.select('g').remove();
    const group = host.append('g');
    group.call(axisGenerator);
  }, [scale, width]);

  return <g ref={ref} />;
}
