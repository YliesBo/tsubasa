// src/app/layout.jsx
import './globals.css' // Assurez-vous que Tailwind est importé ici ou via un fichier CSS global

export const metadata = {
  title: 'Foot Radio App', // Changez le titre
  description: 'Écoutez les matchs de foot en direct',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr"> {/* Mettre la langue sur fr */}
      <body>
        {/* Placeholder pour un futur Header */}
        <header style={{ background: '#ddd', padding: '10px 0', textAlign: 'center' }}>
          HEADER (Logo, Nav...)
        </header>

        {/* Contenu principal de la page */}
        <main style={{ padding: '20px' }}>
          {children}
        </main>

        {/* Placeholder pour le futur lecteur audio persistent */}
        <footer style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: '#333', color: 'white', padding: '15px', textAlign: 'center', zIndex: 1000 }}>
          PLAYER PERSISTANT
        </footer>

        {/* Espace pour éviter que le contenu ne passe sous le footer fixe */}
        <div style={{ height: '80px' }}></div> {/* Ajustez la hauteur si besoin */}

      </body>
    </html>
  )
}