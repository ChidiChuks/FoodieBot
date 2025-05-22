import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env': {
      VITE_SUPABASE_URL: JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL),
      VITE_SUPABASE_ANON_KEY: JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      VITE_OPENAI_API_KEY: JSON.stringify(process.env.NEXT_PUBLIC_OPENAI_API_KEY)
    }
  }
}));
