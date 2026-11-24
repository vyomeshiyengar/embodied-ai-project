import { useState } from 'react';
import type { Department } from '../../data/schema';

export default function RisksView({ dept }: { dept: Department }) {
  const [mode, setMode] = useState<'current' | 'swans'>('current');
  const { current, blackSwans, intro } = dept.risks;

  return (
    <section>
      <p className="label"><span className="num">2</span>Risks</p>
      <p className="view-intro">{intro}</p>

      <div className="toolbar">
        <div className="seg" role="tablist">
          <button className={mode === 'current' ? 'on' : ''} onClick={() => setMode('current')}>
            What exists today<span className="count">{current.length}</span>
          </button>
          <button className={mode === 'swans' ? 'on' : ''} onClick={() => setMode('swans')}>
            Black swans<span className="count">{blackSwans.length}</span>
          </button>
        </div>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>
          {mode === 'current' ? 'Harms already showing up in real deployments' : 'Rare, severe failures of plausible future implementations'}
        </span>
      </div>

      {mode === 'current' ? (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Risk</th>
                <th>Who is impacted</th>
                <th>What could make it worse</th>
                <th>Real-world case</th>
              </tr>
            </thead>
            <tbody>
              {current.map((r) => (
                <tr key={r.id} className="row">
                  <td className="name">{r.name}</td>
                  <td>
                    {r.whoImpacted}
                    {r.mostVulnerable && (
                      <div><span className="vuln">Most vulnerable: {r.mostVulnerable}</span></div>
                    )}
                  </td>
                  <td>{r.whatMakesWorse}</td>
                  <td className="case">{r.realWorldCase ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="swan-grid">
          {blackSwans.map((s, i) => (
            <article key={s.id} className="swan">
              <span className="k">Black swan {i + 1}</span>
              <h3>{s.name}</h3>
              <p>{s.scenario}</p>
              <dl>
                <div>
                  <dt>Who is impacted</dt>
                  <dd>
                    {s.whoImpacted}
                    {s.mostVulnerable && <div><span className="vuln">Most vulnerable: {s.mostVulnerable}</span></div>}
                  </dd>
                </div>
                <div>
                  <dt>What could make it worse</dt>
                  <dd>{s.whatMakesWorse}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
