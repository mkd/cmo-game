import { useState } from 'react';

const INITIAL_STATE = {
  year: 1,
  budget: 1000000,
  mentalAvailability: 15,
  physicalAvailability: 15,
  marketShare: 4.5,
  revenue: 4500000,
};

const MARKET_EVENTS = [
  { id: 1, title: 'Year 1: The Beginning', description: 'You have just joined. The board wants growth. 5C Context factor: Stable economy.', effect: 'neutral' },
  { id: 2, title: 'Year 2: Competitor Aggression', description: 'A rival brand launches a massive ad campaign. Mental Availability is harder to win.', effect: 'negative_ma' },
  { id: 3, title: 'Year 3: Supply Chain Issues', description: 'Collaborator delays hinder distribution. Physical Availability drops slightly.', effect: 'negative_pa' },
  { id: 4, title: 'Year 4: Changing Customer Needs', description: 'A new segment emerges. Some propose going niche.', effect: 'neutral' },
  { id: 5, title: 'Year 5: Final Push', description: 'This is your final year to prove your strategy to the board.', effect: 'positive_market' },
];

function App() {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [currentEvent, setCurrentEvent] = useState(MARKET_EVENTS[0]);
  const [phase, setPhase] = useState('intro'); // intro, event, allocate, summary, end
  const [allocations, setAllocations] = useState({ massReach: 0, targeted: 0, distribution: 0 });
  const [brandAssetStrategy, setBrandAssetStrategy] = useState('maintain');
  const [targetingStrategy, setTargetingStrategy] = useState('mass');

  const startGame = () => {
    setGameState(INITIAL_STATE);
    setPhase('event');
    setCurrentEvent(MARKET_EVENTS[0]);
    setAllocations({ massReach: 0, targeted: 0, distribution: 0 });
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const calculateNextYear = () => {
    let newMA = gameState.mentalAvailability;
    let newPA = gameState.physicalAvailability;

    // Allocation logic (Sharp)
    newMA += (allocations.massReach / 50000) * 1.5;
    newMA += (allocations.targeted / 50000) * 0.3; // Less efficient for pure MA
    newPA += (allocations.distribution / 50000) * 1.5;

    // Decisions impact
    if (brandAssetStrategy === 'refresh') {
      newMA -= 15; // Huge penalty for changing codes
    } else {
      newMA += 2; // Slight bump for consistency
    }

    if (targetingStrategy === 'niche') {
      newMA = Math.min(newMA, 40); // Cap MA if niched
    }

    // Event impact
    if (currentEvent.effect === 'negative_ma') newMA -= 5;
    if (currentEvent.effect === 'negative_pa') newPA -= 5;

    newMA = Math.min(100, Math.max(0, newMA));
    newPA = Math.min(100, Math.max(0, newPA));

    // Market Share Calculation (Penetration driven)
    let marketMultiplier = currentEvent.effect === 'positive_market' ? 1.1 : 1.0;
    // Base 0 to 40% MS based on MA and PA
    let calculatedMS = ((newMA * 0.6) + (newPA * 0.4)) * 0.4 * marketMultiplier; 
    let newMarketShare = Math.max(0, calculatedMS);

    let marketSize = 100000000; // 100M total
    let newRevenue = marketSize * (newMarketShare / 100);
    
    // Budget is 20% of revenue + base 200k
    let nextBudget = (newRevenue * 0.2) + 200000;

    const nextGameState = {
      year: gameState.year + 1,
      budget: nextBudget,
      mentalAvailability: parseFloat(newMA.toFixed(1)),
      physicalAvailability: parseFloat(newPA.toFixed(1)),
      marketShare: parseFloat(newMarketShare.toFixed(1)),
      revenue: newRevenue,
    };

    setGameState(nextGameState);
    setAllocations({ massReach: 0, targeted: 0, distribution: 0 });
    
    if (nextGameState.year > 5) {
      setPhase('end');
    } else {
      setCurrentEvent(MARKET_EVENTS[nextGameState.year - 1]);
      setPhase('summary');
    }
  };

  const handleAllocationChange = (key, value) => {
    const totalOthers = Object.entries(allocations).reduce((sum, [k, v]) => k !== key ? sum + v : sum, 0);
    let newVal = parseInt(value) || 0;
    if (totalOthers + newVal > gameState.budget) {
      newVal = gameState.budget - totalOthers;
    }
    setAllocations({ ...allocations, [key]: newVal });
  };

  const totalAllocated = allocations.massReach + allocations.targeted + allocations.distribution;
  const remainingBudget = gameState.budget - totalAllocated;

  return (
    <div className="container">
      <header style={{ marginBottom: '40px', textAlign: 'center', backgroundColor: 'var(--bg-color)', padding: '10px', borderBottom: '4px solid var(--text-color)' }}>
        <h1 style={{ color: 'var(--primary)', textShadow: '2px 2px 0px var(--secondary)' }}>The Growth Engine</h1>
        <p style={{ color: 'var(--accent)' }}>A CMO Strategy Simulator</p>
      </header>

      {phase === 'intro' && (
        <div className="pixel-panel">
          <h2>Welcome, Chief Marketing Officer</h2>
          <p style={{ marginBottom: '20px' }}>
            You have been hired to lead marketing. Your mission: Grow Market Share and Revenue over 5 years.
          </p>
          <p style={{ marginBottom: '30px', color: 'var(--tertiary)' }}>
            Remember: Strategy is about choice (Chernev), but Growth requires mental and physical availability (Sharp). 
            Don't get distracted by flashy rebrands or over-segmentation!
          </p>
          <button className="pixel-btn" onClick={startGame}>Start Year 1</button>
        </div>
      )}

      {phase === 'summary' && (
        <div className="pixel-panel">
          <h2 style={{ color: 'var(--accent)' }}>Year {gameState.year - 1} Results</h2>
          <p>Financial results are in:</p>
          <ul style={{ margin: '20px', lineHeight: '2' }}>
            <li>Market Share: <strong>{gameState.marketShare}%</strong></li>
            <li>Revenue: <strong>{formatCurrency(gameState.revenue)}</strong></li>
            <li>Mental Availability: <strong>{gameState.mentalAvailability} / 100</strong></li>
            <li>Physical Availability: <strong>{gameState.physicalAvailability} / 100</strong></li>
          </ul>
          <p style={{ marginBottom: '20px' }}>Your budget for Year {gameState.year} is set to {formatCurrency(gameState.budget)}.</p>
          <button className="pixel-btn" onClick={() => setPhase('event')}>Continue to Year {gameState.year}</button>
        </div>
      )}

      {phase === 'end' && (
        <div className="pixel-panel">
          <h2 style={{ color: 'var(--primary)' }}>Final Board Review</h2>
          <p style={{ marginBottom: '20px' }}>You completed 5 years as CMO. Here are your final results:</p>
          <ul style={{ margin: '20px', lineHeight: '2' }}>
            <li>Final Market Share: <strong>{gameState.marketShare}%</strong></li>
            <li>Final Revenue: <strong style={{ color: 'var(--accent)' }}>{formatCurrency(gameState.revenue)}</strong></li>
          </ul>
          
          <div style={{ padding: '20px', border: '2px dashed var(--secondary)', marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--secondary)' }}>Takeaways:</h3>
            <p style={{ fontSize: '18px' }}>
              {gameState.marketShare > 20 
                ? "Excellent growth! You proved that focusing on broad Mental and Physical Availability (Sharp rules) while maintaining value (Chernev) leads to category dominance."
                : "Growth was stagnant. Over-segmenting, constantly changing Distinctive Brand Assets, or neglecting broad reach stunts penetration. Memory structures are hard to build!"}
            </p>
          </div>
          
          <button className="pixel-btn" onClick={startGame}>Play Again</button>
        </div>
      )}

      {/* ALLOCATE and EVENT PHASES */}
      {(phase === 'event' || phase === 'allocate') && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
          
          <main>
            {phase === 'event' && (
              <div className="pixel-panel" style={{ animation: 'fadeIn 0.5s' }}>
                <h2 style={{ color: 'var(--secondary)' }}>Event (5C Context)</h2>
                <h3 style={{ fontSize: '20px' }}>{currentEvent.title}</h3>
                <p style={{ marginBottom: '30px', marginTop: '10px' }}>{currentEvent.description}</p>
                <div style={{ textAlign: 'right' }}>
                  <button className="pixel-btn" onClick={() => setPhase('allocate')}>Plan Strategy &gt;</button>
                </div>
              </div>
            )}

            {phase === 'allocate' && (
              <div className="pixel-panel" style={{ animation: 'fadeIn 0.5s' }}>
                <h2 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Strategy & Budget</h2>
                <div style={{ background: '#222', padding: '10px', marginBottom: '20px', border: '2px solid var(--text-color)' }}>
                  Unallocated: <span style={{ color: remainingBudget < 0 ? 'var(--danger)' : 'var(--accent)', fontSize: '24px' }}>{formatCurrency(remainingBudget)}</span>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ borderBottom: '2px solid', paddingBottom: '5px' }}>1. Marketing Mix (Sharp)</h3>
                  
                  <label style={{ display: 'block', marginTop: '15px', fontSize: '18px' }}>Mass Reach Ads ($)</label>
                  <p style={{ fontSize: '14px', color: 'var(--tertiary)' }}>Builds Mental Availability across all buyers.</p>
                  <input type="range" min="0" max={gameState.budget} step="10000" 
                    value={allocations.massReach} onChange={(e) => handleAllocationChange('massReach', e.target.value)} 
                    style={{ width: '100%', margin: '10px 0' }} />
                  <div style={{ fontSize: '16px' }}>{formatCurrency(allocations.massReach)}</div>

                  <label style={{ display: 'block', marginTop: '15px', fontSize: '18px' }}>Targeted Loyalty Ads ($)</label>
                  <p style={{ fontSize: '14px', color: 'var(--tertiary)' }}>Focus on heavy buyers. Less impact on total penetration.</p>
                  <input type="range" min="0" max={gameState.budget} step="10000" 
                    value={allocations.targeted} onChange={(e) => handleAllocationChange('targeted', e.target.value)} 
                    style={{ width: '100%', margin: '10px 0' }} />
                  <div style={{ fontSize: '16px' }}>{formatCurrency(allocations.targeted)}</div>

                  <label style={{ display: 'block', marginTop: '15px', fontSize: '18px' }}>Distribution Expansion ($)</label>
                  <p style={{ fontSize: '14px', color: 'var(--tertiary)' }}>Increases Physical Availability.</p>
                  <input type="range" min="0" max={gameState.budget} step="10000" 
                    value={allocations.distribution} onChange={(e) => handleAllocationChange('distribution', e.target.value)} 
                    style={{ width: '100%', margin: '10px 0' }} />
                  <div style={{ fontSize: '16px' }}>{formatCurrency(allocations.distribution)}</div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ borderBottom: '2px solid', paddingBottom: '5px' }}>2. Positioning & Assets (Chernev)</h3>
                  
                  <label style={{ display: 'block', marginTop: '15px', fontSize: '18px' }}>Targeting Segment</label>
                  <select value={targetingStrategy} onChange={(e) => setTargetingStrategy(e.target.value)}
                    style={{ width: '100%', padding: '10px', fontSize: '16px', background: 'var(--bg-color)', color: 'var(--text-color)', border: '2px solid var(--text-color)', fontFamily: 'inherit', marginTop: '10px' }}>
                    <option value="mass">Mass Market (Broad Targeting)</option>
                    <option value="niche">Hyper-Niche (Targeted Value Prop)</option>
                  </select>

                  <label style={{ display: 'block', marginTop: '15px', fontSize: '18px' }}>Distinctive Brand Assets (DBAs)</label>
                  <select value={brandAssetStrategy} onChange={(e) => setBrandAssetStrategy(e.target.value)}
                    style={{ width: '100%', padding: '10px', fontSize: '16px', background: 'var(--bg-color)', color: 'var(--text-color)', border: '2px solid var(--text-color)', fontFamily: 'inherit', marginTop: '10px' }}>
                    <option value="maintain">Maintain Consistency (Reinforce Memory)</option>
                    <option value="refresh">Complete Rebrand (Change Logo/Colors)</option>
                  </select>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button className="pixel-btn" onClick={calculateNextYear}>Execute Year {gameState.year} &gt;</button>
                </div>
              </div>
            )}
          </main>

          <aside>
            <div className="pixel-panel" style={{ fontSize: '20px', position: 'sticky', top: '20px' }}>
              <h3 style={{ borderBottom: '2px solid var(--text-color)', paddingBottom: '10px', marginBottom: '15px' }}>Status Data</h3>
              <p>Year: <strong style={{color: 'var(--primary)'}}>{gameState.year} / 5</strong></p>
              <p>Budget: <strong>{formatCurrency(gameState.budget)}</strong></p>
              <div style={{ height: '20px' }}></div>
              <p>Market Share: <strong>{gameState.marketShare}%</strong></p>
              <p>Revenue: <strong>{formatCurrency(gameState.revenue)}</strong></p>
              <div style={{ marginTop: '15px', color: 'var(--tertiary)', borderTop: '2px dashed #444', paddingTop: '15px' }}>
                <p>Mental Avail: {gameState.mentalAvailability}/100</p>
                <div style={{ width: '100%', height: '10px', background: '#333', marginTop: '5px', marginBottom: '15px' }}>
                  <div style={{ width: `${gameState.mentalAvailability}%`, height: '100%', background: 'var(--secondary)' }}></div>
                </div>
                
                <p>Physical Avail: {gameState.physicalAvailability}/100</p>
                <div style={{ width: '100%', height: '10px', background: '#333', marginTop: '5px' }}>
                  <div style={{ width: `${gameState.physicalAvailability}%`, height: '100%', background: 'var(--secondary)' }}></div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      )}

    </div>
  );
}

export default App;
