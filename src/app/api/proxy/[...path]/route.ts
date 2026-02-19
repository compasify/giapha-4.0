// API proxy route — reads auth_token cookie and forwards requests to Rails with Authorization header
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const RAILS_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function proxyRequest(req: NextRequest, params: { path: string[] }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  const railsPath = params.path.join('/');
  const search = req.nextUrl.search;
  const url = `${RAILS_BASE}/api/v1/${railsPath}${search}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let body: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.text();
  }

  const res = await fetch(url, {
    method: req.method,
    headers,
    body,
  });

  const responseBody = await res.text();
  return new NextResponse(responseBody, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, await params);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, await params);
}
