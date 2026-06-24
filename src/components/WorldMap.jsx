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

const WorldMap = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const toggleGroup = (group) => {
    setSelectedGroup(selectedGroup === group ? null : group);
    if (selectedGroup !== group) {
      setTimeout(() => {
        document.getElementById(`group-section-${group}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
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

          {teams.filter((t) => !selectedGroup || t.group === selectedGroup).map((team) => {
            return (
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
                  onMouseEnter={(e) => { e.target.setAttribute("r", "9") }}
                  onMouseLeave={(e) => { e.target.setAttribute("r", "6") }}
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
            <div key={g} id={`group-section-${g}`} className="group-column" style={{ borderTopColor: groupColors[g] }}>
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
                  <img src={t.flagImg} alt="" className="group-team-flag" loading="lazy" />
                  <div className="group-team-info">
                    <span className="group-team-name">{t.name}</span>
                    <div className="group-team-captain-row">
                      {t.captainImg ? (
                        <img src={t.captainImg} alt="" className="group-captain-img" loading="lazy"
                          onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.querySelector('.group-captain-placeholder').style.display = 'inline-flex'; }} />
                      ) : null}
                      <span className="group-captain-placeholder" style={{ display: t.captainImg ? 'none' : 'inline-flex' }}>
                        {t.captain.charAt(0)}
                      </span>
                      <span className="group-team-captain">Capt: {t.captain}</span>
                    </div>
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
