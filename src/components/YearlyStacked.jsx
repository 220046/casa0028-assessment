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
 * YearlyStacked: stacked bar chart showing yearly breakdown by incident type.
 */
export default function YearlyStacked(props) {

  const chartData = useMemo(() => {
    const filtered = props.data.filter(
      d => d.year >= props.yearRange.min && d.year <= props.yearRange.max
    )
    const years = [...new Set(filtered.map(d => d.year))].sort()
    const types = ['Fire', 'False Alarm', 'Special Service']
    const colours = {
      'Fire': '#ef4444',
      'False Alarm': '#f59e0b',
      'Special Service': '#3b82f6',
    }

    return {
      labels: years.map(String),
      datasets: types.map(type => ({
        label: type,
        data: years.map(y => {
          const row = filtered.find(d => d.year === y && d.type === type)
          return row ? row.count : 0
        }),
        backgroundColor: colours[type],
      })),
    }
  }, [props.data, props.yearRange])

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
        stacked: true,
        ticks: { color: '#64748b', font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: { color: '#64748b', callback: (v) => (v / 1000) + 'k' },
        grid: { color: '#e2e8f0' },
      },
    },
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Yearly Breakdown by Type</h3>
      <div className="h-56">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}
