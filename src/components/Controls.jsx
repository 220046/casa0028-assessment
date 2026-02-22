/**
 * Controls: sticky filter bar at page top.
 */
export default function Controls(props) {

  function handleYearChange(e) {
    const value = Number(e.target.value)
    if (e.target.id === 'year-min') {
      props.setYearRange({ min: value, max: props.yearRange.max })
    } else {
      props.setYearRange({ min: props.yearRange.min, max: value })
    }
  }

  function handleTypeChange(e) {
    props.setSelectedType(e.target.value)
  }

  function handleBoroughChange(e) {
    props.setSelectedBorough(e.target.value === '' ? null : e.target.value)
  }

  const hasFilters = props.selectedBorough
    || props.selectedType !== 'All'
    || props.yearRange.min !== 2018
    || props.yearRange.max !== 2025

  return (
    <div className="flex flex-wrap items-center gap-5 text-sm">
      {/* Year range */}
      <div className="flex items-center gap-2">
        <span className="text-slate-600 font-medium">Year</span>
        <input type="number" id="year-min" min={2018} max={2025}
          value={props.yearRange.min} onChange={handleYearChange}
          className="w-20 h-8 rounded bg-white border border-slate-300 px-2 text-center text-slate-800" />
        <span className="text-slate-400">&ndash;</span>
        <input type="number" id="year-max" min={2018} max={2025}
          value={props.yearRange.max} onChange={handleYearChange}
          className="w-20 h-8 rounded bg-white border border-slate-300 px-2 text-center text-slate-800" />
      </div>

      {/* Incident type */}
      <div className="flex items-center gap-2">
        <span className="text-slate-600 font-medium">Type</span>
        <select value={props.selectedType} onChange={handleTypeChange}
          className="h-8 rounded bg-white border border-slate-300 px-2 text-slate-800">
          {props.incidentTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Borough */}
      <div className="flex items-center gap-2">
        <span className="text-slate-600 font-medium">Borough</span>
        <select value={props.selectedBorough || ''} onChange={handleBoroughChange}
          className="h-8 rounded bg-white border border-slate-300 px-2 text-slate-800">
          <option value="">All London</option>
          {props.boroughs.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Reset */}
      {hasFilters && (
        <button onClick={() => {
          props.setYearRange({ min: 2018, max: 2025 })
          props.setSelectedType('All')
          props.setSelectedBorough(null)
        }} className="text-xs text-slate-500 hover:text-red-600 underline ml-auto">
          Reset filters
        </button>
      )}
    </div>
  )
}
