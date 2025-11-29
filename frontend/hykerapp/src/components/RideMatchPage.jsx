import Navbar from "./navbar";

export default function RiderMatchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbe9f2] via-[#f7f2ff] to-[#fde4f8] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: status card */}
          <div className="bg-white/90 rounded-3xl shadow-xl px-8 py-8 md:py-10 border border-pink-100">
            <p className="text-xs uppercase tracking-[0.2em] text-[#ff3ba7] mb-2">
              Matching in progress
            </p>
            <h1 className="text-3xl font-semibold text-[#58062F] mb-3">
              Looking for the best match…
            </h1>
            <p className="text-sm text-[#58062F]/80 mb-6">
              We’re checking nearby drivers who fit your route and timing. This
              usually takes just a few moments.
            </p>

            {/* fake route summary box */}
            <div className="bg-[#fdf4fa] rounded-2xl px-4 py-3 mb-6 flex flex-col gap-2">
              <div className="flex justify-between text-xs uppercase tracking-wide text-[#58062F]/70">
                <span>Pickup</span>
                <span>Drop-off</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#58062F] truncate">
                    Your pickup location
                  </p>
                </div>
                <div className="h-px flex-1 border-t border-dashed border-[#ff8ac7]" />
                <div className="flex-1 text-right">
                  <p className="text-sm font-medium text-[#58062F] truncate">
                    Your drop-off location
                  </p>
                </div>
              </div>
            </div>

            {/* progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-[#58062F]/70 mb-1">
                <span>Finding drivers</span>
                <span>~ Few seconds…</span>
              </div>
              <div className="w-full h-2 rounded-full bg-pink-100 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#ff3ba7] to-[#ff7ac4] animate-[pulse_1.5s_ease-in-out_infinite] w-1/2 rounded-full" />
              </div>
            </div>

            {/* hint text */}
            <p className="text-xs text-[#58062F]/60">
              You can keep this page open — we’ll update as soon as a driver
              accepts your request.
            </p>
          </div>

          {/* Right: fun illustration / bubbles */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-square">
              {/* outer glow circle */}
              <div className="absolute inset-6 rounded-full bg-pink-200/40 blur-3xl" />
              {/* main circle */}
              <div className="relative w-full h-full rounded-[2.5rem] bg-gradient-to-br from-[#4B002A] via-[#6c0f46] to-[#ff3ba7] shadow-2xl flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">🚗</span>
                </div>
                <p className="text-white text-lg font-semibold">
                  Matching you with a driver…
                </p>
                <p className="text-xs text-white/80 px-8 text-center">
                  Searching within a few miles of your route to keep your trip
                  safe and affordable.
                </p>

                {/* bouncing dots */}
                <div className="flex gap-2 mt-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/90 animate-bounce" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/70 animate-[bounce_1.1s_infinite]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/60 animate-[bounce_1.2s_infinite]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}