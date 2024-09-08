'use client'

import React from 'react';

interface AudioPlayerProps {
    audioUrl: string;
}

function AudioPlayer({ audioUrl }: AudioPlayerProps) {
    return (
        <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
    );
}

export default AudioPlayer;