import RenderUtils from '../preload/utils/index';
declare global {
	interface Window {
		renderUtils: RenderUtils;
	}
	const renderUtils: RenderUtils;
}
