<?php

namespace App\Services;

class SeatGeneratorService
{
    public function generateSeats(string $aircraft): array
    {
        $seatMap = [];

        switch ($aircraft) {
            case 'ATR':
                $rows = range(1, 18);
                $letters = ['A', 'C', 'D', 'F'];
                break;

            case 'Airbus 320':
            case 'Boeing 737 Max':
                $rows = range(1, 32);
                $letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                break;

            default:
                throw new \Exception('Invalid aircraft type.');
        }

        foreach ($rows as $row) {
            foreach ($letters as $letter) {
                $seatMap[] = $row . $letter;
            }
        }

        shuffle($seatMap);

        return array_slice($seatMap, 0, 3);
    }
}
