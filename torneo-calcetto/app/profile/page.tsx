import { getUserProfile, getUserStats, getTeamStandings } from '@/app/lib/db_queries'
import { redirect } from 'next/navigation'
import ChangePasswordForm from '../components/ChangePasswordForm'

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-2xl font-extrabold text-gray-800">{value}</p>
                <p className="text-sm text-gray-400">{label}</p>
            </div>
        </div>
    )
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-400 font-medium">{label}</span>
            <span className="text-sm text-gray-700 font-semibold">{value || '—'}</span>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProfilePage() {
    const profile = await getUserProfile()

    // If not logged in, redirect to login
    if (!profile) {
        redirect('/login')
    }

    // Fetch stats only if linked to a player
    const stats = profile.player_id
        ? await getUserStats(profile.player_id)
        : { goals: 0, assists: 0 }

    const teamStandings = profile.team_id
        ? await getTeamStandings(profile.team_id)
        : null

    const dobFormatted = profile.dob
        ? new Date(profile.dob).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
        : null

    return (
        <div className="relative min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 pt-32 pb-24 px-6">
                <div className="max-w-screen-xl mx-auto flex items-center gap-5">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold border-2 border-white/40 shrink-0">
                        {(profile.first_name?.[0] ?? '') + (profile.last_name?.[0] ?? '') || '?'}
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white drop-shadow">
                            {profile.first_name} {profile.last_name}
                        </h1>
                        <p className="text-emerald-100 mt-1">{profile.email}</p>
                        {profile.company && (
                            <p className="text-emerald-200 text-sm mt-0.5">{profile.company}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-6 -mt-8 pb-16 space-y-8">

                {/* ── Personal Info ── */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Dati Personali</h2>
                    <InfoRow label="Nome" value={profile.first_name} />
                    <InfoRow label="Cognome" value={profile.last_name} />
                    <InfoRow label="Data di nascita" value={dobFormatted} />
                    <InfoRow label="Azienda" value={profile.company} />
                    <InfoRow label="Email" value={profile.email} />
                </section>

                {/* ── My Stats ── */}
                <section>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Le Mie Statistiche</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <StatCard
                            label="Gol"
                            value={stats.goals}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z" />
                                </svg>
                            }
                        />
                        <StatCard
                            label="Assist"
                            value={stats.assists}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 3M21 7.5H7.5" />
                                </svg>
                            }
                        />
                        {!profile.player_id && (
                            <div className="col-span-full text-sm text-gray-400 italic">
                                Nessun profilo giocatore collegato.
                            </div>
                        )}
                    </div>
                </section>

                {/* ── Team Stats ── */}
                {teamStandings ? (
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            La Mia Squadra — {teamStandings.team.name}
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[
                                { label: 'Punti', value: teamStandings.points },
                                { label: 'Vittorie', value: teamStandings.wins },
                                { label: 'Pareggi', value: teamStandings.draws },
                                { label: 'Sconfitte', value: teamStandings.losses },
                                { label: 'Gol Fatti', value: teamStandings.goals_for },
                                { label: 'Gol Subiti', value: teamStandings.goals_against },
                            ].map((s) => (
                                <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                                    <p className="text-2xl font-extrabold text-emerald-600">{s.value}</p>
                                    <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : (
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">La Mia Squadra</h2>
                        <p className="text-gray-400 text-sm italic">Non sei ancora associato a nessuna squadra.</p>
                    </section>
                )}

                {/* ── Settings ── */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Impostazioni</h2>
                    <ChangePasswordForm />
                </section>

            </div>
        </div>
    )
}
