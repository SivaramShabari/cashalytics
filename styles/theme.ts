import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
	initialColorMode: "dark",
	useSystemColorMode: true,
};

const colors = {
	// light: "#f5f5f5",
	// darkGray: "#253649",
	// lightGray: "#47688d",
	// mediumGray: "#364f6b",
	// primaryLight: "#67ced4",
	// gray: {
	// 	"50": "#EEF2F6",
	// 	"100": "#D0DBE7",
	// 	"200": "#B1C3D8",
	// 	"300": "#93ACC8",
	// 	"400": "#7495B9",
	// 	"500": "#567DA9",
	// 	"600": "#446488",
	// 	"700": "#334B66",
	// 	"800": "#223244",
	// 	"900": "#111922",
	// },
	// primary: {
	// 	"50": "#EBF9F9",
	// 	"100": "#C7EDEF",
	// 	"200": "#A3E1E5",
	// 	"300": "#80D6DB",
	// 	"400": "#5CCAD1",
	// 	"500": "#38BFC7",
	// 	"600": "#2D999F",
	// 	"700": "#227277",
	// 	"800": "#164C50",
	// 	"900": "#0B2628",
	// },
};

const theme = extendTheme({ config, colors });

export default theme;
