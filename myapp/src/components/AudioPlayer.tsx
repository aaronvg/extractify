'use client'

import React, { useRef, useEffect } from 'react';

interface AudioPlayerProps {
    audioUrl: string;
}

function AudioPlayer({ audioUrl }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = audioUrl;
        }
    }, [audioUrl]);

    return (
        <div className="w-full max-w-md">
            <audio ref={audioRef} controls className="w-full">
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}

export default AudioPlayer;