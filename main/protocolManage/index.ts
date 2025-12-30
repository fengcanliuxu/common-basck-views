import { protocol } from 'electron';
import { Readable } from 'stream';
import fs from 'node:fs';
import { getMimeType } from '../utils';
import path from 'node:path';
class ProtocolManage {
	constructor() {
		this.registerVideo();
	}

	registerVideo() {
		protocol.registerSchemesAsPrivileged([
			{
				scheme: 'atom',
				privileges: {
					standard: true,
					secure: true,
					stream: true,
					supportFetchAPI: true,
					bypassCSP: true, // 新增：绕过内容安全策略，避免播放时报CSP错误
				},
			},
		]);
	}

	handleVideo() {
		protocol.handle('atom', async (request) => {
			try {
				// ===== 步骤1：安全解析并处理文件路径 =====
				const url = request.url.trim();
				if (!url.startsWith('atom://')) {
					return new Response('Invalid atom protocol', { status: 400 });
				}
				// 移除协议头 + 解码 + 归一化路径
				let filePath = decodeURIComponent(url.slice(7));
				filePath = path.normalize(filePath); // 关键：统一路径分隔符

				// Windows专属：盘符大写处理，Mac/Linux跳过
				if (process.platform === 'win32' && filePath.length >= 2) {
					const firstChar = filePath[0];
					const secondChar = filePath[1];
					if (/^[a-z]$/.test(firstChar!) && secondChar === ':') {
						filePath = firstChar!.toUpperCase() + filePath.slice(1);
					} else {
						filePath = firstChar!.toUpperCase() + ':' + filePath.slice(1);
					}
				}
				// ===== 步骤2：验证文件是否存在并获取文件信息 =====
				const stats = await fs.statSync(filePath);
				if (!stats.isFile()) {
					return new Response('Not a file', { status: 400 });
				}
				const fileSize = stats.size;
				const mimeType = getMimeType(filePath);

				// ===== 步骤3：核心处理 - 解析 Range 字节范围请求 =====
				let start = 0;
				let end = fileSize - 1;
				const rangeHeader = request.headers.get('range');

				if (rangeHeader) {
					// 匹配 Range: bytes=xxx-yyy 格式
					const match = rangeHeader.match(/^bytes=(\d+)-(\d*)$/);
					if (match) {
						start = parseInt(match[1]!, 10);
						end = match[2] ? parseInt(match[2], 10) : fileSize - 1;
						// 边界处理：防止超出文件大小
						end = Math.min(end, fileSize - 1);
						start = Math.max(start, 0);
					}
				}
				const chunkSize = end - start + 1;

				// ===== 步骤4：创建文件读取流（分片读取，性能最优） =====
				const fileStream = fs.createReadStream(filePath, { start, end });
				// 将Node流转为Web标准流（Electron协议要求返回Web Stream）
				const webStream = Readable.toWeb(fileStream) as any;

				// ===== 步骤5：设置完整的视频播放响应头 =====
				const headers = new Headers();
				headers.set('Content-Type', mimeType); // 核心：视频MIME类型
				headers.set('Content-Length', chunkSize.toString());
				headers.set('Accept-Ranges', 'bytes'); // 声明支持范围请求
				headers.set('Content-Range', `bytes ${start}-${end}/${fileSize}`); // 关键：返回实际的字节范围
				// 跨域+兼容头（补全所有缺失项）
				headers.set('Access-Control-Allow-Origin', '*');
				headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
				headers.set('Access-Control-Allow-Headers', '*');
				headers.set('Access-Control-Expose-Headers', '*');
				headers.set('Cache-Control', 'no-cache, no-store, must-revalidate'); // 避免缓存导致的播放异常

				// ===== 步骤6：返回响应 - 分段请求返回206，完整请求返回200 =====
				const status = rangeHeader ? 206 : 200;
				return new Response(webStream, { status, headers });
			} catch (error: any) {
				// ===== 完整的异常捕获，优雅降级，永不崩溃 =====
				console.error('Atom协议处理错误:', error.message, error.path);
				// 根据错误类型返回对应状态码
				if (error.code === 'ENOENT') {
					return new Response('File not found', { status: 404 });
				} else if (error.code === 'EACCES') {
					return new Response('Permission denied', { status: 403 });
				} else {
					return new Response('Internal server error', { status: 500 });
				}
			}
		});
	}
}

export default ProtocolManage;
