import { departments, getDepartment } from './data/departments';
import { useRoute, type Tab } from './router';
import TypesView from './components/views/TypesView';
import RisksView from './components/views/RisksView';
import RegulationView from './components/views/RegulationView';
import CaseStudiesView from './components/views/CaseStudiesView';
import type { Department } from './data/schema';

function tabCards(d: Department): { id: Tab; title: string; sub: string; cls: string }[] {
  const levels = new Set(d.regulation.laws.flatMap((l) => l.levels));
  return [
    { id: 'types', title: 'Types', sub: `${d.types.items.length} types across ${d.types.zones.length} zones`, cls: 'types' },
    {
      id: 'risks',
      title: 'Risks',
      sub: `${d.risks.current.length} current · ${d.risks.blackSwans.length} black swans`,
      cls: 'risks',
    },
    {
      id: 'regulation',
      title: 'Regulations',
      sub: `${d.regulation.laws.length} laws · ${[...levels].filter((l) => l !== 'International').join(', ')}`,
      cls: 'regs',
    },
    { id: 'cases', title: 'Case studies', sub: `${d.caseStudies.places.length} places · view on map`, cls: 'cases' },
  ];
}

export default function App() {
  const [route, navigate] = useRoute();
  const dept = getDepartment(route.deptId);

  return (
    <div className="app">
      <header className="topbar">
        <h1 className="brand">
          Physical AI in Cities
          <small>How embodied AI is showing up in city services, what can go wrong, and who governs it</small>
        </h1>
      </header>

      <p className="label">Choose a department</p>
      <nav className="dept-row" aria-label="Departments">
        {departments.map((d) => (
          <button
            key={d.id}
            className={'dept-pill' + (d.id === dept?.id ? ' active' : '')}
            onClick={() => navigate({ deptId: d.id, tab: route.deptId === d.id ? route.tab : 'types' })}
          >
            {d.name}
          </button>
        ))}
      </nav>

      {!dept ? (
        <div className="landing">
          {departments.map((d) => (
            <button key={d.id} className="landing-card" onClick={() => navigate({ deptId: d.id, tab: 'types' })}>
              <span className="n">SECTOR {d.number}</span>
              <h3>{d.name}</h3>
              <p>{d.intro}</p>
              <div className="stats">
                <span><b>{d.types.items.length}</b> types</span>
                <span><b>{d.risks.current.length + d.risks.blackSwans.length}</b> risks</span>
                <span><b>{d.regulation.laws.length}</b> laws</span>
                <span><b>{d.caseStudies.places.length}</b> places</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <main key={dept.id}>
          <section className="dept-head">
            <h2>{dept.name}</h2>
            <p>{dept.intro}</p>
          </section>

          <p className="label">Understand it</p>
          <div className="tabs" role="tablist">
            {tabCards(dept).map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={route.tab === t.id}
                className={`tab-card ${t.cls}` + (route.tab === t.id ? ' active' : '')}
                onClick={() => navigate({ deptId: dept.id, tab: t.id })}
              >
                <span className="t">{t.title}</span>
                <span className="s">{t.sub}</span>
              </button>
            ))}
          </div>

          {route.tab === 'types' && (
            <TypesView dept={dept} focus={route.focus} onFocus={(id) => navigate({ deptId: dept.id, tab: 'types', focus: id })} />
          )}
          {route.tab === 'risks' && <RisksView dept={dept} />}
          {route.tab === 'regulation' && <RegulationView dept={dept} focus={route.focus} />}
          {route.tab === 'cases' && (
            <CaseStudiesView
              dept={dept}
              focus={route.focus}
              onFocus={(id) => navigate({ deptId: dept.id, tab: 'cases', focus: id })}
              onOpen={(tab, id) => navigate({ deptId: dept.id, tab, focus: id })}
            />
          )}
        </main>
      )}
    </div>
  );
}
