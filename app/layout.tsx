'use client';

import Header from './components/header';

import './main.css';
import './header.css';
import './grid.css';
import './create.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}