export default class FormManager {
	constructor(eventBus) {
		this.eventBus = eventBus;
		this.overlay = null;
		this.handleKeydown = null;
	}

	open() {
		const zones = Intl.supportedValuesOf('timeZone');
		const zoneOptions = zones
			.map((z) => `<option value="${z}">${z.replaceAll('_', ' ')}</option>`)
			.join('');

		this.overlay = document.createElement('div');
		this.overlay.className =
			'fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm';

		this.overlay.innerHTML = `
			<div class="glass-card w-full max-w-md p-8 rounded-xl border border-outline-variant/30 shadow-2xl">
				<h2 class="font-label-caps text-primary uppercase tracking-widest text-sm mb-6">Add Clock</h2>
				<form class="flex flex-col gap-5">
					<label class="flex flex-col gap-1.5">
						<span class="text-[10px] text-on-surface-variant tracking-widest font-label-caps uppercase">Time Zone</span>
						<select name="timezone" required
							class="w-full p-3 rounded-lg bg-surface-container-low/50 border border-outline-variant/30 text-sm focus:outline-none focus:border-primary">
							<option value="" disabled selected>Select a timezone…</option>
							${zoneOptions}
						</select>
					</label>

					<label class="flex flex-col gap-1.5">
						<span class="text-[10px] text-on-surface-variant tracking-widest font-label-caps uppercase">Clock Type</span>
						<select name="type"
							class="w-full p-3 rounded-lg bg-surface-container-low/50 border border-outline-variant/30 text-sm focus:outline-none focus:border-primary">
							<option value="digital">Digital</option>
							<option value="analog">Analog</option>
							<option value="flip">Flip</option>
						</select>
					</label>

					<div class="flex justify-end gap-3 mt-2">
						<button type="button" data-action="cancel"
							class="px-5 py-2.5 rounded-lg border border-outline-variant/40 text-sm font-semibold hover:bg-surface-container-low/50 transition-colors">
							Cancel
						</button>
						<button type="submit"
							class="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold shadow hover:scale-105 transition-transform">
							Add
						</button>
					</div>
				</form>
			</div>
		`;

		this.overlay.addEventListener('click', this.onOverlayClick.bind(this));
		this.overlay
			.querySelector('form')
			.addEventListener('submit', this.onSubmit.bind(this));

		this.handleKeydown = this.onKeydown.bind(this);
		document.addEventListener('keydown', this.handleKeydown);

		document.body.appendChild(this.overlay);
	}

	close() {
		document.removeEventListener('keydown', this.handleKeydown);
		this.overlay?.remove();
		this.overlay = null;
		this.handleKeydown = null;
	}

	onOverlayClick(e) {
		if (e.target === this.overlay) return this.close();
		if (e.target.closest('[data-action="cancel"]')) this.close();
	}

	onKeydown(e) {
		if (e.key === 'Escape') this.close();
	}

	onSubmit(e) {
		e.preventDefault();
		const { timezone, type } = e.currentTarget.elements;
		if (!timezone.value) return;
		this.eventBus.emit('clock:add', {
			tz: timezone.value,
			type: type.value,
		});
		this.close();
	}
}
