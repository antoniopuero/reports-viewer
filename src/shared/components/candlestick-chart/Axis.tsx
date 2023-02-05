import React, { useRef, useLayoutEffect } from 'react';

import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { extent } from 'd3-array';
import { ScaleLinear, ScaleTime } from 'd3-scale';

const useAxis = (
  scale: ScaleLinear<number, number> | ScaleTime<number, number>,
  width: number,
  pxPerTick: number,
  position: string,
  ref: React.RefObject<SVGSVGElement>
) => {
  useLayoutEffect(() => {
    const isLeftAxis = position === 'left';
    const [start, end] = extent(scale.range());
    if (start == null || end == null) {
      return;
    }
    const tickCount = Math.ceil((end - start) / pxPerTick);
    const axisGenerator = isLeftAxis ? axisLeft(scale) : axisBottom(scale);
    axisGenerator.ticks(tickCount);

    const host = select(ref.current);
    host.select('g').remove();
    const group = host.append('g');
    if (isLeftAxis) {
      group.attr('transform', `translate(${width}, 0)`);
    }
    group.call(axisGenerator);
  }, [scale, width, position]);
};

export function LeftAxis({
  scale,
  width,
}: {
  scale: ScaleLinear<number, number>;
  width: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  useAxis(scale, width, 30, 'left', ref);

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
  useAxis(scale, width, 80, 'bottom', ref);

  return <g ref={ref} />;
}
