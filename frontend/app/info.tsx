import styles from './page.module.css';
import { JetBrains_Mono, IBM_Plex_Sans } from 'next/font/google';

type Lang = 'python' | 'cpp';

const SNIPPETS: Record<Lang, { file: string; lines: { n: number; code: React.ReactNode }[] }> = {
  python: {
    file: 'fib.py',
    lines: [
      { n: 1, code: <><span className={styles.kw}>def</span> <span className={styles.fn}>fib</span>(n):</> },
      { n: 2, code: <>&nbsp;&nbsp;&nbsp;&nbsp;a, b = <span className={styles.num}>0</span>, <span className={styles.num}>1</span></> },
      { n: 3, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className={styles.kw}>for</span> _ <span className={styles.kw}>in</span> range(n):</> },
      { n: 4, code: <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a, b = b, a + b</> },
      { n: 5, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className={styles.kw}>return</span> a</> },
      { n: 6, code: <>&nbsp;</> },
      { n: 7, code: <><span className={styles.fn}>print</span>(fib(<span className={styles.num}>10</span>))</> },
    ],
  },
  cpp: {
    file: 'fib.cpp',
    lines: [
      { n: 1, code: <><span className={styles.kw}>#include</span> <span className={styles.str}>&lt;iostream&gt;</span></> },
      { n: 2, code: <><span className={styles.kw}>using namespace</span> std;</> },
      { n: 3, code: <>&nbsp;</> },
      { n: 4, code: <><span className={styles.kw}>int</span> <span className={styles.fn}>main</span>() {'{'}</> },
      { n: 5, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className={styles.kw}>int</span> a = <span className={styles.num}>0</span>, b = <span className={styles.num}>1</span>;</> },
      { n: 6, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className={styles.kw}>for</span> (<span className={styles.kw}>int</span> i = <span className={styles.num}>0</span>; i &lt; <span className={styles.num}>10</span>; i++) {'{'}</> },
      { n: 7, code: <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className={styles.kw}>int</span> t = a + b; a = b; b = t;</> },
      { n: 8, code: <>&nbsp;&nbsp;&nbsp;&nbsp;{'}'}</> },
      { n: 9, code: <>&nbsp;&nbsp;&nbsp;&nbsp;cout &lt;&lt; a &lt;&lt; endl;</> },
      { n: 10, code: <>{'}'}</> },
    ],
  },
};

const STOPS = [
  {
    mark: 'ROOT',
    title: 'The editor',
    body: "Monaco runs inside the Next.js shell as a first-class citizen, not an iframe bolted on the page. Full syntax highlighting, bracket matching, and auto-completion, tuned to feel like the editor you already reach for.",
    tag: 'next.js · monaco-editor',
  },
  {
    mark: 'STEM',
    title: 'The pipeline',
    body: "Code doesn't compile in the browser, it travels. Every run is handed off to the Paiza.io execution API on a separate thread, so a slow build never freezes the tab. Output streams back the moment it's ready.",
    tag: 'flask · paiza.io api',
  },
  {
    mark: 'LEAF',
    title: 'The playground',
    body: 'The editor is built as a self-contained, independent component, drop it into a tutorial post on any property in the ecosystem and readers can edit and run the example side-by-side, without leaving the article.',
    tag: 'component-driven · embeddable',
  },
];

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
});

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
});

export { SNIPPETS, STOPS, mono, sans };