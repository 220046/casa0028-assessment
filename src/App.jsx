import { useState, useMemo } from 'react'
import './styles.css'
import {
  incidentData,
  hourlyData,
  responseTimeData,
  yearlyData,
  specialServiceData,
  firePropertyData,
} from './data/fireData'

import HeroSection from './components/HeroSection'
import Controls from './components/Controls'
import BoroughMap from './components/BoroughMap'
import TypeBreakdown from './components/TypeBreakdown'
import SpecialServiceBar from './components/SpecialServiceBar'
import YearlyStacked from './components/YearlyStacked'
import TrendChart from './components/TrendChart'
import HourlyChart from './components/HourlyChart'
import ResponseTimeBar from './components/ResponseTimeBar'
import FirePropertyChart from './components/FirePropertyChart'
import BoroughBar from './components/BoroughBar'

function App() {

  const [yearRange, setYearRange] = useState({ min: 2018, max: 2025 })
  const [selectedType, setSelectedType] = useState('All')
  const [selectedBorough, setSelectedBorough] = useState(null)

  const boroughs = useMemo(() => {
    return [...new Set(incidentData.map(d => d.borough))].sort()
  }, [])

  const incidentTypes = useMemo(() => {
    return ['All', ...[...new Set(incidentData.map(d => d.type))].sort()]
  }, [])

  const filteredData = useMemo(() => {
    return incidentData.filter(d => {
      const inYear = d.year >= yearRange.min && d.year <= yearRange.max
      const inType = selectedType === 'All' || d.type === selectedType
      const inBorough = !selectedBorough || d.borough === selectedBorough
      return inYear && inType && inBorough
    })
  }, [yearRange, selectedType, selectedBorough])

  const boroughTotals = useMemo(() => {
    const counts = {}
    incidentData.filter(d => {
      return d.year >= yearRange.min && d.year <= yearRange.max
        && (selectedType === 'All' || d.type === selectedType)
    }).forEach(d => {
      counts[d.borough] = (counts[d.borough] || 0) + d.count
    })
    return counts
  }, [yearRange, selectedType])

  const typeBreakdown = useMemo(() => {
    const counts = {}
    incidentData.filter(d => {
      return d.year >= yearRange.min && d.year <= yearRange.max
        && (!selectedBorough || d.borough === selectedBorough)
    }).forEach(d => {
      counts[d.type] = (counts[d.type] || 0) + d.count
    })
    return counts
  }, [yearRange, selectedBorough])

  const monthlyTrend = useMemo(() => {
    const counts = {}
    filteredData.forEach(d => {
      const key = `${d.year}-${String(d.month).padStart(2, '0')}`
      counts[key] = (counts[key] || 0) + d.count
    })
    return Object.entries(counts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, count]) => ({ month, count }))
  }, [filteredData])

  const boroughRanking = useMemo(() => {
    const counts = {}
    filteredData.forEach(d => {
      counts[d.borough] = (counts[d.borough] || 0) + d.count
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([borough, count]) => ({ borough, count }))
  }, [filteredData])

  const totalIncidents = useMemo(() => {
    return filteredData.reduce((sum, d) => sum + d.count, 0)
  }, [filteredData])

  function handleBoroughClick(name) {
    setSelectedBorough(prev => prev === name ? null : name)
  }

  return (
    <div className="min-h-screen text-slate-800 relative">
      {/* Fixed background image */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}content-bg.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <HeroSection typeBreakdown={typeBreakdown} />

      {/* Sticky filter bar */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Controls
            yearRange={yearRange} setYearRange={setYearRange}
            selectedType={selectedType} setSelectedType={setSelectedType}
            selectedBorough={selectedBorough} setSelectedBorough={setSelectedBorough}
            incidentTypes={incidentTypes} boroughs={boroughs}
          />
        </div>
      </div>

      {/* Chapter 1 | Where: Spatial Patterns */}
      <section className="bg-white/75 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
          <p className="text-red-600 text-xs font-semibold uppercase tracking-widest mb-2">Chapter 1</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Where Incidents Happen</h2>
          <p className="text-slate-600 text-sm max-w-2xl mb-4">
            The map below is based on <span className="text-slate-900 font-semibold">411,199</span> geo-coded callout records.
            Colour represents incident density (total incidents / borough area in km&sup2;), removing the visual bias of borough size.
            Darker areas indicate high-density hotspots; Westminster and the central boroughs form a prominent continuous belt.
            <span className="text-slate-900 font-semibold"> Click</span> any borough to filter all charts below to that area;
            <span className="text-slate-900 font-semibold"> click again</span> to deselect and restore the London-wide view.
            Hover for details on each borough.
          </p>

          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <BoroughMap
              boroughTotals={boroughTotals}
              selectedBorough={selectedBorough}
              onBoroughClick={handleBoroughClick}
            />
          </div>

          <div className="mt-6 bg-white/80 rounded-xl p-5 border border-slate-200">
            <BoroughBar data={boroughRanking} selectedBorough={selectedBorough} />
          </div>
        </div>
      </section>

      <div className="h-16" />

      {/* Chapter 2 | What: Incident Types */}
      <section className="bg-white/75 backdrop-blur-sm py-12">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-red-600 text-xs font-semibold uppercase tracking-widest mb-2">Chapter 2</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">What the Fire Brigade Actually Does</h2>
          <p className="text-slate-600 text-sm max-w-2xl mb-8">
            Nearly <span className="text-amber-600 font-semibold">half of all callouts are false alarms</span>.
            Actual fires account for just 15%, the smallest category. But the fastest-growing segment is special services,
            whose composition reveals deep shifts in modern urban life.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/90 rounded-xl p-5 border border-slate-200 shadow-sm">
              <TypeBreakdown data={typeBreakdown} />
            </div>
            <div className="bg-white/90 rounded-xl p-5 border border-slate-200 shadow-sm">
              <YearlyStacked data={yearlyData} yearRange={yearRange} />
            </div>
          </div>

          <div className="mt-6 bg-white/90 rounded-xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Special Service Breakdown</h3>
            <p className="text-xs text-slate-500 mb-4">
              The top category is "Effecting Entry", forcing open locked doors, typically for welfare checks on elderly residents living alone.
              Flooding ranks second, reflecting extreme rainfall driven by climate change. Lift releases and road traffic collisions follow closely.
            </p>
            <SpecialServiceBar data={specialServiceData} />
          </div>

          <div className="mt-6 bg-white/90 rounded-xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Where Fires Occur</h3>
            <p className="text-xs text-slate-500 mb-4">
              Dwellings and outdoor spaces each account for roughly 28% of fires. Outdoor structures (sheds, fences, bins) make up 24%.
              Road vehicles account for 9%. This challenges the common assumption that most fires are residential.
            </p>
            <FirePropertyChart data={firePropertyData} />
          </div>
        </div>
      </section>

      <div className="h-16" />

      {/* Chapter 3 | When: Temporal Patterns */}
      <section className="bg-white/75 backdrop-blur-sm py-12">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-red-600 text-xs font-semibold uppercase tracking-widest mb-2">Chapter 3</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">When Demand Peaks</h2>
          <p className="text-slate-600 text-sm max-w-2xl mb-8">
            All incident types peak between <span className="text-slate-900 font-semibold">5 pm and 6 pm</span>,
            coinciding with the evening rush hour. Monthly trends reveal summer surges in outdoor fires,
            while total callout volume shows a long-term upward trend, reinforcing the "never busier" narrative.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/90 rounded-xl p-5 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Monthly Trend</h3>
              <TrendChart data={monthlyTrend} />
            </div>
            <div className="bg-white/90 rounded-xl p-5 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">24-Hour Distribution</h3>
              <HourlyChart data={hourlyData} />
            </div>
          </div>
        </div>
      </section>

      <div className="h-16" />

      {/* Chapter 4 | Response Time Inequality */}
      <section className="bg-white/75 backdrop-blur-sm py-12">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-red-600 text-xs font-semibold uppercase tracking-widest mb-2">Chapter 4</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Response Time Inequality</h2>
          <p className="text-slate-600 text-sm max-w-2xl mb-8">
            Outer London residents wait significantly longer for help.
            <span className="text-slate-900 font-semibold"> Hillingdon averages 6.3 minutes</span>, while
            <span className="text-slate-900 font-semibold"> Kensington & Chelsea needs only 4.5 minutes</span>,
            a 40% gap. As the brigade takes on ever more non-fire tasks,
            will this spatial inequality widen further?
          </p>

          <div className="bg-white/90 rounded-xl p-5 border border-slate-200 shadow-sm">
            <ResponseTimeBar data={responseTimeData} selectedBorough={selectedBorough} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Data source:{' '}
            <a href="https://data.london.gov.uk/dataset/london-fire-brigade-incident-records-em8xy/"
              target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700">
              London Fire Brigade Incident Records
            </a>, London Datastore, UK Open Government Licence v2
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Population data: ONS Mid-2024 Estimates &middot;
            Photos:{' '}
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer"
              className="underline hover:text-slate-700">Unsplash</a>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Built with React, Chart.js &amp; MapLibre GL &middot; CASA0028 Assessment 1
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
