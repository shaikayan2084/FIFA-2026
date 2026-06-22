import { motion, AnimatePresence } from "framer-motion";

const groupColors = {
  A: "#FF6B6B", B: "#4ECDC4", C: "#45B7D1", D: "#96CEB4",
  E: "#FFEAA7", F: "#DDA0DD", G: "#98D8C8", H: "#F7DC6F",
  I: "#BB8FCE", J: "#85C1E9", K: "#F0B27A", L: "#82E0AA",
};

const CaptainPanel = ({ team, onClose }) => {
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
          initial={{ scale: 0.8, opacity: 0, y: 60 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 60 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="captain-close" onClick={onClose}>&times;</button>

          <div className="captain-badge" style={{ borderColor: groupColors[team.group] }}>
            <img src={team.flagImg} alt={team.name} className="captain-flag" />
          </div>

          <h2 className="captain-team-name">{team.name}</h2>

          <div className="captain-group-tag" style={{ background: groupColors[team.group] }}>
            Group {team.group}
          </div>

          <div className="captain-divider" />

          <div className="captain-info">
            <div className="captain-avatar">
              {team.captain.split(" ").map((n) => n[0]).join("").slice(0, 2)}
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CaptainPanel;
