import { useEffect, useRef, useState } from 'react';
import { SECTORS } from '../data/departments';

/** Numbered dropdown of all sectors; sectors without data are listed but disabled. */
export default function SectorPicker({ currentId, onPick }: { currentId?: string; onPick: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = currentId ? SECTORS.find((s) => s.department?.id === currentId) : undefined;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="sector-picker" ref={ref}>
      <button type="button" className="sector-trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {current ? (
          <>
            <span className="num">{current.number}</span>
            {current.name}
          </>
        ) : (
          <span className="placeholder">Select a sector</span>
        )}
        <span className="chev" aria-hidden>▾</span>
      </button>
      {open && (
        <ul className="sector-menu" role="listbox">
          {SECTORS.map((s) => {
            const live = !!s.department;
            const on = !!currentId && s.department?.id === currentId;
            return (
              <li key={s.number}>
                <button
                  type="button"
                  role="option"
                  aria-selected={on}
                  aria-disabled={!live}
                  className={'sector-option' + (on ? ' on' : '') + (live ? '' : ' soon')}
                  onClick={() => {
                    if (!live) return;
                    onPick(s.department!.id);
                    setOpen(false);
                  }}
                >
                  <span className="num">{s.number}</span>
                  <span className="nm">{s.name}</span>
                  {!live && <span className="soon-tag">Coming soon</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
