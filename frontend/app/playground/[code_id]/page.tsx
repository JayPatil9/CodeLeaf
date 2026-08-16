'use client';

import { useState, useEffect, use } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Playground({ params }: { params: Promise<{ code_id: string }> }) {
  
  const unwrappedParams = use(params);
  
  const targetId = unwrappedParams.code_id; 

  const [code, setCode] = useState('// Loading...');
  const [language, setLanguage] = useState('cpp');
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/snippets/${targetId}`);
        setCode(res.data.code);
        if (res.data.language) setLanguage(res.data.language);
      } catch (err) {
        setCode('// Failed to load snippet or invalid ID.');
      }
    };
    fetchSnippet();
  }, [targetId]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Compiling and running...');
    
    try {
      const res = await axios.post(`${BACKEND_URL}/api/execute`, {
        code: code,
        language: language,
        input: stdin 
      });
      
      const data = res.data;

      if (data.build_result === 'failure') {
        setOutput(`Compilation Error:\n${data.build_stderr}`);
      } else if (data.result !== 'success' || data.stderr) {
        setOutput(`Runtime Error:\n${data.stderr || data.result}`);
      } else {
        setOutput(data.stdout || 'Program exited successfully with no output.');
      }
    } catch (err: any) {
      setOutput(err.response?.data?.error || 'Execution server unreachable.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', color: '#fff' }}>
      <div style={{ padding: '12px', backgroundColor: '#1e1e1e', borderBottom: '1px solid #333', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button 
          onClick={handleRunCode} 
          disabled={isRunning}
          style={{ 
            padding: '8px 16px', backgroundColor: '#0078d4', color: 'white', 
            border: 'none', borderRadius: '4px', cursor: isRunning ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
        <span style={{ color: '#888', fontSize: '14px' }}>Language: {language.toUpperCase()}</span>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 2, borderRight: '1px solid #333' }}>
          <Editor
            height="100%"
            theme="vs-dark"
            language={language === 'cpp' ? 'cpp' : 'python'}
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e' }}>
          <div style={{ flex: 1, borderBottom: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '8px 12px', fontSize: '12px', color: '#888', backgroundColor: '#252526' }}>
              Standard Input (stdin)
            </div>
            <textarea 
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter input for cin / stdin here..."
              style={{ 
                flex: 1, backgroundColor: 'transparent', color: '#fff', border: 'none', 
                padding: '12px', resize: 'none', outline: 'none', fontFamily: 'monospace' 
              }}
            />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '8px 12px', fontSize: '12px', color: '#888', backgroundColor: '#252526' }}>
              Output
            </div>
            <pre style={{ 
              flex: 1, margin: 0, padding: '12px', overflow: 'auto', 
              color: '#4af626', fontFamily: 'monospace', whiteSpace: 'pre-wrap' 
            }}>
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}