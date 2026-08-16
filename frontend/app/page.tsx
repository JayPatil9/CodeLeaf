'use client';

import { useRef, useState } from 'react';
import styles from './page.module.css';
import { redirect } from 'next/navigation';
import { SNIPPETS, STOPS, mono, sans } from './info';

type Lang = 'python' | 'cpp';

export default function Home() {
  const [lang, setLang] = useState<Lang>('python');
  const [runState, setRunState] = useState<'idle' | 'running' | 'done'>('idle');
  const editorRef = useRef<HTMLDivElement>(null);

  function handleRun() {
    editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (runState === 'running') return;
    setRunState('running');
    setTimeout(() => setRunState('done'), 900);
  }

  function handlePlaygroundClick() {
    redirect(`/playground`);
  }

  return (
    <main className={`${mono.variable} ${sans.variable} ${styles.page}`}>
      {/* nav */}
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <a href="#" className={styles.brand}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 20C4 11 9 4 20 4C20 15 13 20 4 20Z" stroke="var(--leaf)" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M4 20 12 12" stroke="var(--leaf)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            CodeLeaf
          </a>
          <nav className={styles.navLinks}>
            <a href="#stops">How it's built</a>
            <a href="#embed">Embedding</a>
            <a href="#future">Future</a>
          </nav>
          <a href="https://github.com/JayPatil9/CodeLeaf" className={styles.navCta} target="_blank" rel="noreferrer">
            View source
          </a>
        </div>
      </header>

      {/* hero */}
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>web ide · embeddable playground</p>
          <h1>
            Write and
            <br />
            Run code from <span className={styles.hl}>anywhere.</span>
          </h1>
          <p className={styles.lede}>
            CodeLeaf pairs the Monaco editor with a non-blocking remote execution pipeline,  so anyone can write, run,
            and embed real C++ and Python, right where they're already reading.
          </p>
          <div className={styles.heroActions}>
            <button type="button" className={styles.btnPrimary} onClick={handleRun}>
              Try it ➡
            </button>
            <a className={styles.btnGhost} onClick={handlePlaygroundClick} target="_blank" rel="noreferrer">
              Playground
            </a>
          </div>
        </div>

        <div className={styles.editorShell} ref={editorRef}>
          <div className={styles.editorTitlebar}>
            <div className={styles.dots}>
              <span /> <span /> <span />
            </div>
            <div className={styles.tabs}>
              {(Object.keys(SNIPPETS) as Lang[]).map((l) => (
                <button
                  type="button"
                  key={l}
                  className={lang === l ? `${styles.tab} ${styles.tabActive}` : styles.tab}
                  onClick={() => {
                    setLang(l);
                    setRunState('idle');
                  }}
                >
                  {SNIPPETS[l].file}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.editorBody}>
            <div className={styles.gutter}>
              {SNIPPETS[lang].lines.map((l) => (
                <div key={l.n}>{l.n}</div>
              ))}
            </div>
            <pre className={styles.code}>
              {SNIPPETS[lang].lines.map((l) => (
                <div key={l.n}>{l.code}</div>
              ))}
            </pre>
          </div>

          <div className={styles.editorFooter}>
            <button type="button" className={styles.runBtn} onClick={handleRun} disabled={runState === 'running'}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2.5 1.5L10 6L2.5 10.5V1.5Z" fill="currentColor" />
              </svg>
              {runState === 'running' ? 'Running…' : 'Run'}
            </button>
            <span className={styles.runtimeLabel}>
              {runState === 'idle' && 'dispatched to paiza.io on click'}
              {runState === 'running' && 'compiling remotely,  thread unblocked'}
              {runState === 'done' && 'exit code 0 · 0.6s'}
            </span>
          </div>

          {runState !== 'idle' && (
            <div className={styles.console}>
              {runState === 'running' ? (
                <span className={styles.blink}>▍ executing…</span>
              ) : (
                <>
                  <div>55</div>
                  <div className={styles.consoleMeta}>Process finished with exit code 0</div>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* root -> stem -> leaf */}
      <section id="stops" className={styles.stops}>
        <p className={styles.sectionEyebrow}>How CodeLeaf is built</p>
        <h2 className={styles.sectionTitle}>Three layered Architecture.</h2>

        <div className={styles.vine}>
          {STOPS.map((s, i) => (
            <div className={styles.stop} key={s.mark}>
              <div className={styles.stopMarker}>
                <span className={styles.stopDot} />
                {i < STOPS.length - 1 && <span className={styles.stopLine} />}
              </div>
              <div className={styles.stopContent}>
                <span className={styles.stopMark}>{s.mark}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <span className={styles.stopTag}>{s.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* embed showcase */}
      <section id="embed" className={styles.embed}>
        <div>
          <p className={styles.sectionEyebrow}>built to be embedded</p>
          <h2 className={styles.sectionTitle}>
            It doesn't just live on CodeLeaf. <br className={styles.brDesktop} />
            It lives inside your tutorials.
          </h2>
          <p className={styles.lede}>
            The playground ships as a single component, so a tutorial site can drop a live, editable, runnable
            snippet, just a click away, readers can test the logic side-by-side.
          </p>
        </div>

        <div className={styles.mArticle}>
          <div className={styles.mArticleChrome}>
            <span className={styles.mUrl}>codeleaf-tutorials.dev/loops-in-python</span>
          </div>
          <div className={styles.mArticleBody}>
            <div className={`${styles.mLine} ${styles.mLineWide}`} />
            <div className={styles.mLine} />
            <div className={`${styles.mLine} ${styles.mLineShort}`} />
            <div className={styles.mEmbed}>
              <div className={styles.mEmbedBar}>
                <span className={styles.mEmbedDot} />
                fib.py · try it
              </div>
              <div className={styles.mEmbedCode}>
                <span className={styles.kw}>for</span> _ <span className={styles.kw}>in</span> range(n): a, b = b, a + b
              </div>
            </div>
            <div className={`${styles.mLine} ${styles.mLineWide}`} />
            <div className={styles.mLine} />
          </div>
        </div>
      </section>

      {/* Future Feature */}
      <section id="future" className={styles.future}>
        <div className={styles.budMarker}>
          <span className={`${styles.stopDot} ${styles.stopDotBud}`} />
        </div>
        <span className={styles.stopMark}>BUD</span>
        <h2 className={styles.sectionTitle}>What's growing next.</h2>
        <p className={`${styles.lede} ${styles.center}`}>
          The application state is already structured for it: a synchronized, multi-user editing session over
          WebSockets, so two people can watch the same cursor move through the same file in real time.
        </p>
        <span className={styles.badge}>Next on the roadmap</span>
      </section>

      <footer className={styles.footer}>
        <span>CodeLeaf · built by Jay Patil</span>
        <a href="https://github.com/JayPatil9" target="_blank" rel="noreferrer">
          github.com/JayPatil9
        </a>
      </footer>
    </main>
  );
}