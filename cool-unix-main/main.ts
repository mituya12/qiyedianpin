import { createSSRApp } from "vue";
import { cool } from "./cool";
import App from "./App.uvue";
import "./router";

export function createApp() {
	const app = createSSRApp(App);

	cool(app);

	return {
		app
	};
}
