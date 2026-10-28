<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim($request->string('search')->toString());
        $products = Product::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('color', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(8)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => ['search' => $search],
            'stats' => [
                'products' => Product::count(),
                'units' => Product::sum('quantity'),
                'lowStock' => Product::where('quantity', '<=', 5)->count(),
                'value' => Product::selectRaw('COALESCE(SUM(price * quantity), 0) as total')->value('total'),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Products/Form', [
            'product' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Product::create($this->validatedData($request));

        return redirect()->route('products.index')->with('success', 'T-shirt added to inventory.');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Products/Form', [
            'product' => $product,
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $product->update($this->validatedData($request, $product));

        return redirect()->route('products.index')->with('success', 'Product details updated.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product removed from inventory.');
    }

    /**
     * @return array{name: string, sku: string, description: ?string, size: string, color: string, price: string, quantity: int}
     */
    private function validatedData(Request $request, ?Product $product = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'sku' => ['required', 'string', 'max:60', Rule::unique('products', 'sku')->ignore($product)],
            'description' => ['nullable', 'string', 'max:1000'],
            'size' => ['required', 'string', Rule::in(['XS', 'S', 'M', 'L', 'XL', 'XXL'])],
            'color' => ['required', 'string', 'max:60'],
            'price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'quantity' => ['required', 'integer', 'min:0', 'max:1000000'],
        ]);
    }
}
