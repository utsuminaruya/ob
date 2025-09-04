import Link from "next/link";

export default function CTA() {
  return (
    <div className="bg-blue-50 border-t border-blue-200 py-12 mt-12 text-center rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        次のステップに進みましょう！
      </h2>
      <p className="mb-6 text-gray-700">
        LINEやMessengerで求人・学習サポート・生活情報を無料で受け取れます。
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="https://lin.ee/xUocVyI"
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition"
        >
          📲 LINEで登録する
        </Link>
        <Link
          href="https://www.facebook.com/MediflowKK"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          💬 Messengerで相談する
        </Link>
      </div>
    </div>
  );
}
