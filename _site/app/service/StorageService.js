class StorageService {
	set(key, value) {
		window.localStorage.setItem(key, value);
	}
	get(key) {
		return window.localStorage.getItem(key);
	}
}
export const storageService = new StorageService();