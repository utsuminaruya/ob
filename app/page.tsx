export default function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-blue-700">
        Mediflow Onboarding
      </h1>
      <p className="mt-4 text-gray-600">
        こちらから始めてください
      </p>
      <a
        href="/onboarding"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
      >
        スタートする
      </a>
    </div>
  );
}
