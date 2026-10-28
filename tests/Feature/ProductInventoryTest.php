<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductInventoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_inventory_is_only_available_to_authenticated_users(): void
    {
        $this->get(route('products.index'))
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_inventory_and_create_update_and_delete_products(): void
    {
        $this->actingAs(User::factory()->create());

        $this->get(route('products.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Products/Index'));

        $productData = [
            'name' => 'Everyday cotton tee',
            'sku' => 'TEE-001',
            'description' => 'A soft everyday shirt.',
            'size' => 'M',
            'color' => 'Forest green',
            'price' => '24.50',
            'quantity' => 12,
        ];

        $this->post(route('products.store'), $productData)
            ->assertRedirect(route('products.index'));

        $this->get(route('products.index'))
            ->assertInertia(fn ($page) => $page
                ->where('flash.success', 'T-shirt added to inventory.'));

        $product = Product::where('sku', 'TEE-001')->firstOrFail();
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Everyday cotton tee',
            'quantity' => 12,
        ]);

        $this->put(route('products.update', $product), [
            ...$productData,
            'name' => 'Everyday cotton tee - updated',
            'quantity' => 8,
        ])->assertRedirect(route('products.index'));

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Everyday cotton tee - updated',
            'quantity' => 8,
        ]);

        $this->delete(route('products.destroy', $product))
            ->assertRedirect(route('products.index'));

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    public function test_product_input_is_validated(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post(route('products.store'), [
            'name' => '',
            'sku' => '',
            'size' => 'XXXL',
            'color' => '',
            'price' => '-1',
            'quantity' => '-2',
        ])->assertSessionHasErrors(['name', 'sku', 'size', 'color', 'price', 'quantity']);
    }
}
