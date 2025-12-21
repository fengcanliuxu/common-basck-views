import { ipcRenderer } from 'electron';

const renderUtils = {
	sendMsg(topic: string, data: any) {
		ipcRenderer.send(topic, data);
	},
	onMsg(topic: string, callback: (event: any, data: any) => void) {
		ipcRenderer.on(topic, callback);
	},
	onceMsg(topic: string, callback: (event: any, data: any) => void) {
		ipcRenderer.once(topic, callback);
	},
	removeAllListeners(topic: string) {
		ipcRenderer.removeAllListeners(topic);
	}
}
export default renderUtils;
