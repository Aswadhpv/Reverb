export default function AboutPage() {
    return (
        <div className="flex flex-col items-center justify-center text-center p-10">
            <h1 className="text-4xl font-bold mb-4">About Reverb</h1>
            <p className="max-w-xl text-lg text-gray-300">
                Reverb lets musicians collaborate in real-time with audio plugins, sessions, and live mixing tools. Built for creatives like you!
            </p>
            <img src="https://images.unsplash.com/photo-1511376777868-611b54f68947" alt="Studio" className="w-full max-w-lg mt-8 rounded shadow-lg" />
        </div>
    );
}
