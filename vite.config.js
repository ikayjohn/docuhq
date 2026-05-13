import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        itinerary: resolve(__dirname, "itinerary/index.html"),
        receivedMail: resolve(__dirname, "received-mail/index.html"),
        creditReport: resolve(__dirname, "credit-report/index.html"),
        cryptoWallet: resolve(__dirname, "crypto-wallet/index.html"),
        inkStamp: resolve(__dirname, "ink-stamp/index.html")
      }
    }
  }
});
