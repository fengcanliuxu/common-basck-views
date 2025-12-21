import { defineStore } from 'pinia';

export interface User {
	id: number;
	name: string;
	email: string;
	role: string;
}

export const useUserStore = defineStore('user', {
	state: () => ({
		users: [
			{ id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员' },
			{ id: 2, name: '李四', email: 'lisi@example.com', role: '普通用户' },
			{ id: 3, name: '王五', email: 'wangwu@example.com', role: '普通用户' },
		] as User[],
	}),
	getters: {
		getUserList: (state) => state.users,
	},
	actions: {
		addUser(user: Omit<User, 'id'>) {
			const newUser = {
				...user,
				id: Date.now(),
			};
			this.users.push(newUser);
		},
		updateUser(id: number, user: Partial<Omit<User, 'id'>>) {
			const index = this.users.findIndex((u) => u.id === id);
			if (index !== -1 && this.users[index]) {
				const currentUser = this.users[index];
				this.users[index] = {
					id: currentUser.id,
					name: user.name ?? currentUser.name,
					email: user.email ?? currentUser.email,
					role: user.role ?? currentUser.role,
				};
			}
		},
		deleteUser(id: number) {
			this.users = this.users.filter((u) => u.id !== id);
		},
	},
});
