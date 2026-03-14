'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Map, MapControls } from "@/components/ui/map";

import type { Team, Player } from '@/app/lib/db_queries'

// ─── Extended player type with goals ─────────────────────────────────────────
type PlayerWithGoals = Player & { goals: number }
type TeamWithGoals = Omit<Team, 'players'> & { players: PlayerWithGoals[] }

// ─── Placeholder data ─────────────────────────────────────────────────────────
const PLACEHOLDER_TEAMS: TeamWithGoals[] = [
    {
        id: '1', name: 'FC Rosso Fuoco', logo_url: null, company: 'Azienda Alpha S.p.A.',
        players: [
            { id: 'p1', first_name: 'Marco', last_name: 'Rossi', number: 10, goals: 7 },
            { id: 'p2', first_name: 'Luca', last_name: 'Bianchi', number: 7, goals: 3 },
            { id: 'p3', first_name: 'Andrea', last_name: 'Verdi', number: 5, goals: 1 },
            { id: 'p4', first_name: 'Giulio', last_name: 'Neri', number: 1, goals: 0 },
        ],
    },
    {
        id: '2', name: 'Gli Squali', logo_url: null, company: 'Beta Tech S.r.l.',
        players: [
            { id: 'p5', first_name: 'Simone', last_name: 'Ferrari', number: 9, goals: 5 },
            { id: 'p6', first_name: 'Matteo', last_name: 'Conti', number: 3, goals: 2 },
            { id: 'p7', first_name: 'Davide', last_name: 'Mancini', number: 11, goals: 4 },
        ],
    },
    {
        id: '3', name: 'Aquile Nere', logo_url: null, company: 'Gamma Group',
        players: [
            { id: 'p8', first_name: 'Roberto', last_name: 'Ricci', number: 4, goals: 6 },
            { id: 'p9', first_name: 'Francesco', last_name: 'Bruno', number: 8, goals: 2 },
            { id: 'p10', first_name: 'Stefano', last_name: 'Costa', number: 2, goals: 0 },
        ],
    },
    {
        id: '4', name: 'I Dragoni', logo_url: null, company: 'Delta Industries',
        players: [
            { id: 'p12', first_name: 'Nicola', last_name: 'Romano', number: 14, goals: 3 },
            { id: 'p13', first_name: 'Enzo', last_name: 'Lombardi', number: 21, goals: 8 },
        ],
    },
]

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <div className="bg-gray-200 h-24" />
            <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0" />
                        <div className="h-3 bg-gray-200 rounded flex-1" />
                        <div className="h-3 bg-gray-200 rounded w-8" />
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Team Card ────────────────────────────────────────────────────────────────
function TeamCard({ team }: { team: TeamWithGoals }) {
    const initials = team.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    const topScorer = [...team.players].sort((a, b) => b.goals - a.goals)[0]

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 flex items-center gap-4">
                {team.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={team.logo_url} alt={team.name} className="w-14 h-14 rounded-full object-cover bg-white" />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold shrink-0">
                        {initials}
                    </div>
                )}
                <div>
                    <h2 className="text-white text-xl font-bold leading-tight">{team.name}</h2>
                    {team.company && <p className="text-emerald-100 text-sm mt-0.5">{team.company}</p>}
                    {topScorer && topScorer.goals > 0 && (
                        <p className="text-emerald-200 text-xs mt-1">
                            ⚽ Bomber: {topScorer.first_name} {topScorer.last_name} ({topScorer.goals} gol)
                        </p>
                    )}
                </div>
            </div>

            {/* Players */}
            <div className="p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                    Giocatori ({team.players.length})
                </h3>
                {team.players.length === 0 ? (
                    <p className="text-gray-400 text-sm italic">Nessun giocatore registrato.</p>
                ) : (
                    <ul className="space-y-2">
                        {[...team.players]
                            .sort((a, b) => b.goals - a.goals)
                            .map((player) => (
                                <li key={player.id} className="flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0">
                                        {player.number ?? '—'}
                                    </span>
                                    <span className="text-gray-700 text-sm flex-1">
                                        {player.first_name} {player.last_name}
                                    </span>
                                    {player.goals > 0 && (
                                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                            ⚽ {player.goals}
                                        </span>
                                    )}
                                </li>
                            ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function TeamsPage() {
    const [teams, setTeams] = useState<TeamWithGoals[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchTeams() {
            const supabase = createClient()

            const { data: teamsData, error } = await supabase
                .from('teams')
                .select(`id, name, logo_url, company, players(id, first_name, last_name, number)`)
                .order('name')

            if (error || !teamsData || teamsData.length === 0) {
                setTeams(PLACEHOLDER_TEAMS)
                setLoading(false)
                return
            }

            // Fetch goal totals per player
            const { data: statsData } = await supabase
                .from('player_stats')
                .select('player_id, goals')

            const goalMap: Record<string, number> = {}
            if (statsData) {
                for (const row of statsData) {
                    goalMap[row.player_id] = (goalMap[row.player_id] ?? 0) + (row.goals ?? 0)
                }
            }

            const enriched: TeamWithGoals[] = (teamsData as unknown as Team[]).map((team) => ({
                ...team,
                players: team.players.map((p) => ({ ...p, goals: goalMap[p.id] ?? 0 })),
            }))

            setTeams(enriched)
            setLoading(false)
        }

        fetchTeams()
    }, [])

    return (
        <>
            <div className="h-[400px] w-full">
                <Map center={[-74.006, 40.7128]} zoom={12}
                    projection={{ type: "globe" }} />
            </div>
        </>
        /*
        <div className="relative min-h-screen bg-gray-50">
            
            <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 pt-32 pb-16 px-6">
                <div className="max-w-screen-xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-white drop-shadow">Squadre</h1>
                    <p className="text-emerald-100 mt-2 text-lg">
                        {loading ? 'Caricamento...' : `${teams.length} squadre iscritte al torneo`}
                    </p>
                </div>
            </div>

            
            <div className="max-w-screen-xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                        : teams.map((team) => <TeamCard key={team.id} team={team} />)
                    }
                </div>
            </div>
        </div>*/
    )
}
