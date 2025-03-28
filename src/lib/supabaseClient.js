// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Récupère les variables d'environnement définies dans .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Vérifie que les variables existent (bonne pratique)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing from environment variables. Check your .env.local file.')
}

// Crée et exporte le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)