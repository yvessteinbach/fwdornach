import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('authToken')?.value;

    const url = new URL(request.url);

    if (!authToken) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (url.pathname === '/') {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login/:path*'],
};