"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
    const [cves, setCVEs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchID, setSearchID] = useState("");
    const [minBaseScore, setMinBaseScore] = useState("");

    useEffect(() => {
        fetchData();
    }, [page, perPage, searchID, minBaseScore]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                perPage: perPage.toString(),
                search: searchID,
                minScore: minBaseScore,
            }).toString();

            const res = await fetch(`/api?${query}`);
            const data = await res.json();
            setCVEs(data.cves);
            setTotalCount(data.totalCount);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const totalPages = Math.ceil(totalCount / perPage);

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">CVE List</h1>

            <div className="mb-4 flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search by CVE ID or Description"
                    value={searchID}
                    onChange={(e) => setSearchID(e.target.value)}
                    className="border p-2 w-64"
                />
                <input
                    type="number"
                    placeholder="Min Base Score"
                    value={minBaseScore}
                    onChange={(e) => setMinBaseScore(e.target.value)}
                    className="border p-2 w-40"
                />
            </div>

            {loading ? <p>Loading...</p> : (
                <>
                    <table className="table-auto w-full border-collapse border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">CVE ID</th>
                                <th className="border p-2">Description</th>
                                <th className="border p-2">Base Score</th>
                                <th className="border p-2">Published Date</th>
                                <th className="border p-2">Last Modified Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cves.map((cve: any) => (
                                <tr key={cve.cveId} className="border">
                                    <td className="border p-2">
                                        <Link href={`/cves/${cve.cveId}`} className="underline text-blue-800">{cve.cveId}</Link>
                                    </td>
                                    <td className="border p-2">{cve.description}</td>
                                    <td className="border p-2">{cve.baseScore}</td>
                                    <td className="border p-2">{new Date(cve.publishedDate).toLocaleDateString()}</td>
                                    <td className="border p-2">{new Date(cve.lastModifiedDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <label>Results Per Page:</label>
                            <select 
                                value={perPage} 
                                onChange={(e) => setPerPage(parseInt(e.target.value))}
                                className="ml-2 border p-1"
                            >
                                <option value="10">10</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className="p-2 bg-gray-200 rounded disabled:opacity-50">
                                Prev
                            </button>
                            <span className="mx-2">{page} of {totalPages}</span>
                            <button onClick={() => setPage((prev) => prev + 1)} className="p-2 bg-gray-200 rounded disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
