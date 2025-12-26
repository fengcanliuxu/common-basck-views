import { ipcRenderer, webUtils } from 'electron';

const renderUtils = {
	sendMsg(topic: string, data: any) {
		return ipcRenderer.send(topic, data);
	},
	onMsg(topic: string, callback: (event: any, data: any) => void) {
		ipcRenderer.on(topic, callback);
	},
	onceMsg(topic: string, callback: (event: any, data: any) => void) {
		ipcRenderer.once(topic, callback);
	},
	invokeMsg(topic: string, callback: (event: any, data: any) => void) {
		return ipcRenderer.invoke(topic, callback);
	},
	removeAllListeners(topic: string) {
		ipcRenderer.removeAllListeners(topic);
	},
	startDrag(fileName: string) {
		ipcRenderer.invoke('ondragstart', fileName);
	},
	handleFile(file: File) {
		return webUtils.getPathForFile(file);
	},
};
export default renderUtils;
