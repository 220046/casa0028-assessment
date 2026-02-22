import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

/**
 * BoroughBar: horizontal bar chart showing the top 10 boroughs by incident count.
 */
export default function BoroughBar(props) {

  const top10 = useMemo(() => props.data.slice(0, 10), [props.data])

  const chartData = useMemo(() => ({
    labels: top10.map(d => d.borough),
    datasets: [{
      label: 'Total Incidents',
      data: top10.map(d => d.count),
      backgroundColor: top10.map(d =>
        d.borough === props.selectedBorough ? '#f59e0b' : '#ef4444'
      ),
      borderRadius: 3,
    }],
  }), [top10, props.selectedBorough])

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
          label: (ctx) => ctx.parsed.x.toLocaleString() + ' incidents',
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
    <div>
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Top 10 Boroughs by Incidents</h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}
