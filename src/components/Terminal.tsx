import { useState, useRef, useEffect, useCallback } from 'react';
import type { ThemeName, Theme } from '../utils/themes';
import { themes } from '../utils/themes';
import type { VFSDirectory } from '../utils/vfs';
import {
  INITIAL_VFS,
  resolvePath,
} from '../utils/vfs';
import { processCommand, getAutoCompleteSuggestions } from '../utils/commands';
import type { OutputLine, CmdContext } from '../utils/commands';

interface HistoryItem {
  id: number;
  text: string;
  type: 'stdout' | 'stderr' | 'system' | 'input';
}

interface EditorState {
  filename: string;
  content: string;
  modified: boolean;
}

type TerminalMode = 'boot' | 'shell' | 'sudo-password' | 'editor';

const SUDO_PASSWORDS = ['admin', 'sawroz', 'root', 'password'];

const BOOT_LINES = [
  { text: '', type: 'system' as const },
  { text: '  ╔══════════════════════════════════════════════════╗', type: 'system' as const },
  { text: '  ║              SAWROZ OS v1.0.4-LTS               ║', type: 'system' as const },
  { text: '  ║          Terminal Portfolio Edition              ║', type: 'system' as const },
  { text: '  ╚══════════════════════════════════════════════════╝', type: 'system' as const },
  { text: '', type: 'system' as const },
  { text: ' [BIOS] Starting system initialization...', type: 'system' as const },
  { text: ' [CPU]  Detected: AMD Ryzen 7 5700X (16 Cores, 32 Threads)', type: 'system' as const },
  { text: ' [RAM]  Detected: 64GB DDR4 ECC @ 3200MHz', type: 'system' as const },
  { text: ' [STOR] Checking disks... [OK]', type: 'system' as const },
  { text: ' [NET]  eth0: 192.168.1.100/24 (DHCP) [LINK UP]', type: 'system' as const },
  { text: ' [KRNL] Loading linux-6.8.0-sawroz-generic... [OK]', type: 'system' as const },
  { text: ' [KRNL] Initializing security modules... [OK]', type: 'system' as const },
  { text: ' [INIT] Starting OpenSSH Server... [OK]', type: 'system' as const },
  { text: ' [INIT] Starting Docker Engine... [OK]', type: 'system' as const },
  { text: ' [INIT] Starting Nginx Reverse Proxy... [OK]', type: 'system' as const },
  { text: ' [INIT] Starting PostgreSQL 16... [OK]', type: 'system' as const },
  { text: ' [INIT] Starting Redis Cache... [OK]', type: 'system' as const },
  { text: '', type: 'system' as const },
  { text: ' [LOGIN] Automatic login for user: sawroz', type: 'system' as const },
  { text: ' [LOGIN] Session established (pts/0)', type: 'system' as const },
  { text: '', type: 'system' as const },
  { text: ' Welcome to SAWROZ OS v1.0.4-LTS (x86_64-pc-linux-gnu)', type: 'system' as const },
  { text: '', type: 'system' as const },
  { text: '  * Documentation:  https://github.com/sawroz/terminal-portfolio', type: 'system' as const },
  { text: '  * System status:  Healthy, Load: 0.08 0.12 0.05', type: 'system' as const },
  { text: '', type: 'system' as const },
  { text: ' Type "help" to see available commands. Good luck!', type: 'system' as const },
  { text: '', type: 'system' as const },
];

function getTheme(themeName: ThemeName): Theme {
  return themes[themeName] || themes.matrix;
}

function getPrompt(user: string, currentDir: string, isSudo: boolean): string {
  const hostname = 'sawroz-server';
  const dir = currentDir === '/home/sawroz' ? '~' : currentDir;
  const sudoMarker = isSudo ? '# ' : '$ ';
  return `${user}@${hostname}:${dir}${sudoMarker}`;
}

