'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

type Props = {
  data: { name: string; value: number }[];
};

export default function BarChartClient({ data }: Props) {
  return (
    // @ts-ignore
    <BarChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" stroke="#fff" />
      <YAxis stroke="#fff" />
      <Tooltip />
      <Bar dataKey="value" fill="#38bdf8" />
    </BarChart>
  );
}
