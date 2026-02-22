import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Tooltip, Legend, Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

/**
 * TrendChart: filled line chart showing monthly callout volume.
 */
export default function TrendChart(props) {

  const chartData = useMemo(() => ({
    labels: props.data.map(d => d.month),
    datasets: [{
      label: 'Monthly Incidents',
      data: props.data.map(d => d.count),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.08)',
      fill: true,
      tension: 0.35,
      pointRadius: 0,
      pointHitRadius: 8,
      borderWidth: 2,
    }],
  }), [props.data])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { color: '#64748b', font: { size: 11 }, usePointStyle: true, pointStyleWidth: 10, padding: 16 },
      },
      tooltip: {
        callbacks: { label: (ctx) => ctx.parsed.y.toLocaleString() + ' incidents' },
      },
    },
    scales: {
      x: {
        ticks: { maxTicksLimit: 16, font: { size: 9 }, color: '#64748b' },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#64748b', callback: (v) => v.toLocaleString() },
        grid: { color: '#e2e8f0' },
      },
    },
  }

  return (
    <div className="h-56">
      <Line data={chartData} options={options} />
    </div>
  )
}
