import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NextPlay AI Business Automation',
  description: 'AI-powered business automation for sales, support, and communication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
