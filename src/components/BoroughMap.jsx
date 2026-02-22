import { useMemo, useState, useCallback } from 'react'
import Map, { Source, Layer, Popup } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import boroughGeoJSON from '../data/london_boroughs.json'
import { boroughArea } from '../data/boroughArea'

/**
 * BoroughMap: choropleth coloured by incident density (incidents / km²).
 */
export default function BoroughMap(props) {

  const [hoverInfo, setHoverInfo] = useState(null)

  const enrichedGeoJSON = useMemo(() => {
    const densities = {}
    let maxDensity = 1
    for (const feature of boroughGeoJSON.features) {
      const name = feature.properties.name
      const count = props.boroughTotals[name] || 0
      const area = boroughArea[name] || 1
      const density = count / area
      densities[name] = density
      if (density > maxDensity) maxDensity = density
    }

    return {
      ...boroughGeoJSON,
      features: boroughGeoJSON.features.map(feature => {
        const name = feature.properties.name
        const count = props.boroughTotals[name] || 0
        const area = boroughArea[name] || 1
        const density = densities[name] || 0
        const intensity = Math.sqrt(density) / Math.sqrt(maxDensity)
        return {
          ...feature,
          properties: {
            ...feature.properties,
            count,
            area,
            density: Math.round(density),
            intensity,
          },
        }
      }),
    }
  }, [props.boroughTotals])

  const fillPaint = {
    'fill-color': [
      'interpolate', ['linear'], ['get', 'intensity'],
      0, '#fef3c7',
      0.3, '#f97316',
      0.6, '#dc2626',
      1, '#7f1d1d',
    ],
    'fill-opacity': [
      'case',
      ['==', ['get', 'name'], props.selectedBorough || ''],
      0.9,
      0.75,
    ],
  }

  const linePaint = {
    'line-color': [
      'case',
      ['==', ['get', 'name'], props.selectedBorough || ''],
      '#f59e0b',
      '#475569',
    ],
    'line-width': [
      'case',
      ['==', ['get', 'name'], props.selectedBorough || ''],
      3,
      0.8,
    ],
  }

  function handleClick(e) {
    if (e.features && e.features.length > 0) {
      props.onBoroughClick(e.features[0].properties.name)
    }
  }

  const handleHover = useCallback((e) => {
    if (e.features && e.features.length > 0) {
      const f = e.features[0]
      setHoverInfo({
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
        name: f.properties.name,
        count: f.properties.count,
        area: f.properties.area,
        density: f.properties.density,
      })
    } else {
      setHoverInfo(null)
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoverInfo(null)
  }, [])

  return (
    <div className="relative">
      <Map
        initialViewState={{ longitude: -0.1, latitude: 51.49, zoom: 9.2 }}
        style={{ width: '100%', height: 440 }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        interactiveLayerIds={['borough-fill']}
        onClick={handleClick}
        onMouseMove={handleHover}
        onMouseLeave={handleMouseLeave}
        cursor="pointer"
      >
        <Source id="boroughs" type="geojson" data={enrichedGeoJSON}>
          <Layer id="borough-fill" type="fill" paint={fillPaint} />
          <Layer id="borough-line" type="line" paint={linePaint} />
        </Source>

        {hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
            offset={[0, -5]}
          >
            <div className="text-xs leading-relaxed text-slate-800">
              <p className="font-bold text-sm">{hoverInfo.name}</p>
              <p>Incidents: <span className="font-semibold">{hoverInfo.count.toLocaleString()}</span></p>
              <p>Area: {hoverInfo.area} km&sup2;</p>
              <p>Density: <span className="font-semibold text-red-600">{hoverInfo.density.toLocaleString()}</span> per km&sup2;</p>
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-lg px-3 py-2 border border-slate-300 shadow-sm">
        <p className="text-[10px] text-slate-600 font-semibold mb-1.5">
          Incident Density (per km&sup2;)
        </p>
        <div className="flex items-center gap-0">
          {[
            { color: '#fef3c7', label: 'Low' },
            { color: '#f97316', label: '' },
            { color: '#dc2626', label: '' },
            { color: '#7f1d1d', label: 'High' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-8 h-3" style={{ backgroundColor: item.color }} />
              {item.label && <span className="text-[9px] text-slate-500 mt-0.5">{item.label}</span>}
            </div>
          ))}
        </div>
        <p className="text-[9px] text-slate-500 mt-1">
          Density = Total incidents / Borough area (km&sup2;)
        </p>
      </div>

      {/* Interaction hint */}
      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur rounded px-2 py-1 border border-slate-200 shadow-sm">
        <p className="text-[10px] text-slate-500">Hover for details | Click to filter | Click again to reset</p>
      </div>
    </div>
  )
}
