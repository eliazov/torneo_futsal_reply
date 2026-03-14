'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Match, Matchday } from '@/app/lib/db_queries'

// ─── Placeholder data ─────────────────────────────────────────────────────────

const PLACEHOLDER_MATCHDAYS: Matchday[] = [
    { id: '1', number: 1, date: '2025-03-01' },
    { id: '2', number: 2, date: '2025-03-08' },
    { id: '3', number: 3, date: '2025-03-15' },
    { id: '4', number: 4, date: '2025-03-22' },
]

const PLACEHOLDER_MATCHES: Record<string, Match[]> = {
    '1': [
        { id: 'm1', matchday_id: '1', home_team: { id: '1', name: 'FC Rosso Fuoco' }, away_team: { id: '2', name: 'Gli Squali' }, home_score: 4, away_score: 2, played: true },
        { id: 'm2', matchday_id: '1', home_team: { id: '3', name: 'Aquile Nere' }, away_team: { id: '4', name: 'I Dragoni' }, home_score: 1, away_score: 1, played: true },
    ],
    '2': [
        { id: 'm3', matchday_id: '2', home_team: { id: '2', name: 'Gli Squali' }, away_team: { id: '3', name: 'Aquile Nere' }, home_score: null, away_score: null, played: false },
        { id: 'm4', matchday_id: '2', home_team: { id: '4', name: 'I Dragoni' }, away_team: { id: '1', name: 'FC Rosso Fuoco' }, home_score: null, away_score: null, played: false },
    ],
    '3': [
        { id: 'm5', matchday_id: '3', home_team: { id: '1', name: 'FC Rosso Fuoco' }, away_team: { id: '3', name: 'Aquile Nere' }, home_score: null, away_score: null, played: false },
    ],
    '4': [],
}

// ─── Match Card ───────────────────────────────────────────────────────────────

function MatchCard({ match }: { match: Match }) {
    const isPlayed = match.played
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between gap-4">
                {/* Home */}
                <div className="flex-1 text-right">
                    <p className="font-bold text-gray-800 text-lg leading-tight">{match.home_team.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Casa</p>
                </div>

                {/* Score / VS */}
                <div className="flex items-center gap-2 shrink-0">
                    {isPlayed ? (
                        <>
                            <span className="text-3xl font-extrabold text-emerald-600 w-8 text-center">{match.home_score}</span>
                            <span className="text-gray-300 font-bold text-xl">–</span>
                            <span className="text-3xl font-extrabold text-emerald-600 w-8 text-center">{match.away_score}</span>
                        </>
                    ) : (
                        <span className="text-lg font-bold text-gray-300 tracking-widest px-3">VS</span>
                    )}
                </div>

                {/* Away */}
                <div className="flex-1 text-left">
                    <p className="font-bold text-gray-800 text-lg leading-tight">{match.away_team.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Ospite</p>
                </div>
            </div>

            {!isPlayed && (
                <p className="text-center text-xs text-gray-400 mt-3 uppercase tracking-wider">Da giocare</p>
            )}
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalendarioPage() {
    const [matchdays, setMatchdays] = useState<Matchday[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [matches, setMatches] = useState<Match[]>([])
    const [loading, setLoading] = useState(true)
    const [usePlaceholder, setUsePlaceholder] = useState(false)

    // Load matchdays on mount
    useEffect(() => {
        async function fetchMatchdays() {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('matchdays')
                .select('id, number, date')
                .order('number')

            if (error || !data || data.length === 0) {
                setMatchdays(PLACEHOLDER_MATCHDAYS)
                setSelectedId(PLACEHOLDER_MATCHDAYS[0].id)
                setUsePlaceholder(true)
            } else {
                setMatchdays(data)
                setSelectedId(data[0].id)
            }
            setLoading(false)
        }
        fetchMatchdays()
    }, [])

    // Load matches when matchday changes
    useEffect(() => {
        if (!selectedId) return

        if (usePlaceholder) {
            setMatches(PLACEHOLDER_MATCHES[selectedId] ?? [])
            return
        }

        async function fetchMatches() {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('matches')
                .select(`
          id, matchday_id, home_score, away_score, played,
          home_team:teams!matches_home_team_id_fkey (id, name),
          away_team:teams!matches_away_team_id_fkey (id, name)
        `)
                .eq('matchday_id', selectedId)

            if (!error && data) {
                setMatches(data as unknown as Match[])
            }
        }
        fetchMatches()
    }, [selectedId, usePlaceholder])

    const selectedMatchday = matchdays.find((m) => m.id === selectedId)

    return (
        <div className="relative min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 pt-32 pb-16 px-6">
                <div className="max-w-screen-xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-white drop-shadow">Calendario</h1>
                    <p className="text-emerald-100 mt-2 text-lg">Partite per ogni giornata</p>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-6 py-10">
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Matchday Selector */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {matchdays.map((md) => (
                                <button
                                    key={md.id}
                                    onClick={() => setSelectedId(md.id)}
                                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${selectedId === md.id
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
                                        }`}
                                >
                                    {md.number}ª Giornata
                                </button>
                            ))}
                        </div>

                        {/* Matchday Info */}
                        {selectedMatchday && (
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {selectedMatchday.number}ª Giornata
                                </h2>
                                {selectedMatchday.date && (
                                    <p className="text-gray-500 text-sm mt-1">
                                        {new Date(selectedMatchday.date).toLocaleDateString('it-IT', {
                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                        })}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Matches */}
                        {matches.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <p className="text-lg">Nessuna partita programmata per questa giornata.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 max-w-2xl">
                                {matches.map((match) => (
                                    <MatchCard key={match.id} match={match} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}