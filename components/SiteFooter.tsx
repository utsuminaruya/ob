export default function SiteFooter() {
    return (
      <footer className="mt-16 border-t border-sky-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-600 grid gap-2 sm:flex sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MediFlow</p>
          <nav className="flex gap-6">
            <a className="hover:underline" href="/terms">利用規約</a>
            <a className="hover:underline" href="/privacy">プライバシー</a>
            <a className="hover:underline" href="/contact">お問い合わせ</a>
          </nav>
        </div>
      </footer>
    );
  }
  