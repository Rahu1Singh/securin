import mongoose from "mongoose";

// Schema for the database
const CVESchema = new mongoose.Schema({
    cveId: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    publishedDate: { type: String, required: true },
    lastModifiedDate: { type: String, required: true },
    baseScore: { type: Number, required: false },
    severity: { type: String, required: false },
    exploitabilityScore: { type: Number, required: false },
    impactScore: { type: Number, required: false },
    references: { type: [String], required: false },
    cvssVersion: { type: String, required: false },
    cvssVector: { type: String, required: false },
    cweId: { type: [String], required: false },
    affectedProducts: { type: [String], required: false },
});

const CVE = mongoose.models.CVE || mongoose.model("CVE", CVESchema);
export default CVE;
