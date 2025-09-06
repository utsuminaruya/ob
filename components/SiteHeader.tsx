export default function SiteHeader() {
    return (
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-sky-100">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-sky-600" />
            <span className="font-semibold text-sky-900">MediFlow</span>
          </div>
          <a
            href="/onboarding"
            className="inline-flex items-center rounded-xl px-4 py-2 text-white bg-sky-600 hover:bg-sky-700 transition"
          >
            はじめる
          </a>
        </div>
      </header>
    );
  }
  