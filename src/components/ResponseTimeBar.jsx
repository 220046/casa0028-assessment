import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

/**
 * ResponseTimeBar: horizontal bar chart showing average first-pump response time per borough.
 */
export default function ResponseTimeBar(props) {

  const chartData = useMemo(() => {
    const sorted = [...props.data].sort((a, b) => b.avgSeconds - a.avgSeconds)
    const maxTime = sorted[0]?.avgSeconds || 1
    const minTime = sorted[sorted.length - 1]?.avgSeconds || 1

    return {
      labels: sorted.map(d => d.borough),
      datasets: [{
        data: sorted.map(d => (d.avgSeconds / 60).toFixed(1)),
        backgroundColor: sorted.map(d => {
          if (d.borough === props.selectedBorough) return '#f59e0b'
          const ratio = (d.avgSeconds - minTime) / (maxTime - minTime)
          return ratio > 0.6 ? '#ef4444' : ratio > 0.3 ? '#f97316' : '#3b82f6'
        }),
        borderRadius: 2,
        barThickness: 14,
      }],
    }
  }, [props.data, props.selectedBorough])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => 'Avg. response time: ' + ctx.parsed.x + ' min',
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Minutes', color: '#64748b', font: { size: 11 } },
        ticks: { color: '#64748b' },
        grid: { color: '#e2e8f0' },
      },
      y: {
        ticks: { color: '#475569', font: { size: 10 } },
        grid: { display: false },
      },
    },
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 mb-1">Average Response Time by Borough</h3>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#ef4444' }} />
          <span className="text-[11px] text-slate-600">Slow (&gt;5.5 min)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#f97316' }} />
          <span className="text-[11px] text-slate-600">Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#3b82f6' }} />
          <span className="text-[11px] text-slate-600">Fast (&lt;4.8 min)</span>
        </div>
        {props.selectedBorough && (
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#f59e0b' }} />
            <span className="text-[11px] text-slate-600">Selected</span>
          </div>
        )}
      </div>
      <div className="h-[700px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}
