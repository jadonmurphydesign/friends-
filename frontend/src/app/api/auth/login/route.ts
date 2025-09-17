import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const { email, password } = await req.json();

	const loginRes = await fetch('http://localhost:5271/api/account/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
	});

	if (!loginRes.ok) {
		const error = await loginRes.json();
		return NextResponse.json({ error }, { status: 401 });
	}

	const { token } = await loginRes.json();

	const response = NextResponse.json({ success: true });
	response.cookies.set('token', token, {
		httpOnly: true,
		sameSite: 'strict',
		path: '/',
		maxAge: 60 * 60 * 24 * 7,
		secure: process.env.NODE_ENV === 'production',
	});

	return response;
}
