import '@fontsource/inter';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body style={{
        fontFamily: 'Inter, sans-serif',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        minHeight: '100vh',
      }}>
        {children}
      </body>
    </html>
  )
}
