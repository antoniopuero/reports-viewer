import { Svg, G, Rect, Line } from '@react-pdf/renderer';

export function CustomSvg({
  forPdf,
  children,
  ...rest
}: React.PropsWithChildren<Record<string, unknown>>) {
  return forPdf ? (
    <Svg {...rest}>{children}</Svg>
  ) : (
    <svg {...rest}>{children}</svg>
  );
}
export function CustomG({
  forPdf,
  children,
  ...rest
}: React.PropsWithChildren<Record<string, unknown>>) {
  return forPdf ? <G {...rest}>{children}</G> : <g {...rest}>{children}</g>;
}
export function CustomLine({
  forPdf,
  ...rest
}: {
  forPdf: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeWidth: number;
  stroke: string;
}) {
  return forPdf ? <Line {...rest} /> : <line {...rest} />;
}
export function CustomRect({
  forPdf,
  ...rest
}: {
  forPdf: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeWidth: number;
  stroke: string;
  fill: string;
}) {
  return forPdf ? <Rect {...rest} /> : <rect {...rest} />;
}
