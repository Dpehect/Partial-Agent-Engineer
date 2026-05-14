import { NextRequest, NextResponse } from 'next/server';
import { auditLocalPath } from '@/lib/audit-engine';

export async function POST(req: NextRequest) {
  try {
    const { path } = await req.json();
    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const result = await auditLocalPath(path);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
