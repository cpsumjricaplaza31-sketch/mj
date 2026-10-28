import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

function ShirtIllustration() {
    return (
        <svg viewBox="0 0 420 360" fill="none" className="w-full max-w-[360px]" aria-hidden="true">
            <path d="M119 77 165 51c9 12 25 20 45 20s36-8 45-20l46 26 52 42-32 48-30-18v147H129V149l-30 18-32-48 52-42Z" fill="#D1FAE5" />
            <path d="m165 51 9 44c8 9 20 14 36 14s28-5 36-14l9-44" stroke="#047857" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M129 149v147h162V149" stroke="#047857" strokeWidth="5" strokeLinejoin="round" />
            <path d="m63 117 32 50 34-18M357 117l-32 50-34-18" stroke="#047857" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M177 184h66M177 207h46" stroke="#6EE7B7" strokeWidth="7" strokeLinecap="round" />
            <circle cx="326" cy="68" r="25" fill="#FDE68A" />
            <path d="M50 284h320" stroke="#334155" strokeWidth="5" strokeLinecap="round" opacity=".2" />
            <path d="M72 79v-18m-9 9h18M347 239v-14m-7 7h14" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
        </svg>
    );
}

export default function Login({ status, canResetPassword, canRegister = true }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <div className="min-h-screen bg-white lg:grid lg:grid-cols-[1.05fr_.95fr]">
            <Head title="Sign in" />
            <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex xl:p-16">
                <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute -bottom-36 -right-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
                <Link href="/" className="relative flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400 text-slate-950">
                        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                            <path d="m8 4 4 2 4-2 5 3-2 4-3-1v10H8V10l-3 1-2-4 5-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <span className="text-xl font-bold tracking-tight">Thread<span className="text-emerald-400">stock</span></span>
                </Link>
                <div className="relative mx-auto flex w-full max-w-md flex-col items-center py-10 text-center">
                    <ShirtIllustration />
                    <p className="mt-8 text-xs font-bold uppercase tracking-[.25em] text-emerald-300">Your stock, in sync</p>
                    <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight">Every tee accounted for.</h1>
                    <p className="mt-4 max-w-sm text-base leading-7 text-slate-400">A clearer view of your products, sizes, and stock — all in one place.</p>
                </div>
                <p className="relative text-xs text-slate-500">Simple inventory management for independent shops.</p>
            </section>

            <main className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
                <div className="w-full max-w-md">
                    <Link href="/" className="mb-12 flex items-center gap-3 lg:hidden">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-slate-950">
                            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                                <path d="m8 4 4 2 4-2 5 3-2 4-3-1v10H8V10l-3 1-2-4 5-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <span className="text-lg font-bold">Thread<span className="text-emerald-600">stock</span></span>
                    </Link>
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[.18em] text-emerald-700">Welcome back</p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Sign in to your account</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">Manage your T-shirt inventory from one simple workspace.</p>
                    </div>

                    {status && <div className="mt-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{status}</div>}

                    <form onSubmit={submit} className="mt-8 space-y-5">
                        <div>
                            <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email address</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                required
                                onChange={(event) => setData('email', event.target.value)}
                                className="mt-2 block w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                                placeholder="you@yourstore.com"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
                                {canResetPassword && <Link href={route('password.request')} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">Forgot password?</Link>}
                            </div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="current-password"
                                required
                                onChange={(event) => setData('password', event.target.value)}
                                className="mt-2 block w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                                placeholder="Enter your password"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        <label className="flex items-center gap-2.5 text-sm text-slate-600">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(event) => setData('remember', event.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            Keep me signed in
                        </label>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Signing in…' : 'Sign in'}
                            <span className="ml-2" aria-hidden="true">→</span>
                        </button>
                    </form>

                    {canRegister && (
                        <p className="mt-8 text-center text-sm text-slate-500">
                            New to Threadstock?{' '}
                            <Link href={route('register')} className="font-semibold text-emerald-700 hover:text-emerald-800">Create an account</Link>
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
