<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\GenerateVoucherRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\CheckVoucherRequest;
use App\Services\SeatGeneratorService;
use App\Models\Voucher;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\VoucherResource;


class VoucherController extends Controller
{
    public function check(CheckVoucherRequest $request)
    {
        $exists = Voucher::where('flight_number', $request->flightNumber)
            ->where('flight_date', $request->date)
            ->exists();

        return response()->json([
            'exists' => $exists
        ], 200);
    }

    public function generate(
        GenerateVoucherRequest $request,
        SeatGeneratorService $seatService
    ) {
        try {
            return DB::transaction(function () use ($request, $seatService) {

                // Cek duplicate
                $exists = Voucher::where('flight_number', $request->flightNumber)
                    ->where('flight_date', $request->date)
                    ->exists();

                if ($exists) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Vouchers already generated for this flight and date.'
                    ], 409);
                }

                // Generate seats
                $seats = $seatService->generateSeats($request->aircraft);

                // Save to DB
                $voucher = Voucher::create([
                    'crew_name' => $request->name,
                    'crew_id' => $request->id,
                    'flight_number' => $request->flightNumber,
                    'flight_date' => $request->date,
                    'aircraft_type' => $request->aircraft,
                    'seat1' => $seats[0],
                    'seat2' => $seats[1],
                    'seat3' => $seats[2],
                ]);

                return (new VoucherResource($voucher))
                    ->response()
                    ->setStatusCode(201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.'
            ], 500);
        }
    }
}