export default function Terminal() {
  const [themeName, setThemeName] = useState<ThemeName>('matrix');
  const [mode, setMode] = useState<TerminalMode>('boot');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('term-history') || '[]');
    } catch {
      return [];
    }
  });
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDir, setCurrentDir] = useState('/home/sawroz');
  const [user, setUser] = useState('sawroz');
  const [isSudo, setIsSudo] = useState(false);
  const [vfs, setVfs] = useState<VFSDirectory>(INITIAL_VFS);
  const [bootProgress, setBootProgress] = useState(0);
  const [editor, setEditor] = useState<EditorState>({ filename: '', content: '', modified: false });
  const [passwordBuffer, setPasswordBuffer] = useState('');
  const [matrixEffect, setMatrixEffect] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bootStartedRef = useRef(false);
  const bootTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Save command history to localStorage
  useEffect(() => {
    localStorage.setItem('term-history', JSON.stringify(commandHistory.slice(-100)));
  }, [commandHistory]);

  // Auto scroll
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const skipBoot = useCallback(() => {
    if (bootTimerRef.current) {
      clearInterval(bootTimerRef.current);
      bootTimerRef.current = null;
    }
    const remaining = BOOT_LINES.slice(Math.floor(bootProgress * BOOT_LINES.length));
    const items: HistoryItem[] = remaining.map((l, i) => ({
      id: Date.now() + i,
      text: l.text,
      type: l.type,
    }));
    setHistory(prev => [...prev, ...items]);
    setMode('shell');
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [bootProgress]);

  // Boot sequence
  useEffect(() => {
    if (bootStartedRef.current) return;
    bootStartedRef.current = true;

    let idx = 0;
    bootTimerRef.current = setInterval(() => {
      if (idx < BOOT_LINES.length) {
        setHistory(prev => [...prev, { id: Date.now() + idx, ...BOOT_LINES[idx] }]);
        setBootProgress((idx + 1) / BOOT_LINES.length);
        idx++;
      } else {
        if (bootTimerRef.current) {
          clearInterval(bootTimerRef.current);
          bootTimerRef.current = null;
        }
        setMode('shell');
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }, 40);

    return () => {
      if (bootTimerRef.current) {
        clearInterval(bootTimerRef.current);
        bootTimerRef.current = null;
      }
    };
  }, []);

  // Global key listener for boot skip
  useEffect(() => {
    if (mode !== 'boot') return;
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      skipBoot();
    };
    window.addEventListener('keydown', handler, { once: true });
    return () => window.removeEventListener('keydown', handler);
  }, [mode, skipBoot]);

  const addLines = useCallback((lines: OutputLine[]) => {
    if (lines.length === 0) return;
    const items: HistoryItem[] = lines.map(l => ({
      id: Date.now() + Math.random(),
      text: l.text,
      type: l.type,
    }));
    setHistory(prev => [...prev, ...items]);
  }, []);

  const handleCommand = useCallback(() => {
    const cmd = input.trim();
    if (!cmd) {
      setInput('');
      return;
    }

    // Record in history
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    // Show input line
    const prompt = getPrompt(user, currentDir, isSudo);
    setHistory(prev => [...prev, {
      id: Date.now(),
      text: `${prompt}${cmd}`,
      type: 'input',
    }]);

    setInput('');

    // Process command
    const ctx: CmdContext = { user, isSudo, currentDir, vfs, theme: themeName, commandHistory };
    const result = processCommand(cmd, ctx);

    // Apply state changes
    if (result.clearScreen) {
      setHistory([]);
      return;
    }

    if (result.newDir !== undefined) {
      setCurrentDir(result.newDir);
    }

    if (result.newTheme !== undefined) {
      setThemeName(result.newTheme);
    }

    if (result.newIsSudo !== undefined) {
      setIsSudo(result.newIsSudo);
    }

    if (result.newUser !== undefined) {
      setUser(result.newUser);
    }

    if (result.newMode === 'sudo-password') {
      setMode('sudo-password');
      setPasswordBuffer('');
      setHistory(prev => [...prev, {
        id: Date.now(),
        text: '[sudo] Password for sawroz: ',
        type: 'system',
      }]);
      return;
    }

    if (result.newMode === 'editor') {
      setEditor({
        filename: result.editorFilename || '',
        content: result.editorContent || '',
        modified: false,
      });
      setMode('editor');
      return;
    }

    if (result.newVfs) {
      setVfs(result.newVfs);
    }

    if (cmd.toLowerCase() === 'matrix') {
      setMatrixEffect(prev => !prev);
    }

    addLines(result.lines);
  }, [input, user, currentDir, isSudo, vfs, themeName, commandHistory, addLines]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (mode === 'boot') {
      skipBoot();
      return;
    }

    if (mode === 'sudo-password') {
      if (e.key === 'Enter') {
        const pw = passwordBuffer;
        setPasswordBuffer('');
        if (SUDO_PASSWORDS.includes(pw.toLowerCase())) {
          setIsSudo(true);
          setMode('shell');
          setHistory(prev => [...prev, {
            id: Date.now(),
            text: '  Access granted. Privilege escalation successful.',
            type: 'system',
          }]);
        } else {
          setMode('shell');
          setHistory(prev => [...prev, {
            id: Date.now(),
            text: 'sudo: incorrect password. Try again.',
            type: 'stderr',
          }]);
        }
        return;
      }
      if (e.key === 'Escape') {
        setMode('shell');
        setPasswordBuffer('');
        setHistory(prev => [...prev, {
          id: Date.now(),
          text: '',
          type: 'stdout',
        }]);
        return;
      }
      if (e.key === 'Backspace') {
        setPasswordBuffer(prev => prev.slice(0, -1));
        return;
      }
      if (e.key.length === 1) {
        setPasswordBuffer(prev => prev + e.key);
        return;
      }
      return;
    }

    if (mode === 'editor') {
      if (e.key === 'Escape') {
        setInput('');
        return;
      }
      if (e.key === 'Enter') {
        const cmd = input.trim();
        if (cmd === ':wq' || cmd === ':x') {
          // Save
          const currentEditor = editor;
          const targetPath = resolvePath(currentDir, currentEditor.filename);
          const newVfs = JSON.parse(JSON.stringify(vfs));
          const segments = targetPath.split('/').filter(Boolean);
          let node: any = newVfs;
          for (const seg of segments.slice(0, -1)) {
            node = node.children[seg];
            if (!node) break;
          }
          if (node && node.children) {
            node.children[currentEditor.filename] = {
              type: 'file',
              name: currentEditor.filename,
              content: currentEditor.content,
            };
          }
          setVfs(newVfs);
          setMode('shell');
          addLines([{ text: `"${currentEditor.filename}" saved.`, type: 'stdout' }]);
          setInput('');
          return;
        }
        if (cmd === ':q!' || cmd === ':q' || cmd === 'exit') {
          setMode('shell');
          addLines([{ text: 'Editor closed without saving.', type: 'stdout' }]);
          setInput('');
          return;
        }
        // Append text from input to editor content
        setEditor(prev => ({
          ...prev,
          content: prev.content ? prev.content + '\n' + input : input,
          modified: true,
        }));
        setInput('');
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        setInput(prev => prev + '  ');
        return;
      }
      return;
    }

    // Shell mode key handling
    if (e.key === 'Enter') {
      handleCommand();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const suggestions = getAutoCompleteSuggestions(input, { user, isSudo, currentDir, vfs, theme: themeName, commandHistory });
      if (suggestions.length === 0) return;
      if (suggestions.length === 1) {
        const parts = input.split(/\s+/);
        const isFirstWord = parts.length <= 1 || input.endsWith(' ');
        if (isFirstWord) {
          setInput(suggestions[0] + ' ');
        } else {
          const base = parts.slice(0, -1).join(' ');
          setInput(base ? base + ' ' + suggestions[0] : suggestions[0]);
        }
      } else {
        addLines([{ text: suggestions.join('  '), type: 'stdout' }]);
      }
    }
  }, [mode, input, historyIndex, commandHistory, user, currentDir, isSudo, vfs, themeName, editor, passwordBuffer, addLines, handleCommand, skipBoot, resolvePath]);

  const currentTheme = getTheme(themeName);

  const editorLines = editor.content ? editor.content.split('\n') : [];
  const maxLineNumWidth = String(editorLines.length).length;

  return (
    <div
      className="crt crt-vignette"
      style={{
        position: 'fixed',
        inset: 0,
        background: `radial-gradient(ellipse at center, ${currentTheme.screenBg} 0%, #000 100%)`,
        color: currentTheme.textColor,
        fontFamily: '"Fira Code", "JetBrains Mono", monospace',
        fontSize: '14px',
        lineHeight: '1.5',
        zIndex: 10,
        padding: '20px',
        overflow: 'hidden',
        cursor: 'text',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* CRT Screen */}
      <div
        style={{
          border: `2px solid ${currentTheme.borderColor}`,
          borderRadius: '12px',
          padding: '4px',
          background: currentTheme.bgColor,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: `inset 0 0 60px rgba(0,0,0,0.8), 0 0 20px ${currentTheme.borderColor}40`,
          overflow: 'hidden',
        }}
      >
        {/* Monitor inner bezel */}
        <div
          style={{
            background: currentTheme.bgColor,
            borderRadius: '8px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: '12px 16px',
          }}
        >
          {/* Output area */}
          <div
            ref={outputRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {history.map((line) => (
              <div
                key={line.id}
                style={{
                  color:
                    line.type === 'stderr' ? '#ef4444' :
                    line.type === 'system' ? currentTheme.highlightColor :
                    line.type === 'input' ? currentTheme.promptColor :
                    currentTheme.textColor,
                  opacity: line.type === 'system' ? 0.85 : 1,
                  minHeight: '1.5em',
                }}
                className={currentTheme.glowClass}
              >
                {line.text}
              </div>
            ))}

            {/* Editor mode */}
            {mode === 'editor' && (
              <div>
                <div
                  style={{
                    borderBottom: `1px solid ${currentTheme.borderColor}`,
                    paddingBottom: '4px',
                    marginBottom: '8px',
                    color: currentTheme.highlightColor,
                    fontSize: '12px',
                  }}
                >
                  [EDITOR] {editor.filename}{editor.modified ? ' [Modified]' : ''} | Ctrl+C to exit, :wq to save
                </div>
                {editorLines.map((line, i) => (
                  <div key={i} style={{ display: 'flex' }}>
                    <span
                      style={{
                        color: currentTheme.borderColor,
                        width: `${maxLineNumWidth + 2}ch`,
                        textAlign: 'right',
                        marginRight: '12px',
                        userSelect: 'none',
                        opacity: 0.5,
                      }}
                    >
                      {String(i + 1).padStart(maxLineNumWidth)}
                    </span>
                    <span style={{ flex: 1 }}>{line}</span>
                  </div>
                ))}
                {(editorLines.length === 0) && (
                  <div style={{ opacity: 0.5, fontStyle: 'italic' }}>
                    ~ Empty file ~
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input line */}
          {mode !== 'boot' && (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: `1px solid ${currentTheme.borderColor}30`, flexShrink: 0 }}>
              {mode === 'shell' && (
                <span
                  style={{ color: currentTheme.promptColor, marginRight: '8px', whiteSpace: 'nowrap' }}
                  className={currentTheme.glowClass}
                >
                  {getPrompt(user, currentDir, isSudo)}
                </span>
              )}
              {mode === 'sudo-password' && (
                <span style={{ color: currentTheme.highlightColor, marginRight: '8px' }}>
                  [sudo] Password:
                </span>
              )}
              {mode === 'editor' && (
                <span style={{ color: currentTheme.promptColor, marginRight: '8px' }}>
                  :
                </span>
              )}
              <input
                ref={inputRef}
                type={mode === 'sudo-password' ? 'password' : 'text'}
                value={mode === 'sudo-password' ? passwordBuffer : input}
                onChange={e => {
                  if (mode === 'sudo-password') {
                    setPasswordBuffer(e.target.value);
                  } else {
                    setInput(e.target.value);
                  }
                }}
                onKeyDown={handleKeyDown}
                disabled={false}
                spellCheck={false}
                autoComplete="off"
                autoFocus
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: currentTheme.textColor,
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  caretColor: currentTheme.promptColor,
                }}
              />
              {/* Blinking cursor indicator */}
              <span
                className="terminal-cursor"
                style={{
                  backgroundColor: currentTheme.promptColor,
                  marginLeft: '2px',
                  width: '8px',
                  height: '16px',
                  flexShrink: 0,
                }}
              />
            </div>
          )}

          {/* Boot "skip" hint */}
          {mode === 'boot' && (
            <div style={{ textAlign: 'center', padding: '4px', color: currentTheme.borderColor, opacity: 0.6 }}>
              Press any key to skip boot...
            </div>
          )}
        </div>
      </div>

      {/* Matrix rain canvas overlay */}
      {matrixEffect && (
        <MatrixRain />
      )}
    </div>
  );
}

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const context = canvasElement.getContext('2d');
    if (!context) return;

    const canvas: HTMLCanvasElement = canvasElement;
    const ctx: CanvasRenderingContext2D = context;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    function draw() {
      ctx.fillStyle = 'rgba(0, 10, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0f0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.98 ? '#fff' : '#0f0';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.12,
        zIndex: 1,
      }}
    />
  );
}
