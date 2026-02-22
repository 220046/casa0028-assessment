import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

/**
 * HourlyChart: three lines showing the 24-hour distribution by incident type.
 */
export default function HourlyChart(props) {

  const chartData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const types = ['False Alarm', 'Fire', 'Special Service']
    const colours = {
      'False Alarm': '#f59e0b',
      'Fire': '#ef4444',
      'Special Service': '#3b82f6',
    }

    return {
      labels: hours.map(h => String(h).padStart(2, '0') + ':00'),
      datasets: types.map(type => ({
        label: type,
        data: hours.map(h => {
          const row = props.data.find(d => d.hour === h && d.type === type)
          return row ? row.count : 0
        }),
        borderColor: colours[type],
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 2,
        borderWidth: 2,
      })),
    }
  }, [props.data])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#64748b', font: { size: 11 }, usePointStyle: true, pointStyleWidth: 10, padding: 16 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ctx.dataset.label + ': ' + ctx.parsed.y.toLocaleString(),
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 12 },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#64748b', callback: (v) => (v / 1000) + 'k' },
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
