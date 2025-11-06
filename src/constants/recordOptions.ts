export const recordGroups = [
  { value: "registration", label: "Registration and Check-In" },
  { value: "clinical", label: "Clinical Records" },
  { value: "diagnostic", label: "Diagnostic Reports" },
  { value: "treatment", label: "Treatment and Procedures" },
  { value: "prescription", label: "Prescriptions and Medications" },
  { value: "administrative", label: "Administrative and Billing" },
];

export const recordTypes = {
  registration: [
    { value: "scheduling_form", label: "Scheduling form" },
    { value: "referral_form", label: "Referral form" },
    { value: "patient_profile", label: "Patient profile" },
    { value: "consent_form", label: "Consent form" },
  ],
  clinical: [
    { value: "chief_complaints", label: "Chief complaints and symptoms" },
    { value: "vital_signs", label: "Vital signs and measurements" },
    { value: "differential_diagnoses", label: "Differential diagnoses" },
    { value: "soap_notes", label: "SOAP Notes (Subjective, Objective, Assessment, Plan)" },
  ],
  diagnostic: [
    { value: "laboratory_tests", label: "Laboratory tests" },
    { value: "radiology_report", label: "Radiology report" },
    { value: "pathology_report", label: "Pathology report" },
  ],
  treatment: [
    { value: "inpatient_outpatient", label: "Inpatient vs. Outpatient" },
    { value: "physical_therapy", label: "Physical therapy and rehabilitation notes" },
    { value: "surgery_anesthesia", label: "Surgery and anesthesia record" },
    { value: "discharge_note", label: "Discharge note" },
  ],
  prescription: [
    { value: "active_prescription", label: "Active and past prescription" },
    { value: "pharmacy_dispensing", label: "Pharmacy dispensing record" },
    { value: "medication_allergies", label: "Medication allergies and adverse reactions" },
  ],
  administrative: [
    { value: "insurance_claims", label: "Insurance claims and authorizations" },
    { value: "payment_receipts", label: "Payment receipts and invoices" },
    { value: "employee_health", label: "Employee health coverage documents" },
  ],
};
