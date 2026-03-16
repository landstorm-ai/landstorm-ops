import './globals.css';

export const metadata = {
  title: 'Landstorm Contracting — Pipeline',
  description: 'Internal lead and bid tracking dashboard for Landstorm Contracting.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
