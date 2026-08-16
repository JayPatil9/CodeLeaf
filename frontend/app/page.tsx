'use client';

import { redirect } from 'next/navigation';

export default function Home() {
  
  function handleGoToPlayground() {
    redirect('/playground');
  }

  return (
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#121212', color: 'white' }}>
        <h1>Welcome to CodeLeaf</h1>
        <p>A fast, sandboxed execution environment for </p>
        <p>Powering my projects.</p>
        <button style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#0078d4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={handleGoToPlayground}>
        Go to Playground
      </button>
    </main>
  );
}