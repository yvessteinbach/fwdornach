import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('authToken')?.value;

    if (!authToken) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/(?!login).*'],
};