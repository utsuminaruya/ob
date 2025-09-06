'use client';

export default function CTA() {
  return (
    <div className="mt-8 rounded-2xl border p-6 bg-gradient-to-br from-sky-50 to-blue-50 shadow">
      <h2 className="text-xl font-bold text-blue-800">無料相談・求人紹介を希望しますか？</h2>
      <p className="text-sm text-blue-700/80 mt-1">
        LINEやMessengerで、ビザ相談から学習プランまで担当者がすぐに返信します。
      </p>
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <a
          href="https://lin.ee/"
          target="_blank"
          className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          LINEで相談する
        </a>
        <a
          href="https://m.me/"
          target="_blank"
          className="inline-flex items-center justify-center rounded-xl px-5 py-3 border hover:bg-white/60"
        >
          Messengerで相談する
        </a>
      </div>
    </div>
  );
}
