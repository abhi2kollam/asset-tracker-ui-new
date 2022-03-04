import axios from "axios";
export default class SettingsService {
	getSpecificSettingList(id: string) {
		return axios
			.get(`/api/inventory-settings/get-list/${id}`)
			.then((res) => res.data)
			.catch((d) => d.data);
	}

	getSpecificSetting(id: string) {
		return axios
			.get(`/api/inventory-settings/get/${id}`)
			.then((res) => res.data)
			.catch((d) => d.data);
	}

	getSettingsList() {
		return axios
			.get("/api/inventory-settings/list")
			.then((res) => res.data)
			.catch((d) => d.data);
	}
	getFontIcons() {
		return axios
			.get("data/font-icons.json")
			.then((res) => res.data)
			.catch((d) => d.data);
	}
	saveSettings(setting:any) {
		return axios
			.post("/api/inventory-settings/save", setting)
			.then((res) => res.data)
			.catch((d) => d.data);
	}
}
