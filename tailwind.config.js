
const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		flowbite.content(),
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors:{
				customSky:"#024F8A",
				customSkyLight:"#4184b7",
			}
		}
	},
	plugins: [
		require('flowbite/plugin'),
		flowbite.plugin(),
	],
}




