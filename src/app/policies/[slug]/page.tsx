import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Home } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getHomeContentSettings } from '@/lib/siteSettings';

// slug -> { site_settings key, page title }. The text itself lives in the
// database (editable in admin → Home Customization → Home Text → Policy Pages).
const POLICIES: Record<string, { key: string; title: string }> = {
  shipping: { key: 'policy_shipping', title: 'Shipping & Handling' },
  returns: { key: 'policy_returns', title: 'Returns & Exchanges' },
  privacy: { key: 'policy_privacy', title: 'Privacy Policy' },
  terms: { key: 'policy_terms', title: 'Terms of Service' },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  return { title: policy ? `${policy.title} | Al Hareer` : 'Al Hareer' };
}

// "## Heading" starts a section; blank lines separate paragraphs; "- " lines are bullets.
function renderBody(text: string) {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, i) => {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      const heading = lines[0].startsWith('## ') ? lines.shift()!.slice(3) : null;
      const bullets = lines.length > 0 && lines.every((l) => l.startsWith('- '));
      return (
        <section key={i} className="space-y-2">
          {heading && <h2 className="font-heading text-lg sm:text-xl font-bold text-[#00303A]">{heading}</h2>}
          {bullets ? (
            <ul className="list-disc list-inside space-y-1 text-sm text-[#024F5F]">
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          ) : (
            lines.length > 0 && <p className="text-sm text-[#024F5F] leading-relaxed whitespace-pre-line">{lines.join('\n')}</p>
          )}
        </section>
      );
    });
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();

  const settings = await getHomeContentSettings();
  const text = (settings[policy.key] ?? '').trim();
  if (!text) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1EC] text-[#00303A]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#024F5F] mb-5">
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-[#00303A] transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span className="text-[#CFAC64] font-light">&gt;</span>
          <span className="font-semibold text-[#00303A]">{policy.title}</span>
        </nav>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#00303A] tracking-tight mb-8">{policy.title}</h1>

        <div className="bg-white rounded-2xl border border-[#CFAC64] p-5 sm:p-8 space-y-6">{renderBody(text)}</div>
      </main>

      <Footer />
    </div>
  );
}
