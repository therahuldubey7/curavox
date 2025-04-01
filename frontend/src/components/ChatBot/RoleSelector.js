import React from "react";
import "./RoleSelector.css";

function RoleSelector({
  selectedRole,
  selectedSymptoms,
  onRoleSelect,
  onSymptomSelect,
}) {
  const roles = ["Patient", "Doctor", "Intern"];
  const symptoms = ["Cough", "Fever", "Headache"];

  return (
    <div className="role-selector">
      <div className="role-pills">
        {roles.map((role) => (
          <button
            key={role}
            className={`role-pill ${selectedRole === role ? "active" : ""}`}
            onClick={() => onRoleSelect(role)}
          >
            {role}
          </button>
        ))}
      </div>

      {selectedRole === "Patient" && (
        <div className="symptom-pills">
          {symptoms.map((symptom) => (
            <button
              key={symptom}
              className={`symptom-pill ${
                selectedSymptoms.includes(symptom) ? "active" : ""
              }`}
              onClick={() => onSymptomSelect(symptom)}
            >
              {symptom}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default RoleSelector;
