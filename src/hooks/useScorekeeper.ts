import { useState } from "react";
import { MatchState, HalfInning } from "../types/baseball";
import { updateMatchScore, recordPlayEvent } from "../services/matchService";

export const useScorekeeper = (initialMatch: MatchState) => {
  const [match, setMatch] = useState<MatchState>(initialMatch);

  const registerBall = async () => {
    if (match.balls >= 3) {
      // Base por bolas (Walk)
      await applyWalk();
    } else {
      const nextBalls = match.balls + 1;
      setMatch(prev => ({ ...prev, balls: nextBalls }));
      await updateMatchScore(match.id, { balls: nextBalls });
    }
  };

  const registerStrike = async () => {
    if (match.strikes >= 2) {
      // Ponche (Strikeout / Out)
      await registerOut();
    } else {
      const nextStrikes = match.strikes + 1;
      setMatch(prev => ({ ...prev, strikes: nextStrikes }));
      await updateMatchScore(match.id, { strikes: nextStrikes });
    }
  };

  const registerOut = async () => {
    if (match.outs >= 2) {
      // 3 outs: Cambio de entrada
      await switchInning();
    } else {
      const nextOuts = match.outs + 1;
      setMatch(prev => ({ ...prev, outs: nextOuts, balls: 0, strikes: 0 }));
      await updateMatchScore(match.id, { outs: nextOuts, balls: 0, strikes: 0 });
    }
  };

  const switchInning = async () => {
    const isTop = match.halfInning === "TOP";
    const nextHalf: HalfInning = isTop ? "BOTTOM" : "TOP";
    const nextInning = isTop ? match.currentInning : match.currentInning + 1;

    const updates: Partial<MatchState> = {
      halfInning: nextHalf,
      currentInning: nextInning,
      balls: 0,
      strikes: 0,
      outs: 0,
      runners: { first: null, second: null, third: null }
    };

    setMatch(prev => ({ ...prev, ...updates }));
    await updateMatchScore(match.id, updates);
  };

  const applyWalk = async () => {
    // Lógica simplificada de avance forzado por Base por Bolas
    let r1 = "batter_walk";
    let r2 = match.runners.first ? match.runners.second : match.runners.second;
    let r3 = (match.runners.first && match.runners.second) ? match.runners.third : match.runners.third;

    const updates: Partial<MatchState> = {
      balls: 0,
      strikes: 0,
      runners: { first: r1, second: r2, third: r3 }
    };

    setMatch(prev => ({ ...prev, ...updates }));
    await updateMatchScore(match.id, updates);
  };

  return {
    match,
    registerBall,
    registerStrike,
    registerOut,
    switchInning
  };
};
