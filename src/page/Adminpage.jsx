import React, { useState } from "react";
import FieldBuilder from "../components/FieldBuilder";
import {
  getForms,
  createEmptyForm,
  saveForm,
  deleteForm,
  getResponses,
  getFormById,
} from "../utils/storage.jsx";

export default function Adminpage() {
  const [forms, setForms] = useState(getForms());
  const [formName, setFormName] = useState("");
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewResponsesFor, setViewResponsesFor] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);

  function refresh() {
    setForms(getForms());
  }

  function handleCreate() {
    if (!formName.trim()) return alert("Enter form name");
    const newForm = createEmptyForm(formName.trim());
    saveForm(newForm);
    setFormName("");
    refresh();
  }

  function handleEdit(form) {
    setEditing(form);
    setViewResponsesFor(null);
    setSelectedResponse(null);
  }

  function handleSave() {
    saveForm(editing);
    setEditing(null);
    refresh();
  }

  function addField(field) {
    setEditing((prev) => ({
      ...prev,
      fields: [...(prev.fields || []), field],
    }));
  }

  function removeField(index) {
    setEditing((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  }

  function handleDelete(id) {
    if (!confirm("Delete this form?")) return;
    deleteForm(id);
    refresh();
  }

  function handleViewResponses(formId) {
    setEditing(null);
    setViewResponsesFor(formId);
    setSelectedResponse(null);
  }

  const formResponses = viewResponsesFor ? getResponses(viewResponsesFor) : [];
  const formData = viewResponsesFor ? getFormById(viewResponsesFor) : null;

  return (
    <div>
      {/* Create New Form */}
      <section className="card">
        <h2>Create New Form</h2>
        <div className="row">
          <input
            placeholder="Enter form name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <button className="btn" onClick={handleCreate}>
            Create
          </button>
        </div>
      </section>

      {/* Saved Forms */}
      <section className="card">
        <h2>Saved Forms</h2>
        {forms.length === 0 && <p>No forms yet</p>}
        <ul className="form-list">
          {forms.map((f) => (
            <li key={f.id} className="form-card">
              <div>
                <strong>{f.formName}</strong>
                <div className="meta">{f.fields?.length || 0} fields</div>
              </div>
              <div>
                <button className="btn small" onClick={() => handleEdit(f)}>
                  Edit
                </button>
                <button
                  className="btn small"
                  onClick={() => handleViewResponses(f.id)}
                >
                  View Responses
                </button>
                <button
                  className="btn small danger"
                  onClick={() => handleDelete(f.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Editing Form */}
      {editing && (
        <section className="card">
          <h2>Editing: {editing.formName}</h2>
          <div className="row">
            <input
              value={editing.formName}
              onChange={(e) =>
                setEditing({ ...editing, formName: e.target.value })
              }
            />
            <button className="btn" onClick={() => setShowModal(true)}>
              Add Field
            </button>
            <button className="btn" onClick={handleSave}>
              Save Form
            </button>
            <button className="btn ghost" onClick={() => setEditing(null)}>
              Close
            </button>
          </div>

          <ul className="fields-list">
            {editing.fields.map((fld, i) => (
              <li key={fld.id} className="field-item">
                <div>
                  <strong>{fld.label}</strong> ({fld.type})
                  {fld.required && <span className="badge">Required</span>}
                  {fld.options && (
                    <div className="opts">{fld.options.join(", ")}</div>
                  )}
                </div>
                <button
                  className="btn small danger"
                  onClick={() => removeField(i)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* View Responses */}
      {viewResponsesFor && formData && (
        <section className="card">
          <h2>Responses for {formData.formName}</h2>

          {formResponses.length === 0 ? (
            <p>No responses yet.</p>
          ) : selectedResponse ? (
            <div>
              <h3>Submission ID: {selectedResponse.responseId}</h3>
              <p>Date: {new Date(selectedResponse.date).toLocaleString()}</p>
              <table className="response-table">
                <thead>
                  <tr>
                    <th>Field Label</th>
                    <th>User Response</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.fields.map((fld) => (
                    <tr key={fld.id}>
                      <td>{fld.label}</td>
                      <td>
                        {fld.type === "file" &&
                        selectedResponse.answers[fld.id] ? (
                          <a
                            href={selectedResponse.answers[fld.id]}
                            download={fld.label}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#2563eb" }}
                          >
                            Download File
                          </a>
                        ) : Array.isArray(
                            selectedResponse.answers[fld.id]
                          ) ? (
                          selectedResponse.answers[fld.id].join(", ")
                        ) : (
                          selectedResponse.answers[fld.id] || "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                className="btn ghost"
                onClick={() => setSelectedResponse(null)}
              >
                Back to Submissions
              </button>
            </div>
          ) : (
            <table className="response-table">
              <thead>
                <tr>
                  <th>Submission ID</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formResponses.map((r) => (
                  <tr key={r.responseId}>
                    <td>{r.responseId}</td>
                    <td>{new Date(r.date).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn small"
                        onClick={() => setSelectedResponse(r)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button
            className="btn ghost"
            style={{ marginTop: "15px" }}
            onClick={() => setViewResponsesFor(null)}
          >
            Back to Forms
          </button>
        </section>
      )}

      {showModal && (
        <FieldBuilder onAdd={addField} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
