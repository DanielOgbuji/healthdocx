export const recordGroups = [
  { value: "clinical", label: "Clinical Records" },
  { value: "diagnostic", label: "Diagnostic Reports" },
  { value: "treatment", label: "Treatment and Procedures" },
  { value: "prescriptions", label: "Prescriptions and Medications" },
  { value: "administrative", label: "Administrative and Billing" },
];

export const recordTypes = {
  clinical: [
    { value: "Chief complaints and symptoms", label: "Chief complaints and symptoms" },
    { value: "Vital signs and measurements", label: "Vital signs and measurements" },
    { value: "Differential diagnoses", label: "Differential diagnoses" },
    { value: "SOAP Notes (Subjective, Objective, Assessment, Plan)", label: "SOAP Notes (Subjective, Objective, Assessment, Plan)" },
  ],
  diagnostic: [
    { value: "Laboratory Tests", label: "Laboratory Tests" },
    { value: "Radiology", label: "Radiology" },
    { value: "Pathology Reports", label: "Pathology Reports" },
  ],
  treatment: [
    { value: "Inpatient vs. Outpatient treatments", label: "Inpatient vs. Outpatient treatments" },
    { value: "Physical therapy and rehabilitation notes", label: "Physical therapy and rehabilitation notes" },
    { value: "Surgery and anesthesia records", label: "Surgery and anesthesia records" },
  ],
  prescriptions: [
    { value: "Active and past prescriptions", label: "Active and past prescriptions" },
    { value: "Pharmacy dispensing records", label: "Pharmacy dispensing records" },
    { value: "Medication allergies and adverse reactions", label: "Medication allergies and adverse reactions" },
  ],
  administrative: [
    { value: "Insurance claims and authorizations", label: "Insurance claims and authorizations" },
    { value: "Payment receipts and invoices", label: "Payment receipts and invoices" },
    { value: "Employee health coverage documents", label: "Employee health coverage documents" },
  ],
};