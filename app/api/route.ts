import { connectDB } from "@/lib/mongoose";
import CVE from "@/models/cve";
import { NextResponse } from "next/server";
import axios from "axios";

const API_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";

// Fetch data from the CVE API
async function fetchAndStoreCVE(startIndex: number, resultsPerPage: number) {
    try {
        const response = await axios.get(`${API_URL}?resultsPerPage=${resultsPerPage}&startIndex=${startIndex}`);
        const cveList = response.data.vulnerabilities;
        const totalResults = response.data.totalResults;

        if (!cveList || cveList.length === 0) return { fetched: 0, totalResults };

        // Prepare bulk operations
        const bulkOps = cveList.map((item: any) => {
            const cvssV2 = item.cve.metrics?.cvssMetricV2?.[0]; // Get first element if available
            return {
                updateOne: {
                    filter: { cveId: item.cve.id },
                    update: {
                        $set: {
                            cveId: item.cve.id,
                            description: item.cve.descriptions?.[0]?.value || "No description",
                            publishedDate: item.cve.published,
                            lastModifiedDate: item.cve.lastModified,
                            baseScore: cvssV2?.cvssData?.baseScore || 0,
                            severity: cvssV2?.baseSeverity || "Unknown",
                            exploitabilityScore: cvssV2?.exploitabilityScore || 0,
                            impactScore: cvssV2?.impactScore || 0,
                            references: item.cve.references?.map((ref: any) => ref.url) || [],
                            cvssVersion: cvssV2?.cvssData?.version || "N/A",
                            cvssVector: cvssV2?.cvssData?.vectorString || "N/A",
                            cweId: item.cve.weaknesses?.map((weakness: any) => weakness.description?.[0]?.value) || [],
                            affectedProducts: item.cve.configurations?.flatMap((config: any) =>
                                config.nodes?.flatMap((node: any) =>
                                    node.cpeMatch?.map((cpe: any) => cpe.criteria) || []
                                ) || []
                            ) || [],
                        }
                    },
                    upsert: true
                }
            };
        });
        

        await CVE.bulkWrite(bulkOps);
        return { fetched: cveList.length, totalResults };
    } catch (error: any) {
        console.error("Error fetching CVE data:", error.message);
        return { fetched: 0, totalResults: 0 };
    }
}

// Fetch CVEs from MongoDB with search and filters
export async function GET(req: Request) {
    await connectDB();
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const perPage = parseInt(url.searchParams.get("perPage") || "10");
    const search = url.searchParams.get("search") || "";
    const year = url.searchParams.get("year");
    const minScore = url.searchParams.get("minScore");
    const lastModifiedDate = url.searchParams.get("lastModifiedDate")

    let filter: any = {};

    if (search) {
        filter.$or = [
            { cveId: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    if (year) {
        filter.publishedDate = { $regex: `^${year}` };
    }

    if (minScore) {
        filter.baseScore = {};
        if (minScore) filter.baseScore.$gte = parseFloat(minScore);
    }

    if (lastModifiedDate) {
        filter.lastModifiedDate = { $gte: new Date(lastModifiedDate) };
    }

    const totalCount = await CVE.countDocuments(filter);
    const skip = (page - 1) * perPage;

    // If requested page exceeds stored records, fetch from API
    if (skip >= totalCount) {
        const missingRecords = skip + perPage - totalCount;
        const startIndex = totalCount; // Fetch only missing records
        await fetchAndStoreCVE(startIndex, missingRecords);
    }

    // Fetch the updated data after syncing
    const cves = await CVE.find(filter).skip(skip).limit(perPage);
    return NextResponse.json({ cves, totalCount });
}

// Sync CVEs from NVD API
export async function POST() {
    await connectDB();
    let startIndex = 0;
    const resultsPerPage = 100;
    let totalResults = 0;

    do {
        const { fetched, totalResults: newTotal } = await fetchAndStoreCVE(startIndex, resultsPerPage);
        totalResults = newTotal;
        startIndex += resultsPerPage;
    } while (startIndex < totalResults);

    return NextResponse.json({ message: `CVE Data Synced: ${totalResults} records` });
}
