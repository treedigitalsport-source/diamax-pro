import React, { useState, useCallback, useMemo } from 'react';
import {
  GameState,
  LineupSlot,
  Player,
  PlayAction,
  BattedBall,
  DefensiveShift,
  GameStateSnapshot
} from './types/baseball';
import { ROSTER_GUERREROS_55 } from './data/roster';
import { Header, ActiveTab } from './components/layout/Header';
import { CinematicIntro } from './components/layout/CinematicIntro';

// Dugout Components
import { DugoutScoreboard } from './components/dugout/DugoutScoreboard';
import { PitcherFatigueSemaphore } from './components/dugout/PitcherFatigueSemaphore';
import { CanonicalKeypad } from './components/dugout/CanonicalKeypad';

// Tactical & Field Components
import { TacticalField2D } from './components/tactics/TacticalField2D';
import { SprayChart } from './components/tactics/SprayChart';
import { StrikeZoneHeatmap } from './components/tactics/StrikeZoneHeatmap';

// Lineup & Markov Components
import { LineupBuilder } from './components/lineup/LineupBuilder';
import { OptimalLineupAdvisor } from './components/lineup/OptimalLineupAdvisor';

// Sabermetrics & Vision Components
import { SabermetricsDashboard } from './components/sabermetrics/SabermetricsDashboard';
import { BiomechanicsHUD } from './components/vision/BiomechanicsHUD';

// Scorecard & Rules Components
import { OfficialScorecard } from './components/scorecard/OfficialScorecard';
import { RulebookManual } from './components/rules/RulebookManual';

