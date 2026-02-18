<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VoucherResource extends JsonResource
{
    //  Get assigned seats as array.
    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'data' => [
                'crewName' => $this->crew_name,
                'crewId' => $this->crew_id,
                'flightNumber' => $this->flight_number,
                'date' => $this->flight_date,
                'aircraft' => $this->aircraft_type,
                'seats' => [
                    $this->seat1,
                    $this->seat2,
                    $this->seat3,
                ],
                'createdAt' => $this->created_at,
            ]
        ];
    }
}
