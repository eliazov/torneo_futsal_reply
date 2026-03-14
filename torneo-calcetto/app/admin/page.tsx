'use client'

import { useEffect, useState, useTransition } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { TeamRegistration } from '@/app/lib/db_queries'

// ─── Placeholder data ─────────────────────────────────────────────────────────
const PLACEHOLDER: TeamRegistration[] = [
    { id: '1', team_name: 'FC Rosso Fuoco', company: 'Alpha S.p.A.', contact_email: 'marco@alpha.it', contact_name: 'Marco Rossi', status: 'pending', created_at: '2025-02-10T10:00:00Z', notes: null },
    { id: '2', team_name: 'Gli Squali', company: 'Beta Tech', contact_email: 'simone@beta.it', contact_name: 'Simone Ferrari', status: 'accepted', created_at: '2025-02-08T09:00:00Z', notes: 'Confermata' },
    { id: '3', team_name: 'Aquile Nere', company: 'Gamma Group', contact_email: 'roberto@gamma.it', contact_name: 'Roberto Ricci', status: 'rejected', created_at: '2025-02-07T14:00:00Z', notes: 'Quota non pagata' },
    { id: '4', team_name: 'I Dragoni', company: 'Delta Industries', contact_email: 'nicola@delta.it', contact_name: 'Nicola Romano', status: 'pending', created_at: '2025-02-12T08:30:00Z', notes: null },
]

const STATUS_CONFIG = {
    pending: { label: 'In attesa', classes: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    accepted: { label: 'Accettata', classes: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    rejected: { label: 'Rifiutata', classes: 'bg-red-100 text-red-700 border-red-200' },
}

function StatusBadge({ status }: { status: TeamRegistration['status'] }) {
    const { label, classes } = STATUS_CONFIG[status]
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${classes}`}>
            {label}
        </span>
    )
}

// ─── Registration Row ─────────────────────────────────────────────────────────
function RegistrationRow({
    reg, usePlaceholder, onUpdate,
}: {
    reg: TeamRegistration
    usePlaceholder: boolean
    onUpdate: (id: string, status: 'accepted' | 'rejected') => void
}) {
    const [isPending, startTransition] = useTransition()

    function handleAction(status: 'accepted' | 'rejected') {
        if (usePlaceholder) {
            onUpdate(reg.id, status)
            return
        }
        startTransition(async () => {
            const supabase = createClient()
            await supabase.from('team_registrations').update({ status }).eq('id', reg.id)
            onUpdate(reg.id, status)
        })
    }

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-4">
                <p className="font-semibold text-gray-800">{reg.team_name}</p>
                {reg.company && <p className="text-xs text-gray-400">{reg.company}</p>}
            </td>
            <td className="px-4 py-4">
                <p className="text-sm text-gray-700">{reg.contact_name ?? '—'}</p>
                <p className="text-xs text-gray-400">{reg.contact_email}</p>
            </td>
            <td className="px-4 py-4 text-sm text-gray-500">
                {new Date(reg.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
            </td>
            <td className="px-4 py-4">
                <StatusBadge status={reg.status} />
            </td>
            <td className="px-4 py-4 text-sm text-gray-500 max-w-[12rem] truncate">{reg.notes ?? '—'}</td>
            <td className="px-4 py-4">
                {reg.status === 'pending' && (
                    <div className="flex items-center gap-2">
                        <button
                            disabled={isPending}
                            onClick={() => handleAction('accepted')}
                            className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                        >
                            Accetta
                        </button>
                        <button
                            disabled={isPending}
                            onClick={() => handleAction('rejected')}
                            className="text-xs font-semibold bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                        >
                            Rifiuta
                        </button>
                    </div>
                )}
            </td>
        </tr>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
type FilterTab = 'all' | 'pending' | 'accepted' | 'rejected'

export default function AdminPage() {
    const [regs, setRegs] = useState<TeamRegistration[]>([])
    const [loading, setLoading] = useState(true)
    const [usePlaceholder, setUsePlaceholder] = useState(false)
    const [filter, setFilter] = useState<FilterTab>('all')

    useEffect(() => {
        async function load() {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('team_registrations')
                .select('id, team_name, company, contact_email, contact_name, status, created_at, notes')
                .order('created_at', { ascending: false })

            if (error || !data || data.length === 0) {
                setRegs(PLACEHOLDER)
                setUsePlaceholder(true)
            } else {
                setRegs(data as TeamRegistration[])
            }
            setLoading(false)
        }
        load()
    }, [])

    function handleUpdate(id: string, status: 'accepted' | 'rejected') {
        setRegs((prev) => prev.map((r) => r.id === id ? { ...r, status } : r))
    }

    const counts = {
        all: regs.length,
        pending: regs.filter((r) => r.status === 'pending').length,
        accepted: regs.filter((r) => r.status === 'accepted').length,
        rejected: regs.filter((r) => r.status === 'rejected').length,
    }

    const filtered = filter === 'all' ? regs : regs.filter((r) => r.status === filter)

    const tabs: { key: FilterTab; label: string }[] = [
        { key: 'all', label: `Tutte (${counts.all})` },
        { key: 'pending', label: `In attesa (${counts.pending})` },
        { key: 'accepted', label: `Accettate (${counts.accepted})` },
        { key: 'rejected', label: `Rifiutate (${counts.rejected})` },
    ]

    return (
        <div className="relative min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 pt-32 pb-16 px-6">
                <div className="max-w-screen-xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold text-white">Pannello Admin</h1>
                            <p className="text-gray-400 mt-1">Gestione iscrizioni squadre</p>
                        </div>
                    </div>

                    {/* Summary stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                        {[
                            { label: 'Totali', value: counts.all, color: 'text-white' },
                            { label: 'In attesa', value: counts.pending, color: 'text-yellow-400' },
                            { label: 'Accettate', value: counts.accepted, color: 'text-emerald-400' },
                            { label: 'Rifiutate', value: counts.rejected, color: 'text-red-400' },
                        ].map((s) => (
                            <div key={s.label} className="bg-white/10 rounded-xl p-4 text-center">
                                <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                                <p className="text-gray-400 text-sm mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-6 py-10">
                {/* Filter tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === tab.key
                                ? 'bg-gray-800 text-white shadow'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-800 hover:text-gray-800'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <p>Nessuna iscrizione trovata.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        {['Squadra', 'Contatto', 'Data', 'Stato', 'Note', 'Azioni'].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filtered.map((reg) => (
                                        <RegistrationRow
                                            key={reg.id}
                                            reg={reg}
                                            usePlaceholder={usePlaceholder}
                                            onUpdate={handleUpdate}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {usePlaceholder && (
                    <p className="text-center text-xs text-gray-400 mt-4 italic">
                        Dati di esempio — crea la tabella <code>team_registrations</code> in Supabase per dati reali.
                    </p>
                )}
            </div>
        </div>
    )
}
