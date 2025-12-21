import { contextBridge, ipcRenderer } from 'electron/renderer';
import renderUtils from './utils/index.ts';
contextBridge.exposeInMainWorld('renderUtils', renderUtils);
