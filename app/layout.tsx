'use client';

import Header from './components/header';

import './css/main.css';
import './css/header.css';
import './css/grid.css';
import './css/create.css';

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