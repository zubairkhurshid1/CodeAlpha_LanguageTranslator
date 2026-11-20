export default function LanguageSelector({
  languages,
  value,
  onChange,
  includeAuto = false,
  label,
  disabled,
}) {
  return (
    <div className="language-selector">
      {label && <label className="selector-label">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label={label}
        className="language-select"
      >
        {includeAuto && (
          <option value="auto">Detect Language 🔍</option>
        )}
        {languages.map(({ language, name }) => (
          <option key={language} value={language}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
