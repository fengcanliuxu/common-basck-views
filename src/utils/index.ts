export const watchSize = ({ el, onResize }: { el: Element; onResize: <T extends { [key: string]: any }>(params: T) => void }) => {
	const resizeObserver = new ResizeObserver((e: ResizeObserverEntry[]) => {
		if (Array.isArray(e) && e.length > 0 && e[0]?.contentRect) {
			if (onResize && typeof onResize === 'function') {
				onResize(e[0]?.contentRect);
			}
		}
	});
	if (el) {
		resizeObserver.observe(el);
	}
};