// Initial Batted Balls Sample
const INITIAL_BATTED_BALLS: BattedBall[] = [
  {
    id: 'bb-1',
    batterId: 1,
    batterName: 'Johan Olivo',
    pitcherId: 99,
    pitcherName: 'Rival Pitcher',
    x: 74,
    y: 38,
    distanceFt: 310,
    exitVeloMph: 98.4,
    launchAngleDeg: 18,
    result: '1B',
    quadrant: 4,
    inning: 1,
    outs: 0,
    timestamp: Date.now() - 3600000
  },
  {
    id: 'bb-2',
    batterId: 2,
    batterName: 'Pablo Morales',
    pitcherId: 99,
    pitcherName: 'Rival Pitcher',
    x: 48,
    y: 18,
    distanceFt: 385,
    exitVeloMph: 104.2,
    launchAngleDeg: 28,
    result: 'HR',
    quadrant: 5,
    inning: 1,
    outs: 0,
    timestamp: Date.now() - 3400000
  },
  {
    id: 'bb-3',
    batterId: 3,
    batterName: 'Raul Lozada',
    pitcherId: 99,
    pitcherName: 'Rival Pitcher',
    x: 28,
    y: 32,
    distanceFt: 325,
    exitVeloMph: 94.0,
    launchAngleDeg: 22,
    result: '2B',
    quadrant: 1,
    inning: 1,
    outs: 1,
    timestamp: Date.now() - 3200000
  },
  {
    id: 'bb-4',
    batterId: 4,
    batterName: 'Alí Zapata',
    pitcherId: 99,
    pitcherName: 'Rival Pitcher',
    x: 62,
    y: 52,
    distanceFt: 180,
    exitVeloMph: 88.5,
    launchAngleDeg: 8,
    result: '1B',
    quadrant: 7,
    inning: 2,
    outs: 0,
    timestamp: Date.now() - 2500000
  },
  {
    id: 'bb-5',
    batterId: 5,
    batterName: 'Richard Ceballos',
    pitcherId: 99,
    pitcherName: 'Rival Pitcher',
    x: 36,
    y: 65,
    distanceFt: 130,
    exitVeloMph: 82.0,
    launchAngleDeg: -4,
    result: 'GO',
    quadrant: 8,
    inning: 2,
    outs: 1,
    timestamp: Date.now() - 2200000
  }
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('envivo');
  const [daylightMode, setDaylightMode] = useState<boolean>(false);
  const [showIntro, setShowIntro] = useState<boolean>(false);

  // Initialize Lineup & Bench
  const initialLineup: LineupSlot[] = useMemo(() => {
    return ROSTER_GUERREROS_55.slice(0, 9).map((player: Player, idx: number) => ({
      order: idx + 1,
      player,
      pos: player.defaultPos || (idx === 0 ? 'CF' : idx === 1 ? 'SS' : idx === 2 ? 'P' : 'DH')
    }));
  }, []);

  const initialBench: Player[] = useMemo(() => {
    return ROSTER_GUERREROS_55.slice(9);
  }, []);

  // Main Game State
  const [gameState, setGameState] = useState<GameState>({
    gameId: 'GVE55-2026-FINAL',
    date: '19 Octubre 2026',
    venue: 'Estadio Chucho Ramos',
    homeTeam: 'Guerreros de Venezuela +55',
    awayTeam: 'Criollos Master',
    isHomeClub: true,
    scoreHome: 3,
    scoreAway: 1,
    currentInning: 3,
    isTopInning: false,
    outs: 1,
    balls: 2,
    strikes: 1,
    runners: {
      first: ROSTER_GUERREROS_55[0] || null,
      second: null,
      third: null
    },
    currentBatterIndex: 2, // 3rd batter in lineup
    currentPitcher: ROSTER_GUERREROS_55.find((p: Player) => p.num === 11) || ROSTER_GUERREROS_55[2],
    pitchCount: 42,
    battedBalls: INITIAL_BATTED_BALLS,
    lineup: initialLineup,
    bench: initialBench,
    defensiveShift: 'standard',
    history: []
  });

  // Toggle Daylight Stadium Mode
  const toggleDaylight = useCallback(() => {
    setDaylightMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('daylight-mode');
        document.body.classList.add('daylight-mode');
      } else {
        document.documentElement.classList.remove('daylight-mode');
        document.body.classList.remove('daylight-mode');
      }
      return next;
    });
  }, []);

  // Save State Snapshot for Undo Stack
  const createSnapshot = (state: GameState): GameStateSnapshot => ({
    scoreHome: state.scoreHome,
    scoreAway: state.scoreAway,
    currentInning: state.currentInning,
    isTopInning: state.isTopInning,
    outs: state.outs,
    balls: state.balls,
    strikes: state.strikes,
    runners: { ...state.runners },
    currentBatterIndex: state.currentBatterIndex,
    pitchCount: state.pitchCount
  });

  // Undo Functionality
  const handleUndo = useCallback(() => {
    setGameState(prev => {
      if (prev.history.length === 0) return prev;
      const newHistory = [...prev.history];
      const lastSnapshot = newHistory.pop();
      if (!lastSnapshot) return prev;

      return {
        ...prev,
        scoreHome: lastSnapshot.scoreHome,
        scoreAway: lastSnapshot.scoreAway,
        currentInning: lastSnapshot.currentInning,
        isTopInning: lastSnapshot.isTopInning,
        outs: lastSnapshot.outs,
        balls: lastSnapshot.balls,
        strikes: lastSnapshot.strikes,
        runners: lastSnapshot.runners,
        currentBatterIndex: lastSnapshot.currentBatterIndex,
        pitchCount: lastSnapshot.pitchCount,
        history: newHistory
      };
    });
  }, []);

  // Dispatch Play Action (36 Plays Keypad)
  const handlePlayAction = useCallback((action: PlayAction) => {
    setGameState(prev => {
      const snapshot = createSnapshot(prev);
      const newHistory = [...prev.history, snapshot];

      let { balls, strikes, outs, scoreHome, scoreAway, currentInning, isTopInning, runners, currentBatterIndex, pitchCount, battedBalls } = prev;
      pitchCount += 1;

      const currentBatter = prev.lineup[currentBatterIndex]?.player;

      switch (action) {
        case 'BALL':
          balls += 1;
          if (balls >= 4) {
            // Walk
            balls = 0;
            strikes = 0;
            // Advance runners
            runners = {
              first: currentBatter,
              second: runners.first,
              third: runners.second ? runners.second : runners.third
            };
            currentBatterIndex = (currentBatterIndex + 1) % prev.lineup.length;
          }
          break;

        case 'CALLED_STRIKE':
        case 'SWINGING_STRIKE':
          strikes += 1;
          if (strikes >= 3) {
            // Strikeout
            balls = 0;
            strikes = 0;
            outs += 1;
            currentBatterIndex = (currentBatterIndex + 1) % prev.lineup.length;
          }
          break;

        case 'FOUL':
          if (strikes < 2) strikes += 1;
          break;

        case 'SINGLE':
          balls = 0;
          strikes = 0;
          if (runners.third) {
            if (isTopInning) scoreAway += 1; else scoreHome += 1;
          }
          runners = {
            first: currentBatter,
            second: runners.first,
            third: runners.second
          };
          currentBatterIndex = (currentBatterIndex + 1) % prev.lineup.length;
          battedBalls = [
            ...battedBalls,
            {
              id: `bb-${Date.now()}`,
              batterId: currentBatter.id,
              batterName: currentBatter.name,
              pitcherId: prev.currentPitcher.id,
              pitcherName: prev.currentPitcher.name,
              x: 65 + Math.random() * 10,
              y: 40 + Math.random() * 10,
              distanceFt: 220,
              exitVeloMph: 92,
              launchAngleDeg: 12,
              result: '1B',
              quadrant: 5,
              inning: currentInning,
              outs,
              timestamp: Date.now()
            }
          ];
          break;

        case 'DOUBLE':
          balls = 0;
          strikes = 0;
          if (runners.third) { if (isTopInning) scoreAway += 1; else scoreHome += 1; }
          if (runners.second) { if (isTopInning) scoreAway += 1; else scoreHome += 1; }
          runners = {
            first: null,
            second: currentBatter,
            third: runners.first
          };
          currentBatterIndex = (currentBatterIndex + 1) % prev.lineup.length;
          break;

        case 'TRIPLE':
          balls = 0;
          strikes = 0;
          if (runners.third) { if (isTopInning) scoreAway += 1; else scoreHome += 1; }
          if (runners.second) { if (isTopInning) scoreAway += 1; else scoreHome += 1; }
          if (runners.first) { if (isTopInning) scoreAway += 1; else scoreHome += 1; }
          runners = { first: null, second: null, third: currentBatter };
          currentBatterIndex = (currentBatterIndex + 1) % prev.lineup.length;
          break;

        case 'HOME_RUN':
          balls = 0;
          strikes = 0;
          let hrRuns = 1;
          if (runners.first) hrRuns += 1;
          if (runners.second) hrRuns += 1;
          if (runners.third) hrRuns += 1;
          if (isTopInning) scoreAway += hrRuns; else scoreHome += hrRuns;
          runners = { first: null, second: null, third: null };
          currentBatterIndex = (currentBatterIndex + 1) % prev.lineup.length;
          battedBalls = [
            ...battedBalls,
            {
              id: `bb-${Date.now()}`,
              batterId: currentBatter.id,
              batterName: currentBatter.name,
              pitcherId: prev.currentPitcher.id,
              pitcherName: prev.currentPitcher.name,
              x: 50,
              y: 15,
              distanceFt: 395,
              exitVeloMph: 103,
              launchAngleDeg: 29,
              result: 'HR',
              quadrant: 5,
              inning: currentInning,
              outs,
              timestamp: Date.now()
            }
          ];
          break;

        case 'GROUND_OUT':
        case 'FLY_OUT':
        case 'LINE_OUT':
        case 'POP_OUT':
          balls = 0;
          strikes = 0;
          outs += 1;
          currentBatterIndex = (currentBatterIndex + 1) % prev.lineup.length;
          break;

        case 'DOUBLE_PLAY':
          balls = 0;
          strikes = 0;
          outs += 2;
          runners.first = null;
          currentBatterIndex = (currentBatterIndex + 1) % prev.lineup.length;
          break;

        default:
          break;
      }

      // Check Inning Flip on 3 Outs
      if (outs >= 3) {
        outs = 0;
        balls = 0;
        strikes = 0;
        runners = { first: null, second: null, third: null };
        if (isTopInning) {
          isTopInning = false;
        } else {
          isTopInning = true;
          currentInning += 1;
        }
      }

      return {
        ...prev,
        balls,
        strikes,
        outs,
        scoreHome,
        scoreAway,
        currentInning,
        isTopInning,
        runners,
        currentBatterIndex,
        pitchCount,
        battedBalls,
        history: newHistory
      };
    });
  }, []);

  // Shift Change
  const handleShiftChange = useCallback((newShift: DefensiveShift) => {
    setGameState(prev => ({ ...prev, defensiveShift: newShift }));
  }, []);

  // Field Click Batted Ball
  const handleFieldClick = useCallback((x: number, y: number, distanceFt: number, exitVeloMph: number) => {
    setGameState(prev => {
      const currentBatter = prev.lineup[prev.currentBatterIndex]?.player;
      let result: '1B' | '2B' | '3B' | 'HR' | 'GO' | 'FO' = '1B';
      if (distanceFt >= 350) result = 'HR';
      else if (distanceFt >= 280) result = '2B';
      else if (distanceFt >= 200) result = '1B';
      else result = 'GO';

      const newBall: BattedBall = {
        id: `bb-${Date.now()}`,
        batterId: currentBatter.id,
        batterName: currentBatter.name,
        pitcherId: prev.currentPitcher.id,
        pitcherName: prev.currentPitcher.name,
        x,
        y,
        distanceFt,
        exitVeloMph,
        launchAngleDeg: Math.round(distanceFt / 14),
        result,
        quadrant: 5,
        inning: prev.currentInning,
        outs: prev.outs,
        timestamp: Date.now()
      };

      return {
        ...prev,
        battedBalls: [...prev.battedBalls, newBall]
      };
    });
  }, []);

  // Lineup Reorder
  const handleLineupReorder = useCallback((newLineup: LineupSlot[]) => {
    setGameState(prev => ({ ...prev, lineup: newLineup }));
  }, []);

  // Bench Substitute
  const handleSubstitute = useCallback((orderIdx: number, newPlayer: Player) => {
    setGameState(prev => {
      const oldPlayer = prev.lineup[orderIdx].player;
      const newLineup = [...prev.lineup];
      newLineup[orderIdx] = { ...newLineup[orderIdx], player: newPlayer };
      const newBench = prev.bench.filter(p => p.id !== newPlayer.id).concat(oldPlayer);
      return {
        ...prev,
        lineup: newLineup,
        bench: newBench
      };
    });
  }, []);

  const currentBatter = gameState.lineup[gameState.currentBatterIndex]?.player;

  return (
    <div className={`min-h-screen bg-[#030712] text-slate-100 flex flex-col ${daylightMode ? 'daylight-mode' : ''}`}>
      {/* Cinematic Intro Screen Overlay */}
      {showIntro && (
        <CinematicIntro
          onEnterApp={() => setShowIntro(false)}
        />
      )}

      {/* Main OS Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        daylightMode={daylightMode}
        onToggleDaylight={toggleDaylight}
        onOpenIntro={() => setShowIntro(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Tab 1: EN VIVO (DUGOUT) */}
        {activeTab === 'envivo' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Live Stadium LED Scoreboard */}
            <DugoutScoreboard gameState={gameState} />

            {/* Medical Pitcher Fatigue Semaphore (+55 League) */}
            <PitcherFatigueSemaphore
              pitcher={gameState.currentPitcher}
              pitchCount={gameState.pitchCount}
              balls={gameState.balls}
              strikes={gameState.strikes}
            />

            {/* 36 Canonical Plays Keypad + Instant Undo */}
            <CanonicalKeypad
              onPlay={handlePlayAction}
              onUndo={handleUndo}
              canUndo={gameState.history.length > 0}
            />

            {/* Compact Tactical Field Preview */}
            <div className="bg-[#0B132B]/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Defensiva en Terreno & Shift Rápido
                </h4>
                <button
                  onClick={() => setActiveTab('campo')}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
                >
                  Abrir Terreno Completo →
                </button>
              </div>
              <TacticalField2D
                shift={gameState.defensiveShift}
                onShiftChange={handleShiftChange}
                onFieldClick={handleFieldClick}
                battedBalls={gameState.battedBalls}
              />
            </div>
          </div>
        )}

        {/* Tab 2: LINEUP & MARKOV SIMULATION */}
        {activeTab === 'lineup' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 1-9 Batting Order Builder */}
            <LineupBuilder
              lineup={gameState.lineup}
              bench={gameState.bench}
              onReorder={handleLineupReorder}
              onSubstitute={handleSubstitute}
            />

            {/* Pure Stochastic 24-State Markov Simulation & The Book Advisor */}
            <OptimalLineupAdvisor
              currentLineup={gameState.lineup}
              onApplyOptimal={handleLineupReorder}
            />
          </div>
        )}

        {/* Tab 3: CAMPO 2D, SPRAY CHART & STRIKE ZONE */}
        {activeTab === 'campo' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <TacticalField2D
              shift={gameState.defensiveShift}
              onShiftChange={handleShiftChange}
              onFieldClick={handleFieldClick}
              battedBalls={gameState.battedBalls}
            />

            <SprayChart
              battedBalls={gameState.battedBalls}
              selectedBatter={currentBatter}
              players={gameState.lineup.map(s => s.player)}
            />

            <StrikeZoneHeatmap
              player={currentBatter}
            />
          </div>
        )}

        {/* Tab 4: SABERMETRÍA */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-200">
            <SabermetricsDashboard roster={ROSTER_GUERREROS_55} />
          </div>
        )}

        {/* Tab 5: SCOUTAI BIOMECHANICS HUD */}
        {activeTab === 'skills' && (
          <div className="animate-in fade-in duration-200">
            <BiomechanicsHUD player={currentBatter} />
          </div>
        )}

        {/* Tab 6: TARJETA OFICIAL */}
        {activeTab === 'tarjeta' && (
          <div className="animate-in fade-in duration-200">
            <OfficialScorecard
              lineup={gameState.lineup}
              bench={gameState.bench}
              homeTeam={gameState.homeTeam}
              awayTeam={gameState.awayTeam}
              venue={gameState.venue}
              date={gameState.date}
            />
          </div>
        )}

        {/* Tab 7: REGLAMENTO +55 */}
        {activeTab === 'manual' && (
          <div className="animate-in fade-in duration-200">
            <RulebookManual />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#020617] py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <p>
          DIAMAX PRO OS • 3Tree Digital Sport IA Corp • Guerreros de Venezuela +55
        </p>
        <p className="text-[10px] text-slate-600 mt-1">
          Arquitectura React 19 + TypeScript Strict + Tailwind CSS • Zero-Trust Sports Intelligence
        </p>
      </footer>
    </div>
  );
};

export default App;
