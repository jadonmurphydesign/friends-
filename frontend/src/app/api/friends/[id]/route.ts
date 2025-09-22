import { NextRequest, NextResponse } from 'next/server';

// prob add to a env later
const API_BASE = 'http://localhost:5271/api/friends';

export async function PUT(req: NextRequest, { params }: { params?: { id?: string } }) {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
  }
  const token = req.cookies.get('token')?.value;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const body = await req.text();
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers,
    body,
  });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const token = req.cookies.get('token')?.value;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers,
  });
  return new NextResponse(null, { status: res.status });
}
