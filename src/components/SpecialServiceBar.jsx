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
 * SpecialServiceBar: horizontal bar chart ranking special service sub-types.
 */
export default function SpecialServiceBar(props) {

  const chartData = useMemo(() => {
    return {
      labels: props.data.map(d => d.service),
      datasets: [{
        label: 'Special Service Callouts (2018\u20132025)',
        data: props.data.map(d => d.count),
        backgroundColor: '#3b82f6',
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
          label: (ctx) => ctx.parsed.x.toLocaleString() + ' callouts (2018\u20132025)',
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
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  )
}
