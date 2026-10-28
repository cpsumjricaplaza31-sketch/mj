import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

function StatCard({ label, value, note, icon, accent = false }) {
    return (
        <div className={`rounded-2xl border p-5 ${accent ? 'border-emerald-200 bg-emerald-50/70' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${accent ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>{icon}</span>
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{note}</p>
        </div>
    );
}

function StockBadge({ quantity }) {
    if (quantity === 0) {
        return <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">Out of stock</span>;
    }

    if (quantity <= 5) {
        return <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">Low stock · {quantity}</span>;
    }

    return <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{quantity} in stock</span>;
}

function paginationLabel(label) {
    return label
        .replace(/<[^>]*>/g, '')
        .replace(/&laquo;/g, '←')
        .replace(/&raquo;/g, '→');
}

export default function Index({ products, stats, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const { flash } = usePage().props;

    const searchProducts = (event) => {
        event.preventDefault();
        router.get(route('products.index'), { search }, { preserveState: true, replace: true });
    };

    const deleteProduct = (product) => {
        if (window.confirm(`Remove "${product.name}" from your inventory?`)) {
            router.delete(route('products.destroy', product.id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="T-shirt inventory" />
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[.16em] text-emerald-700">Your workspace</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">T-shirt inventory</h1>
                    <p className="mt-2 text-sm text-slate-500">A tidy overview of your products, stock, and value.</p>
                </div>
                <Link href={route('products.create')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
                    <span className="text-lg leading-none" aria-hidden="true">+</span> Add product
                </Link>
            </div>

            {flash?.success && <div role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{flash.success}</div>}

            <section aria-label="Inventory summary" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Products" value={stats.products} note="Unique T-shirt styles" icon="◫" />
                <StatCard label="Units in stock" value={stats.units.toLocaleString()} note="Across all sizes and colors" icon="▤" accent />
                <StatCard label="Needs attention" value={stats.lowStock} note="Products with 5 units or fewer" icon="!" />
                <StatCard label="Inventory value" value={new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(stats.value)} note="Based on current unit prices" icon="$" />
            </section>

            <section className="mt-9 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">All products</h2>
                        <p className="mt-1 text-sm text-slate-500">{products.total} {products.total === 1 ? 'product' : 'products'} in your catalog</p>
                    </div>
                    <form onSubmit={searchProducts} className="flex w-full gap-2 sm:w-auto">
                        <label htmlFor="product-search" className="sr-only">Search by product, SKU, or color</label>
                        <input id="product-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." className="min-w-0 flex-1 rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-emerald-500 focus:bg-white focus:ring-emerald-500 sm:w-64" />
                        <button type="submit" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Search</button>
                    </form>
                </div>

                {products.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left">
                                <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="px-6 py-3.5 font-semibold">Product</th>
                                        <th className="px-4 py-3.5 font-semibold">SKU</th>
                                        <th className="px-4 py-3.5 font-semibold">Size / color</th>
                                        <th className="px-4 py-3.5 font-semibold">Unit price</th>
                                        <th className="px-4 py-3.5 font-semibold">Stock</th>
                                        <th className="px-6 py-3.5 text-right font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {products.data.map((product) => (
                                        <tr key={product.id} className="transition hover:bg-slate-50/70">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><path d="m8 4 4 2 4-2 5 3-2 4-3-1v10H8V10l-3 1-2-4 5-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
                                                    </span>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{product.name}</p>
                                                        {product.description && <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-500">{product.description}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-slate-600">{product.sku}</td>
                                            <td className="px-4 py-4">
                                                <p className="text-sm font-medium text-slate-800">{product.size}</p>
                                                <p className="mt-0.5 text-xs text-slate-500">{product.color}</p>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-semibold text-slate-800">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(product.price))}</td>
                                            <td className="px-4 py-4"><StockBadge quantity={product.quantity} /></td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-3">
                                                    <Link href={route('products.edit', product.id)} className="text-sm font-semibold text-slate-600 hover:text-emerald-700">Edit</Link>
                                                    <button type="button" onClick={() => deleteProduct(product)} className="text-sm font-semibold text-slate-400 hover:text-rose-600">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {products.links.length > 3 && (
                            <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
                                <p className="text-sm text-slate-500">Showing {products.from}–{products.to} of {products.total}</p>
                                <div className="flex flex-wrap gap-1">
                                    {products.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url ?? '#'}
                                            preserveScroll
                                            className={`rounded-lg px-3 py-2 text-sm ${link.active ? 'bg-slate-950 font-semibold text-white' : link.url ? 'text-slate-600 hover:bg-slate-100' : 'cursor-not-allowed text-slate-300'}`}
                                            aria-label={paginationLabel(link.label).trim() || 'Pagination link'}
                                        >
                                            {paginationLabel(link.label)}
                                        </Link>
                                    ))}
                                </div>
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="px-6 py-16 text-center">
                        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true"><path d="m8 4 4 2 4-2 5 3-2 4-3-1v10H8V10l-3 1-2-4 5-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
                        </span>
                        <h3 className="mt-4 text-base font-semibold text-slate-900">{filters.search ? 'No matching products' : 'Your inventory is ready'}</h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{filters.search ? 'Try another search term or clear your search.' : 'Add your first T-shirt to start tracking sizes, colors, and stock.'}</p>
                        {filters.search ? (
                            <Link href={route('products.index')} className="mt-5 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800">Clear search</Link>
                        ) : (
                            <Link href={route('products.create')} className="mt-5 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Add your first product</Link>
                        )}
                    </div>
                )}
            </section>
            <p className="mt-6 text-center text-xs text-slate-400">Threadstock · A little more clarity for your clothing business.</p>
        </AuthenticatedLayout>
    );
}
