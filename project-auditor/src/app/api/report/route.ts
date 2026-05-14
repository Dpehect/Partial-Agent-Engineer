import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const REPORTS_DIR = path.join(process.cwd(), 'data', 'reports');

export async function POST(req: NextRequest) {
  try {
    const reportData = await req.json();
    const reportId = uuidv4();

    // Ensure directory exists
    await fs.mkdir(REPORTS_DIR, { recursive: true });

    // Save report to file
    await fs.writeFile(
      path.join(REPORTS_DIR, `${reportId}.json`),
      JSON.stringify({ id: reportId, ...reportData, createdAt: new Date() })
    );

    return NextResponse.json({ reportId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    const filePath = path.join(REPORTS_DIR, `${id}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }
}
