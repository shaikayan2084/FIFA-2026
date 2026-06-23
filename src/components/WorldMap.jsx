import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { teams, groups } from "../data/teams";
import CaptainPanel from "./CaptainPanel";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const groupColors = {
  A: "#FF6B6B", B: "#4ECDC4", C: "#45B7D1", D: "#96CEB4",
  E: "#FFEAA7", F: "#DDA0DD", G: "#98D8C8", H: "#F7DC6F",
  I: "#BB8FCE", J: "#85C1E9", K: "#F0B27A", L: "#82E0AA",
};

const groupColorDark = {
  A: "#cc4444", B: "#33aaa0", C: "#3399bb", D: "#66aa88",
  E: "#ccbb44", F: "#aa66bb", G: "#55aa88", H: "#ccaa44",
  I: "#8844aa", J: "#4488bb", K: "#bb6622", L: "#44aa66",
};

const WorldMap = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const filteredTeams = selectedGroup ? groups[selectedGroup] : teams;

  const toggleGroup = (group) => {
    setSelectedGroup(selectedGroup === group ? null : group);
  };

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

          {teams.map((team) => {
            const isInSelected = !selectedGroup || selectedGroup === team.group;
            return (
              <Marker
                key={team.id}
                coordinates={team.coords}
                onMouseEnter={() => setTooltip(team)}
                onMouseLeave={() => setTooltip(null)}
                onClick={() => setSelectedTeam(team)}
              >
                <circle
                  r={isInSelected ? 6 : 3}
                  fill={isInSelected ? groupColors[team.group] : "#555566"}
                  stroke={isInSelected ? "#fff" : "#444455"}
                  strokeWidth={isInSelected ? 1.5 : 0.5}
                  style={{
                    cursor: "pointer",
                    transition: "r 0.2s, fill 0.2s, opacity 0.2s",
                    opacity: isInSelected ? 1 : 0.3,
                  }}
                  onMouseEnter={(e) => { if (isInSelected) e.target.setAttribute("r", "9") }}
                  onMouseLeave={(e) => { if (isInSelected) e.target.setAttribute("r", "6") }}
                />
              </Marker>
            );
          })}
        </ComposableMap>

        {tooltip && (
          <div className="map-tooltip" style={{ top: "10px", right: "10px" }}>
            <span className="tooltip-flag">{tooltip.flag}</span>
            <div>
              <strong>{tooltip.name}</strong>
              <br />
              <small>Capt: {tooltip.captain} | Group {tooltip.group}</small>
            </div>
          </div>
        )}
      </div>

      <div className="groups-bar">
        {Object.entries(groupColors).map(([g, color]) => (
          <button
            key={g}
            className={`group-chip ${selectedGroup === g ? "active" : ""}`}
            style={{ borderColor: selectedGroup === g ? color : "#3a3a5c" }}
            onClick={() => toggleGroup(g)}
          >
            <span className="group-dot" style={{ background: color }} />
            Group {g}
          </button>
        ))}
        {selectedGroup && (
          <button className="group-chip clear-btn" onClick={() => setSelectedGroup(null)}>
            Clear Filter
          </button>
        )}
      </div>

      <div className="group-teams">
        {Object.entries(groups).map(([g, gTeams]) => {
          if (selectedGroup && selectedGroup !== g) return null;
          return (
            <div key={g} className="group-column" style={{ borderTopColor: groupColors[g] }}>
              <div className="group-header" style={{ color: groupColors[g] }}>
                Group {g}
              </div>
              {gTeams.map((t) => (
                <div
                  key={t.id}
                  className="group-team-row"
                  onClick={() => setSelectedTeam(t)}
                  onMouseEnter={() => setTooltip(t)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <img src={t.flagImg} alt="" className="group-team-flag" />
                  <div className="group-team-info">
                    <span className="group-team-name">{t.name}</span>
                    <span className="group-team-captain">Capt: {t.captain}</span>
                  </div>
                  <div className="group-team-winner" style={{ color: groupColors[g] }}>
                    {t.firstTitle ? t.firstTitle : "—"}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {selectedTeam && (
        <CaptainPanel team={selectedTeam} onClose={() => setSelectedTeam(null)} />
      )}
    </div>
  );
};

export default WorldMap;
