import { useEffect, useState } from 'react';
import type { AuthorityLevel, Department } from '../../data/schema';

const LEVELS: { id: AuthorityLevel; blurb: string }[] = [
  { id: 'Federal', blurb: 'National agencies and statutes' },
  { id: 'State', blurb: 'State law, permits and liability' },
  { id: 'City', blurb: 'Local ordinances, zoning, contracts' },
];

export default function RegulationView({ dept, focus }: { dept: Department; focus?: string }) {
  const [level, setLevel] = useState<AuthorityLevel | 'All'>('All');
  const { laws, gaps, intro } = dept.regulation;
  const hasIntl = laws.some((l) => l.levels.includes('International'));
  const shown = level === 'All' ? laws : laws.filter((l) => l.levels.includes(level));

  useEffect(() => {
    if (!focus) return;
    setLevel('All');
    requestAnimationFrame(() => document.getElementById('law-' + focus)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  }, [focus]);

  return (
    <section>
      <p className="label"><span className="num">3</span>Regulations</p>
      <p className="view-intro">{intro}</p>

      <div className="level-cards">
        {LEVELS.map((l) => {
          const n = laws.filter((x) => x.levels.includes(l.id)).length;
          return (
            <button
              key={l.id}
              className={`level-card ${l.id}` + (level === l.id ? ' on' : '')}
              onClick={() => setLevel(level === l.id ? 'All' : l.id)}
            >
              <span className="t">{l.id}</span>
              <span className="s">{n} {n === 1 ? 'law' : 'laws'} · {l.blurb}</span>
            </button>
          );
        })}
      </div>

      <div className="toolbar">
        <div className="seg">
          {(['All', 'Federal', 'State', 'City', ...(hasIntl ? (['International'] as const) : [])] as const).map((l) => (
            <button key={l} className={level === l ? 'on' : ''} onClick={() => setLevel(l)}>
              {l === 'International' ? 'Outside US' : l}
              <span className="count">{l === 'All' ? laws.length : laws.filter((x) => x.levels.includes(l)).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Law / regime</th>
              <th style={{ width: '14%' }}>Authority</th>
              <th>What it covers</th>
              <th>Where it falls short for this technology</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((l) => (
              <tr key={l.id} id={'law-' + l.id} className={'row' + (l.id === focus ? ' highlight' : '')}>
                <td className="name">{l.name}</td>
                <td>
                  {l.levels.map((lv) => (
                    <span key={lv} className={`tag ${lv}`}>{lv === 'International' ? 'Outside US' : lv}</span>
                  ))}
                  {l.authority !== l.levels.join(' / ') && <span className="authority">{l.authority}</span>}
                </td>
                <td>{l.covers}</td>
                <td className="case">{l.fallsShort}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="gaps">
        <h3>Who answers when it fails?</h3>
        <p className="sub">Gaps nothing currently covers</p>
        <ol>
          {gaps.map((g) => (
            <li key={g.title}>
              <div>
                <b>{g.title}</b>
                <span>{g.detail}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
