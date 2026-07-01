import "./globals.css";

export const metadata = {
  title: "The Study-Hour Ledger",
  description:
    "An illustrative ROI calculator for how a study hour compounds into future free time.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
