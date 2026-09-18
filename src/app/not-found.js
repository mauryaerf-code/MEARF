import Link from 'next/link';

export const metadata = {
  title: "404 - Page Not Found | Maurya Education and Research Foundation",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <section className="section text-center" style={{ padding: '120px 20px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1 style={{ fontSize: '4.5rem', color: 'var(--primary)', marginBottom: '10px', fontWeight: '800' }}>404</h1>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '15px', color: 'var(--primary-dark)' }}>Page Not Found</h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '30px', lineHeight: '1.7' }}>
          The page you are looking for might have been moved, removed, or is temporarily unavailable.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            <i className="fas fa-home" style={{ marginRight: '8px' }}></i> Return to Homepage
          </Link>
          <Link href="/journals" className="btn btn-outline">
            <i className="fas fa-book" style={{ marginRight: '8px' }}></i> Browse Journals
          </Link>
        </div>
      </div>
    </section>
  );
}
