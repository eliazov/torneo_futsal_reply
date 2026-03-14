import { createClient } from '@/utils/supabase/server'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Player = {
    id: string
    first_name: string
    last_name: string
    number: number | null
}

export type Team = {
    id: string
    name: string
    logo_url: string | null
    company: string | null
    players: Player[]
}

export type Matchday = {
    id: string
    number: number
    date: string | null
}

export type Match = {
    id: string
    matchday_id: string
    home_team: { id: string; name: string }
    away_team: { id: string; name: string }
    home_score: number | null
    away_score: number | null
    played: boolean
}

export type StandingsRow = {
    id: string
    team: { id: string; name: string }
    points: number
    wins: number
    draws: number
    losses: number
    goals_for: number
    goals_against: number
}

export type PlayerStats = {
    goals: number
    assists: number
}

export type UserProfile = {
    id: string
    email: string | undefined
    first_name: string | null
    last_name: string | null
    dob: string | null
    company: string | null
    player_id: string | null
    team_id: string | null
}

export type TeamRegistration = {
    id: string
    team_name: string
    company: string | null
    contact_email: string
    contact_name: string | null
    status: 'pending' | 'accepted' | 'rejected'
    created_at: string
    notes: string | null
}

// ─── Teams ─────────────────────────────────────────────────────────────────────

/**
 * Fetch all teams with their players.
 * Assumes tables: `teams`, `players` (foreign key: players.team_id → teams.id)
 */
export async function getTeamsWithPlayers(): Promise<Team[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('teams')
        .select(`
      id,
      name,
      logo_url,
      company,
      players (
        id,
        first_name,
        last_name,
        number
      )
    `)
        .order('name')

    if (error) {
        console.error('getTeamsWithPlayers error:', error)
        return []
    }

    return (data as Team[]) ?? []
}

// ─── Calendar ──────────────────────────────────────────────────────────────────

/**
 * Fetch all matchdays ordered by number.
 * Assumes table: `matchdays`
 */
export async function getMatchdays(): Promise<Matchday[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('matchdays')
        .select('id, number, date')
        .order('number')

    if (error) {
        console.error('getMatchdays error:', error)
        return []
    }

    return data ?? []
}

/**
 * Fetch all matches for a specific matchday.
 * Assumes tables: `matches`, `teams`
 */
export async function getMatchesByMatchday(matchdayId: string): Promise<Match[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('matches')
        .select(`
      id,
      matchday_id,
      home_score,
      away_score,
      played,
      home_team:teams!matches_home_team_id_fkey (id, name),
      away_team:teams!matches_away_team_id_fkey (id, name)
    `)
        .eq('matchday_id', matchdayId)

    if (error) {
        console.error('getMatchesByMatchday error:', error)
        return []
    }

    return (data as unknown as Match[]) ?? []
}

// ─── Standings ─────────────────────────────────────────────────────────────────

/**
 * Fetch the full standings table ordered by points.
 * Assumes tables: `standings`, `teams`
 */
export async function getStandings(): Promise<StandingsRow[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('standings')
        .select(`
      id,
      points,
      wins,
      draws,
      losses,
      goals_for,
      goals_against,
      team:teams (id, name)
    `)
        .order('points', { ascending: false })

    if (error) {
        console.error('getStandings error:', error)
        return []
    }

    return (data as unknown as StandingsRow[]) ?? []
}

// ─── Profile ───────────────────────────────────────────────────────────────────

/**
 * Fetch the logged-in user's profile and linked player/team IDs.
 * Reads auth metadata + players table.
 */
export async function getUserProfile(): Promise<UserProfile | null> {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        console.error('getUserProfile auth error:', authError)
        return null
    }

    const meta = user.user_metadata ?? {}

    // Optionally link to a `players` row by user_id
    const { data: playerRow } = await supabase
        .from('players')
        .select('id, team_id')
        .eq('user_id', user.id)
        .single()

    return {
        id: user.id,
        email: user.email,
        first_name: meta.first_name ?? null,
        last_name: meta.last_name ?? null,
        dob: meta.dob ?? null,
        company: meta.company ?? null,
        player_id: playerRow?.id ?? null,
        team_id: playerRow?.team_id ?? null,
    }
}

/**
 * Fetch goal and assist totals for a player.
 * Assumes table: `player_stats` (player_id, goals, assists)
 */
export async function getUserStats(playerId: string): Promise<PlayerStats> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('player_stats')
        .select('goals, assists')
        .eq('player_id', playerId)

    if (error || !data) {
        console.error('getUserStats error:', error)
        return { goals: 0, assists: 0 }
    }

    const goals = data.reduce((sum, row) => sum + (row.goals ?? 0), 0)
    const assists = data.reduce((sum, row) => sum + (row.assists ?? 0), 0)
    return { goals, assists }
}

/**
 * Fetch a team's standings row.
 * Assumes table: `standings`
 */
export async function getTeamStandings(teamId: string): Promise<StandingsRow | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('standings')
        .select(`
      id, points, wins, draws, losses, goals_for, goals_against,
      team:teams (id, name)
    `)
        .eq('team_id', teamId)
        .single()

    if (error) {
        console.error('getTeamStandings error:', error)
        return null
    }

    return data as unknown as StandingsRow
}

// ─── Admin ─────────────────────────────────────────────────────────────────────

/**
 * Fetch all team registration requests.
 * Assumes table: `team_registrations`
 */
export async function getTeamRegistrations(): Promise<TeamRegistration[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('team_registrations')
        .select('id, team_name, company, contact_email, contact_name, status, created_at, notes')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('getTeamRegistrations error:', error)
        return []
    }

    return (data as TeamRegistration[]) ?? []
}

/**
 * Update the status of a team registration.
 */
export async function updateTeamRegistrationStatus(
    id: string,
    status: 'accepted' | 'rejected'
): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('team_registrations')
        .update({ status })
        .eq('id', id)

    if (error) {
        console.error('updateTeamRegistrationStatus error:', error)
    }
}
