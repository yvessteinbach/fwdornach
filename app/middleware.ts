import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('authToken')?.value; // Adjust based on your cookie name

    // If the user is not authenticated, redirect to the login page
    if (!authToken) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Allow the request to proceed if authenticated
    return NextResponse.next();
}

// Apply the middleware to all routes except the login page
export const config = {
    matcher: ['/(?!login).*'], // Matches all routes except /login
};