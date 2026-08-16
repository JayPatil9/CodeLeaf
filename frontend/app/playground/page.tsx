'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const defaultTemplates = {
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World!\\n";\n    return 0;\n}',
  python: 'print("Hello World!")'
};

export default function GeneralPlayground() {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(defaultTemplates.cpp);
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value as 'cpp' | 'python';
    setLanguage(selectedLang);
    setCode(defaultTemplates[selectedLang]);
  };

  const handleRunCode = async () => {
    console.log('Running code...');
    console.log(BACKEND_URL);
    setIsRunning(true);
    setOutput('Running...');
    
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
      
      {/* Top Navbar */}
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
        
        {/* Language Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="language-select" style={{ color: '#888', fontSize: '14px' }}>Language:</label>
          <select 
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            style={{
              padding: '6px',
              backgroundColor: '#252526',
              color: 'white',
              border: '1px solid #333',
              borderRadius: '4px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Side: Monaco Editor */}
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

        {/* Right Side: I/O Panels */}
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