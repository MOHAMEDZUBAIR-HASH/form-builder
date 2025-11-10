import React from "react";
import { Link, Routes, Route, useParams } from "react-router-dom";
import { getForms, getFormById, getResponses } from "../utils/storage.jsx";

export default function ViewResponses() {
  return (
    <Routes>
      <Route path="/" element={<FormList />} />
      <Route path=":id" element={<ResponseList />} />
      <Route path=":id/:responseId" element={<ResponseDetail />} />
    </Routes>
  );
}

// 🔹 1. List all forms to choose from
function FormList() {
  const forms = getForms();

  return (
    <div className="card">
      <h2>View Form Responses</h2>
      {forms.length === 0 ? (
        <p>No forms available.</p>
      ) : (
        <ul className="form-list">
          {forms.map((f) => (
            <li key={f.id} className="form-card">
              <div>
                <strong>{f.formName}</strong>
              </div>
              <Link className="btn small" to={`/viewresponses/${f.id}`}>
                View Responses
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// 🔹 2. List all submissions for a form
function ResponseList() {
  const { id } = useParams();
  const form = getFormById(id);
  const responses = getResponses(id);

  if (!form) return <p>Form not found.</p>;

  return (
    <div className="card">
      <h2>{form.formName} — Submissions</h2>
      {responses.length === 0 ? (
        <p>No responses yet.</p>
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
            {responses.map((r) => (
              <tr key={r.responseId}>
                <td>{r.responseId}</td>
                <td>{new Date(r.date).toLocaleString()}</td>
                <td>
                  <Link className="btn small" to={`/viewresponses/${id}/${r.responseId}`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// 🔹 3. Detailed view for one submission
function ResponseDetail() {
  const { id, responseId } = useParams();
  const form = getFormById(id);
  const responses = getResponses(id);
  const response = responses.find((r) => r.responseId === responseId);

  if (!form || !response) return <p>Submission not found.</p>;

  return (
    <div className="card">
      <h2>Submission Details</h2>
      <p>
        <strong>Form:</strong> {form.formName}
      </p>
      <p>
        <strong>Response ID:</strong> {response.responseId}
      </p>
      <p>
        <strong>Date:</strong> {new Date(response.date).toLocaleString()}
      </p>
      <hr />
      <table className="response-table">
        <thead>
          <tr>
            <th>Field Label</th>
            <th>User Response</th>
          </tr>
        </thead>
        <tbody>
          {form.fields.map((fld) => (
            <tr key={fld.id}>
              <td>{fld.label}</td>
              <td>
                {Array.isArray(response.answers[fld.id])
                  ? response.answers[fld.id].join(", ")
                  : response.answers[fld.id] || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link className="btn" to={`/viewresponses/${id}`} style={{ marginTop: "20px" }}>
        ← Back to Submissions
      </Link>
    </div>
  );
}
