// src/components/AudioPlayer.jsx
'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useRadioStore } from '@/store/radioStore';
import { useShallow } from 'zustand/react/shallow'; // On utilise useShallow aussi ici
import { Play, Pause, Loader2, XCircle, Radio } from 'lucide-react';
import { cn } from "@/lib/utils"; // Importe ta fonction cn

export default function AudioPlayer() {
  // Récupère l'état et les actions nécessaires du store
  const { selectedRadio, playerState, setPlayerState, stopPlayback } = useRadioStore(
    useShallow((state) => ({
      selectedRadio: state.selectedRadio,
      playerState: state.playerState,
      setPlayerState: state.setPlayerState,
      stopPlayback: state.stopPlayback, // Action pour arrêter
    }))
  );

  // Référence à l'élément <audio>
  const audioRef = useRef(null);

  // --- Effet pour gérer le changement de radio sélectionnée ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (selectedRadio && selectedRadio.stream_url) {
      console.log("AudioPlayer: Nouvelle URL détectée ->", selectedRadio.stream_url);
      // Si l'URL est différente de celle déjà chargée (évite rechargement inutile)
      if (audio.src !== selectedRadio.stream_url) {
          audio.src = selectedRadio.stream_url;
          audio.load(); // Important pour charger la nouvelle source
          setPlayerState('loading'); // Passe en état de chargement
      }
      // Tente de lancer la lecture (peut échouer sans interaction utilisateur)
      audio.play().then(() => {
        // Si la lecture démarre (ou était déjà en cours), l'événement 'onPlaying' mettra l'état à 'playing'
        console.log("AudioPlayer: Tentative de lecture démarrée pour", selectedRadio.stream_url);
      }).catch(error => {
        console.error("AudioPlayer: Erreur au démarrage de la lecture (peut nécessiter une interaction utilisateur)", error);
        // Si l'erreur n'est pas due à une interruption (ex: changement rapide de source)
        if (error.name !== 'AbortError') {
            setPlayerState('error');
            // On pourrait aussi remettre selectedRadio à null ici si l'URL est invalide
        }
      });
    } else {
      // Si aucune radio n'est sélectionnée ou pas d'URL, on arrête tout
      audio.pause();
      audio.src = '';
      // setPlayerState('idle'); // L'action stopPlayback ou le handlePause devraient gérer ça
    }

    // Nettoyage si le composant est démonté (peu probable dans le layout)
    // return () => {
    //   if(audio) {
    //       audio.pause();
    //       audio.src = '';
    //   }
    // };

  }, [selectedRadio, setPlayerState]); // Dépend de selectedRadio et setPlayerState

  // --- Gestionnaires d'événements pour l'élément <audio> ---
  // Utilise useCallback pour éviter de recréer les fonctions à chaque rendu

  // Appelée quand la lecture commence réellement
  const handlePlaying = useCallback(() => {
    setPlayerState('playing');
  }, [setPlayerState]);

  // Appelée quand la lecture est mise en pause (par l'utilisateur ou le système)
  const handlePause = useCallback(() => {
    // Ne pas repasser en 'paused' si l'état est déjà 'idle' ou 'loading' ou 'error'
    const currentState = useRadioStore.getState().playerState;
    if (currentState === 'playing' || currentState === 'loading') { // Condition ajoutée
        setPlayerState('paused');
    }
  }, [setPlayerState]);

  // Appelée quand le navigateur attend des données (buffering)
  const handleWaiting = useCallback(() => {
    setPlayerState('loading');
  }, [setPlayerState]);

  // Appelée en cas d'erreur de lecture (URL invalide, problème réseau...)
  const handleError = useCallback((event) => {
    console.error("AudioPlayer: Erreur de l'élément <audio>", event);
    setPlayerState('error');
  }, [setPlayerState]);

  // Appelée quand l'audio peut être joué jusqu'au bout sans interruption (assez de données bufférisées)
  // Alternative à 'onPlaying' pour passer à 'playing' mais peut être moins réactif
   const handleCanPlay = useCallback(() => {
     // Si on était en 'loading', on peut tenter de passer en 'playing' ou laisser 'onPlaying' le faire
     // console.log("AudioPlayer: CanPlay event");
     // setPlayerState('playing'); // Attention, peut causer des conflits avec onPlaying
   }, [setPlayerState]);


  // --- Logique pour le bouton Play/Pause ---
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !selectedRadio) return;

    const currentState = useRadioStore.getState().playerState;

    if (currentState === 'playing') {
      audio.pause();
    } else if (currentState === 'paused' || currentState === 'idle' || currentState === 'error') { // On peut essayer de (re)lancer
      // Assure-toi que la source est bien définie avant de jouer
      if (audio.src !== selectedRadio.stream_url) {
          audio.src = selectedRadio.stream_url;
          audio.load();
      }
      audio.play().catch(error => {
          console.error("AudioPlayer: Erreur au toggle Play:", error);
          setPlayerState('error');
      });
    }
     // Si 'loading', on attend
  };

  // Ne rend le lecteur que si une radio est sélectionnée ou en cours de lecture/pause/chargement/erreur
   if (!selectedRadio && playerState === 'idle') {
       return null; // Ou un placeholder minimaliste si tu préfères
   }

  return (
    <div className="bg-gray-900 text-white p-3 flex items-center justify-between shadow-inner">
      {/* Balise audio réelle (cachée visuellement) */}
      <audio
        ref={audioRef}
        onPlay={handlePlaying} // Utilise onPlay plutot que onPlaying pour certaines plateformes
        onPause={handlePause}
        onWaiting={handleWaiting}
        onError={handleError}
        onCanPlay={handleCanPlay} // Ou onCanPlayThrough
        // preload="auto" // Peut être utile
      />

      <div className="flex items-center space-x-3 overflow-hidden mr-3">
          <Radio className="h-5 w-5 flex-shrink-0 text-gray-400" /> {/* Icône radio */}
          <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">
                  {selectedRadio ? selectedRadio.name : "Aucune radio sélectionnée"}
              </span>
              {/* On pourrait ajouter le nom du match ici aussi */}
              {/* <span className="text-xs text-gray-400 truncate">{selectedRadio?.matchName || ""}</span> */}
          </div>
      </div>


      <div className="flex items-center space-x-2">
         {/* Affiche l'état (utile pour debug) */}
         {/* <span className="text-xs text-gray-500 mr-2">{playerState}</span> */}

        {/* Bouton Play/Pause/Loading */}
        <button
          onClick={togglePlayPause}
          className={cn(
              "p-1.5 rounded-full text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-150",
              playerState === 'error' ? 'text-red-500 hover:bg-red-900' : '',
              playerState === 'loading' ? 'cursor-not-allowed' : ''
          )}
          disabled={playerState === 'loading' || (!selectedRadio && playerState !== 'error')} // Désactive si loading ou si idle sans radio
          aria-label={playerState === 'playing' ? 'Mettre en pause' : 'Lire'}
        >
          {playerState === 'loading' && <Loader2 className="h-6 w-6 animate-spin" />}
          {playerState === 'playing' && <Pause className="h-6 w-6" />}
          {(playerState === 'paused' || playerState === 'idle') && <Play className="h-6 w-6" />}
          {playerState === 'error' && <XCircle className="h-6 w-6 text-red-500"/>}
        </button>

         {/* Bouton Stop (optionnel) */}
         {/* <button
            onClick={stopPlayback}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Arrêter la lecture"
            >
            <Square className="h-5 w-5" />
         </button> */}
      </div>
    </div>
  );
}