export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center text-center p-10">
            <h1 className="text-5xl font-bold mb-4 animate-pulse text-indigo-400">🎵 Welcome to Reverb 🎵</h1>
            <p className="max-w-xl text-lg text-gray-300">
                Reverb is your collaborative music platform. Edit, mix, and create tracks with your team — live!
            </p>
            <img src="https://cdn-icons-png.flaticon.com/512/727/727218.png" alt="Music Icon" className="w-64 mt-8 animate-bounce" />
        </div>
    );
}
