import Heatmap from '../components/Heatmap';

export default function PanelHealth() {
  const demo = Array.from({ length: 20 }, (_, i) => ({ panel_id: i + 1, generation: 20 + (i % 6) * 3, isWeak: i % 7 === 0 }));
  return <Heatmap panels={demo} />;
}
