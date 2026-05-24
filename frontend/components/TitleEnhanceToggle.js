"use client";

export function TitleEnhanceToggle({ value, onChange }) {
  const handleToggle = () => onChange(!value);

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      onClick={handleToggle}
      onKeyDown={handleKey}
      role="button"
      tabIndex={0}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
    >
      <div>
        <strong style={{ fontSize: 15 }}>Enable title enhancement</strong>
        <div className="muted" style={{ fontSize: 13 }}>Improve product titles using AI during processing</div>
      </div>

      <label style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
        <input
          aria-label="Enable title enhancement"
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(Boolean(e.target.checked))}
          style={{ display: "none" }}
        />
        <span
          role="switch"
          aria-checked={Boolean(value)}
          style={{
            width: 54,
            height: 30,
            background: value ? "linear-gradient(90deg,#7c3aed,#4f46e5)" : "#e6e9ef",
            borderRadius: 9999,
            padding: 4,
            display: "inline-flex",
            alignItems: "center",
            transition: "background 150ms"
          }}
        >
          <span
            style={{
              width: 22,
              height: 22,
              background: "white",
              borderRadius: 9999,
              transform: value ? "translateX(24px)" : "translateX(0px)",
              transition: "transform 150ms",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)"
            }}
          />
        </span>
      </label>
    </div>
  );
}
