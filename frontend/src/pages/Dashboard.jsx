import { useEffect, useState } from 'react';
import DashboardCards from '../components/DashboardCards';
import ChartPanel from '../components/ChartPanel';
import { getDashboard } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboard().then(setData).catch(console.error);
  }, []);

  const stats = {
    actual_generation: data?.latest?.actual_generation,
    predicted_generation: data?.predicted_generation,
    efficiency: data?.efficiency?.efficiency,
    carbon_offset_kg: data?.carbon_offset_kg,
  };

  const chartData = (data?.window || []).map((row) => ({ ...row, predicted_generation: data?.predicted_generation || row.actual_generation }));

  return (
    <section>
      <h1>Industrial Solar Command Center</h1>
      <DashboardCards stats={stats} />
      <ChartPanel data={chartData} />
    </section>
  );
}
