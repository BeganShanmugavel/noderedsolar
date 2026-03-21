import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ChartPanel({ data = [] }) {
  return (
    <div className="glass chart-wrap">
      <h3>Actual vs Predicted</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="actual_generation" stroke="#22d3ee" />
          <Line type="monotone" dataKey="predicted_generation" stroke="#a855f7" />
          <CartesianGrid stroke="#334155" />
          <XAxis dataKey="timestamp" hide />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
