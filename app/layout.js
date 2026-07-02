import "./globals.css";
import { ThemeProvider } from "./theme/ThemeProvider";

export const metadata = {
  title: "The Study-Hour Ledger",
  description:
    "An illustrative, interactive ROI calculator for how a study hour compounds into future free time. Dark mode, confetti, and all.",
};

const noFlashScript = `
(function () {
  try {
    var stored = localStorage.getItem('sh-ledger-theme');
    var theme = stored === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
