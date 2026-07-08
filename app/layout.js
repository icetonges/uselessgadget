import "./globals.css";
import { ThemeProvider } from "./theme/ThemeProvider";
import NavBar from "./components/NavBar";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <NavBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
