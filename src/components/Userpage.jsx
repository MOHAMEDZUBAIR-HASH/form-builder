import React, { useState } from "react";
import { Link, useParams, Routes, Route, useNavigate } from "react-router-dom";
import { getForms, getFormById, saveResponse } from "../utils/storage.jsx";

export default function Userpage() {
  return (
    <Routes>
      <Route path="/" element={<FormList />} />
      <Route path=":id" element={<FormRenderer />} />
    </Routes>
  );
}

// 🔹 List all available forms
function FormList() {
  const forms = getForms();

  return (
    <div className="card">
      <h2>Available Forms</h2>
      {forms.length === 0 ? (
        <p>No forms available.</p>
      ) : (
        <ul className="form-list">
          {forms.map((f) => (
            <li key={f.id} className="form-card">
              <div>
                <strong>{f.formName}</strong>
              </div>
              <Link className="btn small" to={`/userpage/${f.id}`}>
                Open
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// 🔹 Render selected form dynamically
function FormRenderer() {
  const { id } = useParams();
  const form = getFormById(id);
  const [values, setValues] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  if (!form) return <p>Form not found.</p>;

  function handleChange(fieldId, value) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Validation
    const missing = form.fields.filter((f) => f.required && !values[f.id]);
    if (missing.length > 0) {
      alert(
        `Please fill required fields: ${missing.map((f) => f.label).join(", ")}`
      );
      return;
    }

    saveResponse(form.id, values);
    setSubmitted(true);
  }

  if (submitted)
    return (
      <div className="card">
        <h2>✅ Form Submitted Successfully!</h2>
        <button className="btn" onClick={() => navigate("/userpage")}>
          Back to Forms
        </button>
      </div>
    );

  return (
    <div className="card">
      <h2>{form.formName}</h2>
      <form onSubmit={handleSubmit}>
        {form.fields.map((fld) => (
          <div key={fld.id} className="field">
            <label>
              {fld.label} {fld.required && <span style={{ color: "red" }}>*</span>}
            </label>

            {fld.type === "text" && (
              <input
                type="text"
                placeholder={fld.placeholder}
                onChange={(e) => handleChange(fld.id, e.target.value)}
              />
            )}

            {fld.type === "number" && (
              <input
                type="number"
                placeholder={fld.placeholder}
                onChange={(e) => handleChange(fld.id, e.target.value)}
              />
            )}

            {fld.type === "textarea" && (
              <textarea
                placeholder={fld.placeholder}
                onChange={(e) => handleChange(fld.id, e.target.value)}
              />
            )}

            {fld.type === "date" && (
              <input
                type="date"
                onChange={(e) => handleChange(fld.id, e.target.value)}
              />
            )}

            {fld.type === "dropdown" && (
              <select onChange={(e) => handleChange(fld.id, e.target.value)}>
                <option value="">Select</option>
                {fld.options?.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {fld.type === "radio" &&
              fld.options?.map((opt, i) => (
                <label key={i} style={{ marginRight: "10px" }}>
                  <input
                    type="radio"
                    name={fld.id}
                    value={opt}
                    onChange={(e) => handleChange(fld.id, e.target.value)}
                  />{" "}
                  {opt}
                </label>
              ))}

            {fld.type === "checkbox" &&
              fld.options?.map((opt, i) => (
                <label key={i} style={{ marginRight: "10px" }}>
                  <input
                    type="checkbox"
                    value={opt}
                    onChange={(e) => {
                      const prev = values[fld.id] || [];
                      if (e.target.checked)
                        handleChange(fld.id, [...prev, opt]);
                      else
                        handleChange(
                          fld.id,
                          prev.filter((v) => v !== opt)
                        );
                    }}
                  />{" "}
                  {opt}
                </label>
              ))}

            {fld.type === "file" && (
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    handleChange(fld.id, reader.result);
                  };
                  reader.readAsDataURL(file);
                }}
              />
            )}
          </div>
        ))}
        <button className="btn">Submit</button>
      </form>
    </div>
  );
}


