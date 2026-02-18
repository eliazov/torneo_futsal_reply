export default function Home() {
  return (
    <div className="relative min-h-screen bg-white overflow-auto">
      {/* Green Background Shape with Oblique Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[85%] bg-emerald-600"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 70%)' }}
      />

      {/* Content */}
      <div className="pt-24 md:pt-32 lg:pt-40 w-[95%] max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Next Match Card - Taller */}
        <div className="bg-white backdrop-blur-sm rounded-lg p-8 shadow-lg h-96 flex flex-col justify-center">
          <span className="text-sm font-semibold text-emerald-600 mb-2 uppercase tracking-wide">Prossima Partita</span>
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-black drop-shadow-sm">Finale Torneo</h1>
          <div className="flex items-center justify-between mt-4">
            <div className="text-center">
              <p className="font-bold text-xl text-gray-800">Squadra Alpha</p>
            </div>
            <span className="text-2xl font-bold text-gray-400">vs</span>
            <div className="text-center">
              <p className="font-bold text-xl text-gray-800">Squadra Omega</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 font-medium mt-6 text-center">20 Febbraio, 21:00</p>
        </div>

        {/* Previous Matches Column - Stack of Cards */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white drop-shadow-md mb-2">Risultati Recenti</h2>

          {/* Previous Match Card 1 */}
          <div className="bg-white backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">Squadra A</span>
              <span className="font-bold text-xl text-emerald-600">3 - 2</span>
              <span className="font-semibold text-gray-800">Squadra B</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">15 Febbraio</p>
          </div>

          {/* Previous Match Card 2 */}
          <div className="bg-white backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">Squadra C</span>
              <span className="font-bold text-xl text-emerald-600">1 - 1</span>
              <span className="font-semibold text-gray-800">Squadra D</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">14 Febbraio</p>
          </div>
        </div>
      </div>

      {/* Standings Section */}
      <div className="w-[95%] max-w-screen-xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 drop-shadow-sm">Classifica</h2>
        <div className="bg-white backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Squadra</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PT</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">G</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">V</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">N</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">P</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">DR</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Dummy Data Rows */}
                {[
                  { pos: 1, name: 'Squadra Alpha', pt: 15, g: 5, v: 5, n: 0, p: 0, dr: '+12' },
                  { pos: 2, name: 'Squadra Beta', pt: 12, g: 5, v: 4, n: 0, p: 1, dr: '+8' },
                  { pos: 3, name: 'Squadra Gamma', pt: 9, g: 5, v: 3, n: 0, p: 2, dr: '+2' },
                  { pos: 4, name: 'Squadra Delta', pt: 6, g: 5, v: 2, n: 0, p: 3, dr: '-3' },
                  { pos: 5, name: 'Squadra Epsilon', pt: 3, g: 5, v: 1, n: 0, p: 4, dr: '-8' },
                  { pos: 6, name: 'Squadra Zeta', pt: 0, g: 5, v: 0, n: 0, p: 5, dr: '-11' },
                ].map((team) => (
                  <tr key={team.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{team.pos}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-emerald-600">{team.pt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.g}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.v}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.n}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.p}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.dr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>


    </div>
  );
}
