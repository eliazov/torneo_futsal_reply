'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

type View = 'idle' | 'form' | 'success' | 'error'

export default function ChangePasswordForm() {
    const [view, setView] = useState<View>('idle')
    const [newPassword, setNewPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErrorMsg('')

        if (newPassword.length < 6) {
            setErrorMsg('La password deve essere di almeno 6 caratteri.')
            return
        }
        if (newPassword !== confirm) {
            setErrorMsg('Le password non corrispondono.')
            return
        }

        setLoading(true)
        const supabase = createClient()
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        setLoading(false)

        if (error) {
            setErrorMsg(error.message)
            setView('error')
        } else {
            setNewPassword('')
            setConfirm('')
            setView('success')
        }
    }

    if (view === 'success') {
        return (
            <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 rounded-xl px-4 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <p className="text-sm font-medium">Password aggiornata con successo!</p>
            </div>
        )
    }

    if (view === 'idle') {
        return (
            <button
                onClick={() => setView('form')}
                className="flex items-center gap-2 text-sm font-semibold text-emerald-600 border border-emerald-200 px-4 py-2 rounded-xl hover:bg-emerald-50 transition-colors duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75A4.5 4.5 0 008 6.75v3.75m-2.25 0h12.75a.75.75 0 01.75.75v8.25a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75v-8.25a.75.75 0 01.75-.75z" />
                </svg>
                Cambia Password
            </button>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nuova Password</label>
                <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Conferma Password</label>
                <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
            </div>

            {errorMsg && (
                <p className="text-red-500 text-sm">{errorMsg}</p>
            )}

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-50"
                >
                    {loading ? 'Salvataggio...' : 'Salva'}
                </button>
                <button
                    type="button"
                    onClick={() => { setView('idle'); setErrorMsg('') }}
                    className="text-gray-500 hover:text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 transition"
                >
                    Annulla
                </button>
            </div>
        </form>
    )
}
