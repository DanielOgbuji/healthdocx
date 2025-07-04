export const recordGroups = [
  { value: "clinicalRecord", label: "Clinical Records" },
  { value: "diagnosticReports", label: "Diagnostic Reports" },
  { value: "treatmentAndProcedures", label: "Treatment and Procedures" },
  { value: "prescriptionsAndMedications", label: "Prescriptions and Medications" },
  { value: "administrativeAndBilling", label: "Administrative and Billing" },
];

export const recordTypes = {
  clinicalRecord: [
    { value: "chiefComplaintsAndSymptoms", label: "Chief complaints and symptoms" },
    { value: "vitalSignsAndMeasurements", label: "Vital signs and measurements" },
    { value: "differentialDiagnoses", label: "Differential diagnoses" },
    { value: "SOAPNotes", label: "SOAP Notes (Subjective, Objective, Assessment, Plan)" },
  ],
  diagnosticReports: [
    { value: "laboratoryTests", label: "Laboratory Tests" },
    { value: "radiology", label: "Radiology" },
    { value: "pathologyReports", label: "Pathology Reports" },
  ],
  treatmentAndProcedures: [
    { value: "inpatientVsOutpatientTreatments", label: "Inpatient vs. Outpatient treatments" },
    { value: "physicalTherapyAndRehabilitationNotes", label: "Physical therapy and rehabilitation notes" },
    { value: "surgeryAndAnesthesiaRecords", label: "Surgery and anesthesia records" },
  ],
  prescriptionsAndMedications: [
    { value: "activeAndPastPrescriptions", label: "Active and past prescriptions" },
    { value: "pharmacyDispensingRecords", label: "Pharmacy dispensing records" },
    { value: "medicationAllergiesAndAdverseReactions", label: "Medication allergies and adverse reactions" },
  ],
  administrativeAndBilling: [
    { value: "insuranceClaimsAndAuthorizations", label: "Insurance claims and authorizations" },
    { value: "paymentReceiptsAndInvoices", label: "Payment receipts and invoices" },
    { value: "employeeHealthCoverageDocuments", label: "Employee health coverage documents" },
  ],
};