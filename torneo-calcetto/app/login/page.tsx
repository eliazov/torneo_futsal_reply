"use client";

import Image from "next/image";
import { useState } from "react";
import { login, signup } from "./actions";

export default function Login() {
    const [view, setView] = useState<'initial' | 'login' | 'register'>('initial');

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/Gemini_Generated_Image_ahtqatahtqatahtq.png"
                    alt="Torneo Futsal Background"
                    fill
                    priority
                    className="object-cover brightness-50"
                />
            </div>

            {/* Main Container */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-[90%] max-w-md shadow-2xl flex flex-col gap-6 items-center z-10 transition-all duration-300">

                {/* Initial View */}
                {view === 'initial' && (
                    <>
                        <h1 className="text-4xl font-bold text-white drop-shadow-md text-center tracking-tight mb-2">Benvenuto</h1>
                        <div className="w-full grid grid-cols-1 gap-6">
                            <button
                                onClick={() => setView('login')}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 transform hover:scale-105 text-lg tracking-wide uppercase focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
                            >
                                Accedi
                            </button>
                            <button
                                onClick={() => setView('register')}
                                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-white/50 transform hover:scale-105 text-lg tracking-wide uppercase focus:outline-none focus:ring-4 focus:ring-white/50"
                            >
                                Registrati
                            </button>
                        </div>
                    </>
                )}

                {/* Login View */}
                {view === 'login' && (
                    <div className="w-full">
                        <h2 className="text-3xl font-bold text-white text-center mb-6">Accesso</h2>
                        <form action={login} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-white/80 text-sm font-bold mb-2 ml-1">Email</label>
                                <input name="email" type="email" placeholder="nome@esempio.com" required className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-bold mb-2 ml-1">Password</label>
                                <input name="password" type="password" placeholder="••••••••" required className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 mt-4 rounded-lg transition-all shadow-lg">
                                Accedi
                            </button>
                        </form>
                        <button onClick={() => setView('initial')} className="w-full text-white/70 hover:text-white text-sm mt-4 underline decoration-white/30 hover:decoration-white transition-all text-center">
                            Torna indietro
                        </button>
                    </div>
                )}

                {/* Register View */}
                {view === 'register' && (
                    <div className="w-full max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                        <h2 className="text-3xl font-bold text-white text-center mb-6">Registrazione</h2>
                        <form action={signup} className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white/80 text-sm font-bold mb-2 ml-1">Nome</label>
                                    <input name="firstName" type="text" placeholder="Mario" required className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-white/80 text-sm font-bold mb-2 ml-1">Cognome</label>
                                    <input name="lastName" type="text" placeholder="Rossi" required className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-bold mb-2 ml-1">Data di Nascita</label>
                                <input name="dob" type="date" required className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all [color-scheme:dark]" />
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-bold mb-2 ml-1">Azienda</label>
                                <input name="company" type="text" placeholder="Nome Azienda S.p.A." className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-bold mb-2 ml-1">Email</label>
                                <input name="email" type="email" placeholder="nome@esempio.com" required className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-bold mb-2 ml-1">Password</label>
                                <input name="password" type="password" placeholder="••••••••" required className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-bold mb-2 ml-1">Conferma Password</label>
                                <input name="confirmPassword" type="password" placeholder="••••••••" required className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                            </div>

                            <button type="submit" className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 mt-4 rounded-lg transition-all shadow-lg">
                                Registrati
                            </button>
                        </form>
                        <button onClick={() => setView('initial')} className="w-full text-white/70 hover:text-white text-sm mt-4 underline decoration-white/30 hover:decoration-white transition-all text-center mb-2">
                            Torna indietro
                        </button>
                    </div>
                )}

                {view === 'initial' && (
                    <p className="text-white/60 text-sm text-center mt-2">Gestisci la tua squadra e il tuo profilo.</p>
                )}
            </div>
        </div>
    );
}
