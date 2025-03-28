// src/app/layout.js (ou .jsx)
import { Inter } from "next/font/google";
import "./globals.css";
// Optionnel: Importer des composants Header/Footer si tu les crées dans des fichiers séparés plus tard
// import Header from '@/components/Header';
// import FooterPlayer from '@/components/FooterPlayer';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tsubasa Radio App", // Change le titre
  description: "Écoutez les matchs de foot en direct", // Change la description
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr"> {/* Met la langue en français */}
      <body className={`${inter.className} flex flex-col min-h-screen`}> {/* Flexbox pour pousser le footer en bas */}

        {/* Placeholder pour l'En-tête */}
        <header className="bg-gray-800 text-white p-4">
          {/* <Header /> */} {/* Si tu crées un composant séparé */}
          <p>Mon En-tête (Header)</p>
        </header>

        {/* Contenu principal de la page */}
        <main className="flex-grow container mx-auto p-4"> {/* flex-grow pour prendre l'espace restant */}
          {children}
        </main>

        {/* Placeholder pour le Lecteur Audio Persistant en bas */}
        <footer className="bg-gray-900 text-white p-4 sticky bottom-0 z-10"> {/* sticky bottom-0 pour le fixer */}
          {/* <FooterPlayer /> */} {/* Si tu crées un composant séparé */}
          <p>Mon Lecteur Audio (Footer/Player)</p>
        </footer>

      </body>
    </html>
  );
}