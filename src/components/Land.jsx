import React from "react";
import { Link } from "react-router-dom";

const Land = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Dynamic Form Builder</h1>
      <p>Select a role to continue:</p>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        <Link
          to="/adminpage"
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Admin Login
        </Link>

        <Link
          to="/userpage"
          style={{
            border: "2px solid #2563eb",
            color: "#2563eb",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          User Login
        </Link>

        <Link
          to="/viewresponses"
          style={{
            backgroundColor: "#16a34a",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
            view response
          
        </Link>
      </div>
    </div>
  );
};

export default Land;
