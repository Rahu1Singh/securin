import mongoose from "mongoose";

const CVESchema = new mongoose.Schema({
    cveId: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    publishedDate: { type: String, required: true },
    lastModifiedDate: { type: String, required: true },
    baseScore: { type: Number, required: false }, // CVSS v2 Score
    severity: { type: String, required: false }, // Example: "HIGH", "MEDIUM"
    exploitabilityScore: { type: Number, required: false },
    impactScore: { type: Number, required: false },
    references: { type: [String], required: false }, // Array of reference URLs
    cvssVersion: { type: String, required: false }, // CVSS version
    cvssVector: { type: String, required: false }, // Example: "AV:N/AC:L/Au:N/C:P/I:P/A:N"
    cweId: { type: [String], required: false }, // CWE IDs if available
    affectedProducts: { type: [String], required: false }, // List of affected software/products
});

const CVE = mongoose.models.CVE || mongoose.model("CVE", CVESchema);
export default CVE;
