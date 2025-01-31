import { connectDB } from "@/lib/mongoose";
import CVE from "@/models/cve";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { cveId: string } }) {
    await connectDB();
    try {
        const cve = await CVE.findOne({ cveId: params.cveId });
        if (!cve) {
            return NextResponse.json({ error: "CVE not found" }, { status: 404 });
        }
        return NextResponse.json(cve);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
