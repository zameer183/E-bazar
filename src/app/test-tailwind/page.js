export default function TestTailwindPage() {
  return (
    <div className="min-h-screen bg-bazar-background flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-bazar-primary mb-4">Tailwind CSS Test</h1>
      <p className="text-lg text-bazar-text mb-8">If you can see this styled text, Tailwind CSS is working!</p>
      <div className="bg-white p-6 rounded-lg shadow-bazar-card">
        <h2 className="text-2xl font-semibold text-bazar-accent mb-2">Test Card</h2>
        <p className="text-bazar-text">This card should have a shadow and padding.</p>
      </div>
      <button className="mt-8 bg-bazar-gradient text-white font-semibold py-3 px-6 rounded-full hover:shadow-bazar-hover transition duration-300">
        Test Button
      </button>
    </div>
  );
}