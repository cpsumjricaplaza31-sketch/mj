import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductForm({ product }) {
    const editing = Boolean(product);
    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name ?? '',
        sku: product?.sku ?? '',
        description: product?.description ?? '',
        size: product?.size ?? 'M',
        color: product?.color ?? '',
        price: product?.price ?? '',
        quantity: product?.quantity ?? 0,
    });

    const submit = (event) => {
        event.preventDefault();
        if (editing) {
            put(route('products.update', product.id));
        } else {
            post(route('products.store'));
        }
    };

    const field = (name, label, props = {}) => {
        const { wrapperClassName = '', ...inputProps } = props;

        return (
            <div className={wrapperClassName}>
                <label htmlFor={name} className="text-sm font-semibold text-slate-700">{label}</label>
                <input
                    id={name}
                    name={name}
                    value={data[name]}
                    onChange={(event) => setData(name, event.target.value)}
                    {...inputProps}
                    className="mt-2 block w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
                <InputError message={errors[name]} className="mt-2" />
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={editing ? 'Edit product' : 'Add product'} />
            <div className="mx-auto max-w-3xl">
                <Link href={route('products.index')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900">
                    <span aria-hidden="true">←</span> Back to inventory
                </Link>
                <div className="mt-6">
                    <p className="text-sm font-bold uppercase tracking-[.16em] text-emerald-700">{editing ? 'Product details' : 'New arrival'}</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{editing ? 'Edit T-shirt' : 'Add a T-shirt'}</h1>
                    <p className="mt-2 text-sm text-slate-500">Enter the product details and keep your stock accurate.</p>
                </div>

                <form onSubmit={submit} className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="grid gap-5 sm:grid-cols-2">
                        {field('name', 'Product name', { placeholder: 'e.g. Classic heavyweight tee', required: true, maxLength: 120, wrapperClassName: 'sm:col-span-2' })}
                        {field('sku', 'SKU', { placeholder: 'e.g. CL-TEE-001', required: true, maxLength: 60 })}
                        <div>
                            <label htmlFor="size" className="text-sm font-semibold text-slate-700">Size</label>
                            <select id="size" value={data.size} onChange={(event) => setData('size', event.target.value)} className="mt-2 block w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
                                {sizes.map((size) => <option key={size} value={size}>{size}</option>)}
                            </select>
                            <InputError message={errors.size} className="mt-2" />
                        </div>
                        {field('color', 'Color', { placeholder: 'e.g. Forest green', required: true, maxLength: 60 })}
                        {field('price', 'Unit price', { type: 'number', min: '0', step: '0.01', placeholder: '0.00', required: true })}
                        {field('quantity', 'Units in stock', { type: 'number', min: '0', step: '1', required: true })}
                        <div className="sm:col-span-2">
                            <label htmlFor="description" className="text-sm font-semibold text-slate-700">Description <span className="font-normal text-slate-400">(optional)</span></label>
                            <textarea id="description" value={data.description} onChange={(event) => setData('description', event.target.value)} rows="4" maxLength="1000" className="mt-2 block w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="Add notes about the fabric, fit, or collection..." />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                        <Link href={route('products.index')} className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancel</Link>
                        <button type="submit" disabled={processing} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                            {processing ? 'Saving…' : editing ? 'Save changes' : 'Add to inventory'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
