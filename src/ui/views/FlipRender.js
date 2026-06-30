export const flipRender = (initialTick, use24h = false) => {
	const makeDigit = (initial) => {
		const el = document.createElement('div');
		el.className = 'flip-unit';
		el.innerHTML = `
			<div class="panel top bg-secondary text-on-primary"><span>${initial}</span></div>
			<div class="panel bottom bg-secondary text-on-primary"><span>${initial}</span></div>
			<div class="panel flap flap-down bg-secondary text-on-primary"><span>${initial}</span></div>
			<div class="panel flap flap-up bg-secondary text-on-primary"><span>${initial}</span></div>`;

		const topS = el.querySelector('.top span');
		const botS = el.querySelector('.bottom span');
		const dnS = el.querySelector('.flap-down span');
		const upS = el.querySelector('.flap-up span');
		let current = String(initial);

		el.update = (next) => {
			next = String(next);
			if (next === current) return;
			dnS.textContent = current;
			upS.textContent = next;
			topS.textContent = next;
			botS.textContent = current;
			el.classList.remove('flipping');
			void el.offsetWidth;
			el.classList.add('flipping');
			const onEnd = (e) => {
				if (e.animationName === 'flipUp') {
					botS.textContent = next;
					el.removeEventListener('animationend', onEnd);
				}
			};
			el.addEventListener('animationend', onEnd);
			current = next;
		};
		return el;
	};

	const makeReel = (host, str) => {
		const [a, b] = String(str).padStart(2, '0').split('');
		const d0 = makeDigit(a);
		const d1 = makeDigit(b);
		host.append(d0, d1);
		return (val) => {
			const [x, y] = String(val).padStart(2, '0').split('');
			d0.update(x);
			d1.update(y);
		};
	};

	const t = initialTick.getTime();
	const city = initialTick.getCity();
	const hours0 = use24h ? t.hours24 : t.hours12;

	const root = document.createElement('div');
	root.className =
		'glass-card p-10 rounded-xl border border-outline-variant/30 group relative';
	root.dataset.city = city;

	root.innerHTML = `
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
					<span class="w-2.5 h-2.5 rounded-full bg-secondary"></span>
					<span class="font-label-caps text-label-caps text-secondary uppercase">${city}</span>
				</div>
				<div class="mt-4 p-3 rounded-lg bg-surface-container-low/50 border border-outline-variant/10 inline-block">
					<p class="text-[10px] text-on-surface-variant mb-0.5 tracking-widest font-label-caps">DATE</p>
					<p class="font-bold text-sm" data-role="date">${initialTick.getFormattedDate()}</p>
				</div>
			</div>
			<label class="inline-flex items-center cursor-pointer" data-action="toggle-format">
				<input class="sr-only peer" type="checkbox" ${use24h ? 'checked' : ''} />
				<div class="relative w-20 h-10 bg-gray-200 rounded-full peer-focus:outline-none transition-colors duration-300 peer peer-checked:bg-secondary/80">
					<div class="absolute top-1 ${use24h ? 'right' : 'left'}-1 bg-white w-8 h-8 rounded-full shadow flex items-center justify-center font-semibold text-[10px] text-gray-700">
						${use24h ? '24h' : '12h'}
					</div>
				</div>
			</label>
		</div>

		<div class="flex flex-col items-center justify-center py-4">
			<div class="flex gap-4 items-center">
				<div class="flex gap-1" data-reel="hours"></div>
				<div class="text-secondary text-4xl font-bold animate-pulse">:</div>
				<div class="flex gap-1" data-reel="minutes"></div>
				<div class="text-secondary text-4xl font-bold animate-pulse">:</div>
				<div class="flex gap-1" data-reel="seconds"></div>
				${
					use24h
						? ''
						: `
				<div class="flex items-center ml-2">
					<div class="w-20 h-28 bg-secondary text-on-primary rounded-lg flex items-center justify-center text-4xl font-bold relative overflow-hidden shadow-lg">
						<div class="absolute inset-0 border-b border-black/20 h-1/2"></div>
						<span data-role="meridiem">${t.meridiem}</span>
					</div>
				</div>`
				}
			</div>
		</div>
	`;

	const hoursReel = makeReel(root.querySelector('[data-reel="hours"]'), hours0);
	const minutesReel = makeReel(
		root.querySelector('[data-reel="minutes"]'),
		t.minutes,
	);
	const secondsReel = makeReel(
		root.querySelector('[data-reel="seconds"]'),
		t.seconds,
	);

	const dateEl = root.querySelector('[data-role="date"]');
	const meridiemEl = root.querySelector('[data-role="meridiem"]');

	const update = (tick) => {
		const tt = tick.getTime();
		hoursReel(use24h ? tt.hours24 : tt.hours12);
		minutesReel(tt.minutes);
		secondsReel(tt.seconds);
		if (dateEl) dateEl.textContent = tick.getFormattedDate();
		if (meridiemEl) meridiemEl.textContent = tt.meridiem;
	};

	return { el: root, update };
};
