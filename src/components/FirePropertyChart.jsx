import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

/**
 * FirePropertyChart: horizontal bar chart showing fire distribution by property type.
 */
export default function FirePropertyChart(props) {

  const chartData = useMemo(() => {
    return {
      labels: props.data.map(d => d.property),
      datasets: [{
        label: 'Fires by Property Type',
        data: props.data.map(d => d.count),
        backgroundColor: '#ef4444',
        borderRadius: 3,
      }],
    }
  }, [props.data])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    datasets: { bar: { categoryPercentage: 0.65, barPercentage: 0.85 } },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { color: '#64748b', font: { size: 11 }, usePointStyle: true, pointStyleWidth: 10, padding: 16 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
            const pct = ((ctx.parsed.x / total) * 100).toFixed(1)
            return ctx.parsed.x.toLocaleString() + ' fires (' + pct + '%)'
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { color: '#64748b', callback: (v) => (v / 1000) + 'k' },
        grid: { color: '#e2e8f0' },
      },
      y: {
        ticks: { color: '#475569', font: { size: 11 } },
        grid: { display: false },
      },
    },
  }

  return (
    <div className="h-56">
      <Bar data={chartData} options={options} />
    </div>
  )
}
