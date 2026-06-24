import { motion, AnimatePresence } from "framer-motion";

const groupColors = {
  A: "#FF6B6B", B: "#4ECDC4", C: "#45B7D1", D: "#96CEB4",
  E: "#FFEAA7", F: "#DDA0DD", G: "#98D8C8", H: "#F7DC6F",
  I: "#BB8FCE", J: "#85C1E9", K: "#F0B27A", L: "#82E0AA",
};

const animationVariants = {
  A: { rotateY: [0, 360], scale: [1, 1.02, 1] },
  B: { y: [0, -10, 0] },
  C: { rotate: [0, 2, -2, 0] },
  D: { scaleX: [1, 1.03, 1] },
  E: { skewX: [0, 2, -2, 0] },
  F: { x: [0, 5, -5, 0] },
  G: { rotateX: [0, 10, 0] },
  H: { scale: [1, 1.05, 1] },
  I: { y: [0, 8, -8, 0] },
  J: { rotateY: [0, 20, 0] },
  K: { skewY: [0, 3, -3, 0] },
  L: { perspective: [800, 1200], rotateX: [0, 5, 0] },
};

const CaptainPanel = ({ team, onClose }) => {
  const gColor = groupColors[team.group] || "#667eea";
  const anim = animationVariants[team.group] || { scale: [1, 1.02, 1] };

  return (
    <AnimatePresence>
      <motion.div
        className="captain-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="captain-panel"
          initial={{ scale: 0.8, opacity: 0, y: 60, rotateX: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 60, rotateX: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          style={{ perspective: 1000 }}
        >
          <motion.div
            className="captain-glow"
            style={{ background: `radial-gradient(circle, ${gColor}22, transparent 70%)` }}
            animate={anim}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <button className="captain-close" onClick={onClose}>&times;</button>

          <div className="captain-badge" style={{ borderColor: gColor }}>
            <img src={team.flagImg} alt={team.name} className="captain-flag" loading="lazy" />
          </div>

          <h2 className="captain-team-name">{team.name}</h2>
          <div className="captain-group-tag" style={{ background: gColor }}>Group {team.group}</div>

          {team.firstTitle && (
            <div className="captain-title-badge">
              <span className="title-trophy">&#127942;</span>
              First Title: {team.firstTitle}
            </div>
          )}

          <div className="captain-divider" />

          <div className="captain-info">
            <div className="captain-avatar">
              {team.captainImg ? (
                <>
                  <img src={team.captainImg} alt={team.captain} className="captain-img" loading="lazy"
                    onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.querySelector('.captain-initials').style.display = 'flex'; }} />
                  <span className="captain-initials" style={{ display: 'none' }}>
                    {team.captain.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </>
              ) : (
                team.captain.split(" ").map((n) => n[0]).join("").slice(0, 2)
              )}
            </div>
            <div className="captain-details">
              <span className="captain-label">Captain</span>
              <span className="captain-name">{team.captain}</span>
            </div>
          </div>

          <div className="captain-meta">
            <span className="meta-item">
              <span className="meta-label">Confederation</span>
              <span className="meta-value">{team.conf}</span>
            </span>
          </div>

          <div className="squad-section">
            <div className="captain-divider" />
            <span className="captain-label squad-label">Squad ({team.squad.length})</span>
            <div className="squad-grid">
              {team.squad.map((player, i) => (
                <div key={i} className="squad-pill">
                  <span className="squad-number">{i + 1}</span>
                  {player}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CaptainPanel;
