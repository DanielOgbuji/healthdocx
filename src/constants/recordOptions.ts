export const recordGroups = [
  { value: "Reg", label: "Registration and Check-In" },
  { value: "Clin", label: "Clinical Records" },
  { value: "Diag", label: "Diagnostic Reports" },
  { value: "Trt", label: "Treatment and Procedures" },
  { value: "Pres", label: "Prescriptions and Medications" },
  { value: "Adm", label: "Administrative and Billing" },
];

export const recordTypes = {
  Reg: [
    { value: "SF", label: "Scheduling form" },
    { value: "RF", label: "Referral form" },
    { value: "PP", label: "Patient profile" },
    { value: "CF", label: "Consent form" },
  ],
  Clin: [
    { value: "CCS", label: "Chief complaints and symptoms" },
    { value: "VSM", label: "Vital signs and measurements" },
    { value: "DD", label: "Differential diagnoses" },
    { value: "SOAP", label: "SOAP Notes (Subjective, Objective, Assessment, Plan)" },
  ],
  Diag: [
    { value: "LT", label: "Laboratory tests" },
    { value: "RR", label: "Radiology report" },
    { value: "PR", label: "Pathology report" },
  ],
  Trt: [
    { value: "IO", label: "Inpatient vs. Outpatient" },
    { value: "PTR", label: "Physical therapy and rehabilitation notes" },
    { value: "SAR", label: "Surgery and anesthesia record" },
    { value: "DIS", label: "Discharge note" },
  ],
  Pres: [
    { value: "APP", label: "Active and past prescription" },
    { value: "PDR", label: "Pharmacy dispensing record" },
    { value: "MAR", label: "Medication allergies and adverse reactions" },
  ],
  Adm: [
    { value: "ICA", label: "Insurance claims and authorizations" },
    { value: "PRI", label: "Payment receipts and invoices" },
    { value: "EHCD", label: "Employee health coverage documents" },
  ],
};