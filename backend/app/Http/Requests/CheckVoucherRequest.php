<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckVoucherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'flightNumber' => 'required|string',
            'date' => 'required|date',
        ];
    }

    public function messages(): array
    {
        return [
            'flightNumber.required' => 'Flight number is required.',
            'date.required' => 'Flight date is required.',
            'date.date' => 'Flight date must be a valid date.',
        ];
    }
}
