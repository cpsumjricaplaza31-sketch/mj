import { Link, usePage } from '@inertiajs/react';

function BrandMark() {
    return (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-slate-950">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                <path d="m8 4 4 2 4-2 5 3-2 4-3-1v10H8V10l-3 1-2-4 5-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
        </span>
    );
}

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <div className="min-h-screen bg-[#f7f8f6] text-slate-900">
            <header className="border-b border-slate-200/80 bg-white">
                <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
                    <div className="flex items-center gap-3">
                        <Link href={route('products.index')} className="flex items-center gap-3">
                            <BrandMark />
                            <span className="text-lg font-bold tracking-tight">Thread<span className="text-emerald-600">stock</span></span>
                        </Link>
                        <span className="hidden h-7 border-l border-slate-200 sm:block" />
                        <span className="hidden text-sm font-medium text-slate-500 sm:block">Inventory</span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-5">
                        <Link href={route('profile.edit')} className="hidden text-sm font-semibold text-slate-500 transition hover:text-slate-900 md:block">
                            Profile
                        </Link>
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                            {user.name.slice(0, 1).toUpperCase()}
                        </span>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                        >
                            Sign out
                        </Link>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
                {children}
            </main>
        </div>
    );
}
