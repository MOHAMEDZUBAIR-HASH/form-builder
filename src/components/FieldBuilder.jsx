import React, { useState } from "react";

const FIELD_TYPES = [
  "text",
  "number",
  "textarea",
  "date",
  "dropdown",
  "radio",
  "checkbox",
  "file",
];

export default function FieldBuilder({ onAdd, onClose }) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState("text");
  const [placeholder, setPlaceholder] = useState("");
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState([""]);

  function addOption() {
    setOptions((o) => [...o, ""]);
  }

  function updateOption(i, val) {
    setOptions((arr) => arr.map((x, idx) => (idx === i ? val : x)));
  }

  function removeOption(i) {
    setOptions((arr) => arr.filter((_, idx) => idx !== i));
  }

  function handleAdd() {
    const field = {
      id: `fld_${Date.now()}`,
      label: label || "Untitled",
      type,
      placeholder: placeholder || undefined,
      required,
      options:
        type === "dropdown" || type === "radio" || type === "checkbox"
          ? options.filter((x) => x.trim() !== "")
          : undefined,
    };
    onAdd(field);
    onClose();
  }

  return (
    <div className="modal">
      <div className="modal-card">
        <h3>Add Field</h3>
        <label>
          Label:
          <input value={label} onChange={(e) => setLabel(e.target.value)} />
        </label>

        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {FIELD_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        {type !== "file" && (
          <label>
            Placeholder:
            <input
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
            />
          </label>
        )}

        <label className="row">
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
          />
          Required
        </label>

        {(type === "dropdown" || type === "radio" || type === "checkbox") && (
          <div>
            <h4>Options</h4>
            {options.map((opt, i) => (
              <div key={i} className="option-row">
                <input
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                />
                <button className="btn small" onClick={() => removeOption(i)}>
                  Remove
                </button>
              </div>
            ))}
            <button className="btn" onClick={addOption}>
              Add Option
            </button>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn" onClick={handleAdd}>
            Add Field
          </button>
          <button className="btn ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
