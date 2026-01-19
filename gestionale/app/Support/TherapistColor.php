<?php

namespace App\Support;

class TherapistColor
{
    public static function color(int $id): string
    {
        static $palette = [
            '#2563EB', // blu
            '#DC2626', // rosso
            '#F59E0B', // giallo/arancio
            '#059669', // verde


            '#7C3AED', // viola
            '#0EA5E9', // azzurro
            '#16A34A', // verde acceso
            '#EA580C', // arancione

            '#9333EA', // viola scuro
            '#14B8A6', // teal
            '#B91C1C', // rosso scuro
            '#CA8A04', // giallo senape
        ];

        return $palette[$id % count($palette)];
    }
}
