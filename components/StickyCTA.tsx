// app/components/StickyCTA.tsx
import Link from "next/link";

export default function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-blue-700 text-white flex justify-center py-3 shadow-md">
      <Link href="https://lin.ee/xUocVyI" className="px-6 py-2 bg-green-600 rounded-lg font-semibold hover:bg-green-700">
        ✅ LINEで相談する
      </Link>
    </div>
  );
}
