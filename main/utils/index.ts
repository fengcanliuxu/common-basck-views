import path from 'path';

export const getMimeType = (filePath: string) => {
	const ext = path.extname(filePath).toLowerCase() as any;
	const mimeMap = {
		'.mp4': 'video/mp4',
		'.mov': 'video/quicktime',
		'.mkv': 'video/x-matroska',
		'.flv': 'video/x-flv',
		'.avi': 'video/x-msvideo',
		'.wmv': 'video/x-ms-wmv',
		'.webm': 'video/webm',
		'.mpeg': 'video/mpeg',
		'.mp3': 'audio/mpeg',
		'.wav': 'audio/wav',
		'.ogg': 'audio/ogg',
	} as any;
	return mimeMap[ext] || 'application/octet-stream';
};

/**
 * 将当前链行数据转换为对象类型
 * @param arr
 */
export const transArrToTree = (arr: string[]) => {
	const res: { label: string; [key: string]: string | Record<string, unknown> } = {
		label: '',
	};
	let temp: { label: string; [key: string]: string | Record<string, unknown> } = {
		label: '',
	};
	if (arr.length === 1) {
		res.content = arr[0] as string;
	}
	arr.forEach((item: string, index: number) => {
		if (index === 0) {
			res.label = item;
			res[item] = temp;
		} else {
			if (index !== arr.length - 1) {
				temp[item] = {};
				temp.label = item;
			} else if (item.endsWith('.mp4')) {
				temp.label = item;
				temp.type = 'video';
			}
			temp = temp[item] as any;
		}
	});
	return res;
};
