import { NextRequest, NextResponse } from 'next/server';

// set env variable later
const API_BASE = 'http://localhost:5271/api/friends';

async function forwardRequest(req: NextRequest, method: string, id?: string) {
  const url = id ? `${API_BASE}/${id}` : API_BASE;
  const token = req.cookies.get('token')?.value;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
        console.log("hello: ", token)
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('Authorization header:', headers['Authorization']);

  const body = method === 'GET' || method === 'DELETE' ? undefined : await req.text();

  const res = await fetch(url, {
    method,
    headers,
    body,
  });

  const data = res.status === 204 ? null : await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function GET(req: NextRequest) {
  return forwardRequest(req, 'GET');
}

export async function POST(req: NextRequest) {
  return forwardRequest(req, 'POST');
}
