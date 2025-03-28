// src/app/layout.js (ou .jsx)
import { Inter } from "next/font/google";
import "./globals.css";
// --- AJOUTÉ ---
import AudioPlayer from '@/components/AudioPlayer'; // Importe le lecteur
// --- FIN AJOUT ---

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tsubasa Radio App",
  description: "Écoutez les matchs de foot en direct",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} flex flex-col min-h-screen`}>

        <header className="bg-gray-800 text-white p-4">
          <p>Mon En-tête (Header)</p>
        </header>

        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>

        {/* --- MODIFIÉ : Ajout du composant AudioPlayer --- */}
        <footer className="sticky bottom-0 z-10"> {/* Enlevé bg/padding car AudioPlayer les a */}
          <AudioPlayer /> {/* Remplace le placeholder */}
        </footer>
        {/* --- FIN MODIFICATION --- */}

      </body>
    </html>
  );
}