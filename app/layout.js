import App from "./App";
import "./globals.css";

export const metadata = {
  title: "Excel.codes",
  description: "EMS website and (maybe) much more.",
  manifest: "./manifest.json",
  icons: { apple: "/icon.png" },
  themeColor: "#fff"
};

export default function RootLayout({ children }) {
  return <App>{children}</App>
}
