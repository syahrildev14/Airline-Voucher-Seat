<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VoucherTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_check_if_voucher_exists()
    {
        $response = $this->postJson('/api/check', [
            'flightNumber' => 'GA102',
            'date' => '2025-07-12',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'exists' => false
            ]);
    }

    /** @test */
    public function it_can_generate_voucher_successfully()
    {
        $response = $this->postJson('/api/generate', [
            'name' => 'Sarah',
            'id' => '98123',
            'flightNumber' => 'GA102',
            'date' => '2025-07-12',
            'aircraft' => 'Airbus 320'
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'crewName',
                    'crewId',
                    'flightNumber',
                    'date',
                    'aircraft',
                    'seats',
                    'createdAt'
                ]
            ]);
    }

    /** @test */
    public function it_prevents_duplicate_voucher_generation()
    {
        $payload = [
            'name' => 'Sarah',
            'id' => '98123',
            'flightNumber' => 'GA102',
            'date' => '2025-07-12',
            'aircraft' => 'Airbus 320'
        ];

        // First generate
        $this->postJson('/api/generate', $payload);

        // Try duplicate
        $response = $this->postJson('/api/generate', $payload);

        $response->assertStatus(409)
            ->assertJson([
                'success' => false
            ]);
    }
}
