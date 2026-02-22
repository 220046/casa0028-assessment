import { useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

/**
 * TypeBreakdown: doughnut chart showing the proportion of three incident types.
 */
export default function TypeBreakdown(props) {

  const COLOURS = {
    'False Alarm': '#f59e0b',
    'Fire': '#ef4444',
    'Special Service': '#3b82f6',
  }

  const chartData = useMemo(() => {
    const keys = Object.keys(props.data).sort()
    return {
      labels: keys,
      datasets: [{
        data: keys.map(k => props.data[k]),
        backgroundColor: keys.map(k => COLOURS[k] || '#6b7280'),
        borderWidth: 0,
        hoverOffset: 6,
      }],
    }
  }, [props.data])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#64748b', font: { size: 11 }, usePointStyle: true, pointStyleWidth: 10, padding: 16 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
            const pct = ((ctx.parsed / total) * 100).toFixed(1)
            return ctx.label + ': ' + ctx.parsed.toLocaleString() + ' (' + pct + '%)'
          },
        },
      },
    },
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Incident Type Breakdown</h3>
      <div className="h-56">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  )
}
