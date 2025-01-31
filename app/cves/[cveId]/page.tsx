"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface CVEData {
    cveId: string;
    description: string;
    publishedDate: string;
    lastModifiedDate: string;
    baseScore?: number;
    attackVector?: string;
    attackComplexity?: string;
    privilegesRequired?: string;
    userInteraction?: string;
    impact?: string;
    exploitabilityScore?: number;
    references?: string[];
    weaknesses?: string[];
    affectedProducts?: string[];
}

export default function CVEDetails() {
    const [cve, setCVE] = useState<CVEData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { cveId } = useParams();

    useEffect(() => {
        if (cveId) {
            fetchCVEData(cveId as string);
        }
    }, [cveId]);

    const fetchCVEData = async (cveId: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/cves/${cveId}`);
            if (!res.ok) throw new Error("Failed to fetch CVE data");

            const data: CVEData = await res.json();
            setCVE(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="p-5 text-gray-500">Loading CVE details...</p>;
    if (error) return <p className="p-5 text-red-500">Error: {error}</p>;
    if (!cve) return <p className="p-5 text-gray-500">No CVE found.</p>;

    return (
        <div className="p-5 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">{cve.cveId}</h1>
            <p className="text-gray-700 mb-4"><strong>Description:</strong> {cve.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div><strong>Published:</strong> {new Date(cve.publishedDate).toLocaleDateString()}</div>
                <div><strong>Last Modified:</strong> {new Date(cve.lastModifiedDate).toLocaleDateString()}</div>
                <div><strong>Base Score:</strong> {cve.baseScore}</div>
                <div><strong>Impact:</strong> {cve.impact}</div>
                <div><strong>Attack Vector:</strong> {cve.attackVector}</div>
                <div><strong>Attack Complexity:</strong> {cve.attackComplexity}</div>
                <div><strong>Privileges Required:</strong> {cve.privilegesRequired}</div>
                <div><strong>User Interaction:</strong> {cve.userInteraction}</div>
                <div><strong>Exploitability Score:</strong> {cve.exploitabilityScore}</div>
            </div>

            <h2 className="text-xl font-semibold text-gray-700 mt-4">Weaknesses</h2>
            <ul className="list-disc ml-6 text-gray-700">
                {cve.weaknesses?.length ? cve.weaknesses.map((w, i) => <li key={i}>{w}</li>) : <p>No weaknesses listed.</p>}
            </ul>

            <h2 className="text-xl font-semibold text-gray-700 mt-4">Affected Products</h2>
            <ul className="list-disc ml-6 text-gray-700">
                {cve.affectedProducts?.length ? cve.affectedProducts.map((p, i) => <li key={i}>{p}</li>) : <p>No affected products listed.</p>}
            </ul>

            <h2 className="text-xl font-semibold text-gray-700 mt-4">References</h2>
            <ul className="list-disc ml-6 text-blue-500">
                {cve.references?.length ? cve.references.map((url, i) => (
                    <li key={i}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
                )) : <p>No references available.</p>}
            </ul>
        </div>
    );
}
