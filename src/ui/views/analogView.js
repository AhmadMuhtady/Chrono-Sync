export const analogRender = (tick) => {
	const { hours12, minutes, seconds, milliseconds } = tick.getTime();
	const city = tick.getCity();

	const h = Number(hours12);
	const m = Number(minutes);
	const s = Number(seconds);
	const ms = Number(milliseconds);

	const exactSeconds = s + ms / 1000;
	const secondDeg = exactSeconds * 6;
	const minuteDeg = m * 6 + exactSeconds * 0.1;
	const hourDeg = (h % 12) * 30 + m * 0.5;

	const analogHTML = `
<div
    class="glass-card p-10 rounded-xl border border-outline-variant/30 group relative"
    id="analog-clock"
>
    <button
        type="button"
        data-action="delete"
        aria-label="Remove ${city} clock"
        class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-error text-on-error shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
    </button>
    <div class="flex justify-between items-start mb-6">
						<div>
							<div class="flex items-center gap-2 mb-1">
								<span
									class="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"
								></span>
								<span
									class="font-label-caps text-label-caps text-primary uppercase"
									>${city}</span
								>
							</div>
							<div
								class="mt-4 p-3 rounded-lg bg-surface-container-low/50 border border-outline-variant/10 inline-block"
							>
								<p
									class="text-[10px] text-on-surface-variant mb-0.5 tracking-widest font-label-caps"
								>
									DATE
								</p>
								<p class="font-bold text-sm">${tick.getFormattedDate()}</p>
							</div>
						</div>
						<label class="inline-flex items-center cursor-pointer">
							<input class="sr-only peer" type="checkbox" />
						</label>
					</div>
					<div class="flex flex-col items-center justify-center py-4">
						<div
							class="relative w-64 h-64 flex items-center justify-center rounded-full"
						>
							<!-- Outer Ring / Depth -->
							<div
								class="absolute inset-0 rounded-full border-4 border-primary/10 bg-gradient-to-b from-white/50 to-transparent shadow-inner"
							></div>
							<!-- Refined Markers -->
							<div
								class="absolute inset-2 rounded-full border border-primary/5"
							></div>
							<div class="absolute inset-0 p-2">
								<div class="relative w-full h-full">
									<!-- Hour Markers (1-12) -->
									<div class="absolute inset-0 flex justify-center items-start">
										<div
											class="w-1.5 h-4 bg-primary rounded-full shadow-sm"
										></div>
									</div>
									<div
										class="absolute inset-0 flex justify-center items-start rotate-[30deg]"
									>
										<div class="w-0.5 h-2 bg-primary/30 rounded-full"></div>
									</div>
									<div
										class="absolute inset-0 flex justify-center items-start rotate-[60deg]"
									>
										<div class="w-0.5 h-2 bg-primary/30 rounded-full"></div>
									</div>
									<div
										class="absolute inset-0 flex justify-center items-start rotate-[90deg]"
									>
										<div
											class="w-1.5 h-4 bg-primary rounded-full shadow-sm"
										></div>
									</div>
									<div
										class="absolute inset-0 flex justify-center items-start rotate-[120deg]"
									>
										<div class="w-0.5 h-2 bg-primary/30 rounded-full"></div>
									</div>
									<div
										class="absolute inset-0 flex justify-center items-start rotate-[150deg]"
									>
										<div class="w-0.5 h-2 bg-primary/30 rounded-full"></div>
									</div>
									<div
										class="absolute inset-0 flex justify-center items-start rotate-[180deg]"
									>
										<div
											class="w-1.5 h-4 bg-primary rounded-full shadow-sm"
										></div>
									</div>
									<div
										class="absolute inset-0 flex justify-center items-start rotate-[210deg]"
									>
										<div class="w-0.5 h-2 bg-primary/30 rounded-full"></div>
									</div>
									<div
										class="absolute inset-0 flex justify-center items-start rotate-[240deg]"
									>
										<div class="w-0.5 h-2 bg-primary/30 rounded-full"></div>
									</div>
									<div
										class="absolute inset-0 flex justify-center items-start rotate-[270deg]"
									>
										<div
											class="w-1.5 h-4 bg-primary rounded-full shadow-sm"
										></div>
									</div>
									<div
										class="absolute inset-0 flex justify-center items-start rotate-[300deg]"
									>
										<div class="w-0.5 h-2 bg-primary/30 rounded-full"></div>
									</div>
									<div
										class="absolute inset-0 flex justify-center items-start rotate-[330deg]"
									>
										<div class="w-0.5 h-2 bg-primary/30 rounded-full"></div>
									</div>
								</div>
							</div>
							<!-- Elegant 12 Marker -->
							<div class="absolute top-6 flex flex-col items-center">
								<span
									class="font-label-caps text-primary font-bold text-[12px] tracking-widest"
									>12</span
								>
							</div>
							<div
								class="absolute right-6 top-1/2 -translate-y-1/2 flex items-center"
							>
								<span
									class="font-label-caps text-primary font-bold text-[12px] tracking-widest"
									>3</span
								>
							</div>
							<div
								class="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center"
							>
								<span
									class="font-label-caps text-primary font-bold text-[12px] tracking-widest"
									>6</span
								>
							</div>
							<div
								class="absolute left-6 top-1/2 -translate-y-1/2 flex items-center"
							>
								<span
									class="font-label-caps text-primary font-bold text-[12px] tracking-widest"
									>9</span
								>
							</div>
						<!-- Hour Hand -->
<div 
    style="transform: translateX(-50%) rotate(${hourDeg}deg);" 
    class="absolute bottom-1/2 left-1/2 w-2 h-20 bg-primary rounded-t-full origin-bottom shadow-lg">
</div>

<!-- Minute Hand -->
<div 
    style="transform: translateX(-50%) rotate(${minuteDeg}deg);" 
    class="absolute bottom-1/2 left-1/2 w-1.5 h-24 bg-secondary rounded-t-full origin-bottom shadow-md">
</div>

<!-- Second Hand -->
<div 
    style="transform: translateX(-50%) rotate(${secondDeg}deg);" 
    class="absolute bottom-1/2 left-1/2 w-0.5 h-28 bg-tertiary rounded-full origin-bottom">
</div>

<!-- Polished Center Pin (Placed after hands to hide their overlapping seams) -->
<div class="absolute w-4 h-4 bg-white border-2 border-on-surface rounded-full z-10 shadow-md flex items-center justify-center">
    <div class="w-1.5 h-1.5 bg-on-surface rounded-full"></div>
</div>

						</div>
					</div>
				</div>
    `;

	return analogHTML;
};
