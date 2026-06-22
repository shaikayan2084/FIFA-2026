import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { teams } from "../data/teams";
import CaptainPanel from "./CaptainPanel";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const groupColors = {
  A: "#FF6B6B", B: "#4ECDC4", C: "#45B7D1", D: "#96CEB4",
  E: "#FFEAA7", F: "#DDA0DD", G: "#98D8C8", H: "#F7DC6F",
  I: "#BB8FCE", J: "#85C1E9", K: "#F0B27A", L: "#82E0AA",
};

const WorldMap = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  return (
    <div className="world-map-container">
      <div className="map-header">
        <h1>FIFA World Cup 2026</h1>
        <p className="map-subtitle">Captains of all 48 qualified nations</p>
      </div>

      <div className="map-wrapper">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 130, center: [10, 25] }}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#2d2d44"
                  stroke="#1a1a2e"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#3d3d5c", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {teams.map((team) => (
            <Marker
              key={team.id}
              coordinates={team.coords}
              onMouseEnter={() => setTooltip(team)}
              onMouseLeave={() => setTooltip(null)}
              onClick={() => setSelectedTeam(team)}
            >
              <circle
                r={6}
                fill={groupColors[team.group]}
                stroke="#fff"
                strokeWidth={1.5}
                style={{ cursor: "pointer", transition: "r 0.2s" }}
                onMouseEnter={(e) => { (e.target as SVGCircleElement).setAttribute("r", "9") }}
                onMouseLeave={(e) => { (e.target as SVGCircleElement).setAttribute("r", "6") }}
              />
            </Marker>
          ))}
        </ComposableMap>

        {tooltip && (
          <div className="map-tooltip" style={{ top: "10px", right: "10px" }}>
            <span className="tooltip-flag">{tooltip.flag}</span>
            <div>
              <strong>{tooltip.name}</strong>
              <br />
              <small>Capt: {tooltip.captain}</small>
            </div>
          </div>
        )}
      </div>

      <div className="groups-bar">
        {Object.entries(groupColors).map(([g, color]) => (
          <span key={g} className="group-chip" style={{ borderColor: color }}>
            <span className="group-dot" style={{ background: color }} />
            Group {g}
          </span>
        ))}
      </div>

      {selectedTeam && (
        <CaptainPanel team={selectedTeam} onClose={() => setSelectedTeam(null)} />
      )}
    </div>
  );
};

export default WorldMap;
