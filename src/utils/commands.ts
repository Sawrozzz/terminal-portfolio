import type { ThemeName } from './themes';
import type { VFSDirectory } from './vfs';
import { resolvePath, getNodeAtPath, listDirectory, createNodeInVFS } from './vfs';

export interface OutputLine {
  text: string;
  type: 'stdout' | 'stderr' | 'system';
}

export interface CmdContext {
  user: string;
  isSudo: boolean;
  currentDir: string;
  vfs: VFSDirectory;
  theme: ThemeName;
  commandHistory: string[];
}

export interface CmdResult {
  lines: OutputLine[];
  newDir?: string;
  newTheme?: ThemeName;
  newIsSudo?: boolean;
  newUser?: string;
  newMode?: 'shell' | 'editor' | 'sudo-password';
  editorContent?: string;
  editorFilename?: string;
  clearScreen?: boolean;
  newVfs?: VFSDirectory;
}

function handleHelp(_args: string[], _ctx: CmdContext): CmdResult {
  const lines: OutputLine[] = [
    { text: '', type: 'stdout' },
    { text: '  ╔══════════════════════════════════════════════════╗', type: 'stdout' },
    { text: '  ║         SAWROZ OS - COMMAND REFERENCE           ║', type: 'stdout' },
    { text: '  ╚══════════════════════════════════════════════════╝', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  FILE NAVIGATION:', type: 'stdout' },
    { text: '    ls [path]        List directory contents', type: 'stdout' },
    { text: '    cd [path]        Change current directory', type: 'stdout' },
    { text: '    pwd              Print working directory', type: 'stdout' },
    { text: '    cat <file>       View file contents', type: 'stdout' },
    { text: '    mkdir <dir>      Create a directory', type: 'stdout' },
    { text: '    touch <file>     Create an empty file', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  PORTFOLIO:', type: 'stdout' },
    { text: '    about            About me (detailed profile)', type: 'stdout' },
    { text: '    skills           View technical skills with ratings', type: 'stdout' },
    { text: '    projects         List my software projects', type: 'stdout' },
    { text: '    contact          Display contact information', type: 'stdout' },
    { text: '    whoami           Display current user identity', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  SYSTEM:', type: 'stdout' },
    { text: '    help             Show this help message', type: 'stdout' },
    { text: '    history          Show command history', type: 'stdout' },
    { text: '    clear            Clear the terminal screen', type: 'stdout' },
    { text: '    echo <text>      Print text to stdout', type: 'stdout' },
    { text: '    date             Display current date and time', type: 'stdout' },
    { text: '    uptime           Show system uptime (simulated)', type: 'stdout' },
    { text: '    uname            Print system information', type: 'stdout' },
    { text: '    neofetch         Display system info with ASCII art', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  POWER COMMANDS:', type: 'stdout' },
    { text: '    theme [name]     Change terminal theme (alt: themes)', type: 'stdout' },
    { text: '    sudo <cmd>       Execute command as superuser', type: 'stdout' },
    { text: '    vi <file>        Open visual text editor', type: 'stdout' },
    { text: '    nano <file>      Open nano text editor', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  EASTER EGGS:', type: 'stdout' },
    { text: '    matrix           Toggle matrix rain effect', type: 'stdout' },
    { text: '    banner           Show welcome banner again', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  TIP: Use Tab to auto-complete commands and paths.', type: 'stdout' },
    { text: '  TIP: Press Up/Down arrows to navigate command history.', type: 'stdout' },
    { text: '', type: 'stdout' },
  ];
  return { lines };
}

function handleAbout(_args: string[], _ctx: CmdContext): CmdResult {
  const lines: OutputLine[] = [
    { text: '', type: 'stdout' },
    { text: '  ╔═══════════════════════════════════════════╗', type: 'stdout' },
    { text: '  ║           ABOUT  SAWROZ                   ║', type: 'stdout' },
    { text: '  ╚═══════════════════════════════════════════╝', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  Hello! I\'m Sawroz, a passionate Software Engineer', type: 'stdout' },
    { text: '  and Linux enthusiast based in the digital realm.', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  I specialize in building high-performance, distributed', type: 'stdout' },
    { text: '  backend systems and dynamic full-stack applications.', type: 'stdout' },
    { text: '  My development philosophy revolves around the UNIX', type: 'stdout' },
    { text: '  principles of simplicity, modularity, and efficiency.', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  Primary Tools:', type: 'stdout' },
    { text: '    Languages:  TypeScript, Go, Python, C++', type: 'stdout' },
    { text: '    Frontend:   React, Next.js, Tailwind CSS', type: 'stdout' },
    { text: '    Backend:    Node.js, Fastify, Gin, PostgreSQL, Redis', type: 'stdout' },
    { text: '    DevOps:     Docker, Linux, AWS, GitHub Actions, Nginx', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  I automate everything, maintain my own Arch Linux setup,', type: 'stdout' },
    { text: '  and run a Proxmox homelab for fun and learning.', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  Use "cat about.md" for more details or "skills" for ratings.', type: 'stdout' },
    { text: '', type: 'stdout' },
  ];
  return { lines };
}

function handleSkills(_args: string[], _ctx: CmdContext): CmdResult {
  const lines: OutputLine[] = [
    { text: '', type: 'stdout' },
    { text: '  ╔═══════════════════════════════════════════════════════╗', type: 'stdout' },
    { text: '  ║             TECHNICAL  SKILLS  MATRIX               ║', type: 'stdout' },
    { text: '  ╚═══════════════════════════════════════════════════════╝', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  Languages & Runtimes', type: 'stdout' },
    { text: '    TypeScript/JavaScript    [█████████████████░░░]  85%', type: 'stdout' },
    { text: '    Ruby                     [████████████████░░░░]   80%', type: 'stdout' },
    { text: '    C/C++                    [██████░░░░░░░░░░░░░░]   30%', type: 'stdout' },
    { text: '    Shell/Bash/Zsh           [██████████████████░░]   90%', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  Frontend', type: 'stdout' },
    { text: '    React / Next.js          [██████████████████░░]   90%', type: 'stdout' },
    { text: '    Redux / Zustand          [████████████████░░░░]   80%', type: 'stdout' },
    { text: '    Tailwind CSS / Radix UI  [████████████████████]  100%', type: 'stdout' },
    { text: '    HTML5 / CSS3 / ESNext    [████████████████████]  100%', type: 'stdout' },
    { text: '    Vite / Webpack           [████████████████░░░░]   80%', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  Backend & Infrastructure', type: 'stdout' },
    { text: '    Node.js / Fastify        [██████████████████░░]   90%', type: 'stdout' },
    { text: '    PostgreSQL / MySQL       [████████████████░░░░]   80%', type: 'stdout' },
    { text: '    MongoDB                  [████████████████░░░░]   80%', type: 'stdout' },
    { text: '    Docker / Compose         [██████████████████░░]   90%', type: 'stdout' },
    { text: '    Linux Admin              [███████████░░░░░░░░░]   50%', type: 'stdout' },
    { text: '', type: 'stdout' },
  ];
  return { lines };
}

function handleProjects(_args: string[], _ctx: CmdContext): CmdResult {
  const lines: OutputLine[] = [
    { text: '', type: 'stdout' },
    { text: '  ╔════════════════════════════════════════════════════════╗', type: 'stdout' },
    { text: '  ║                   PROJECT  SHOWCASE                  ║', type: 'stdout' },
    { text: '  ╚════════════════════════════════════════════════════════╝', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  [1] Terminal Portfolio', type: 'stdout' },
    { text: '      An interactive retro terminal showcasing a', type: 'stdout' },
    { text: '      simulated Linux environment in the browser.', type: 'stdout' },
    { text: '      Stack: React, TypeScript, Tailwind CSS', type: 'stdout' },
    { text: '      Try: cat projects/terminal-portfolio/readme.md', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  [2] E-Commerce Microservices Engine', type: 'stdout' },
    { text: '      Production-grade backend with microservices', type: 'stdout' },
    { text: '      architecture for high-traffic e-commerce.', type: 'stdout' },
    { text: '      Stack: Go, Node.js, PostgreSQL, Redis, RabbitMQ', type: 'stdout' },
    { text: '      Try: cat projects/e-commerce-engine/details.txt', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  [3] Proxmox Homelab', type: 'stdout' },
    { text: '      A self-hosted mini-datacenter running 24/7.', type: 'stdout' },
    { text: '      Virtualization, NAS, media server, and more.', type: 'stdout' },
    { text: '      Stack: Proxmox VE, ZFS, Docker, Nginx, Pi-Hole', type: 'stdout' },
    { text: '      Try: cat projects/proxmox-homelab/specs.txt', type: 'stdout' },
    { text: '', type: 'stdout' },
  ];
  return { lines };
}

function handleContact(_args: string[], _ctx: CmdContext): CmdResult {
  const lines: OutputLine[] = [
    { text: '', type: 'stdout' },
    { text: '  ╔═══════════════════════════════════════════╗', type: 'stdout' },
    { text: '  ║          CONTACT  INFORMATION            ║', type: 'stdout' },
    { text: '  ╚═══════════════════════════════════════════╝', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '    Email:     sawroz@engineer.com', type: 'stdout' },
    { text: '    GitHub:    https://github.com/sawrozzz', type: 'stdout' },
    { text: '    LinkedIn:  https://www.linkedin.com/in/saroj-adhikari-512235239/', type: 'stdout' },
    { text: '    Website:   https://portfolioforsawroz.vercel.app/', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  Check out "cat contact.txt" in the home directory.', type: 'stdout' },
    { text: '', type: 'stdout' },
  ];
  return { lines };
}

function handleWhoami(_args: string[], ctx: CmdContext): CmdResult {
  const uid = ctx.isSudo ? 0 : 1000;
  const gid = ctx.isSudo ? 0 : 1000;
  const groups = ctx.isSudo ? 'root' : 'sawroz sudo docker';
  return {
    lines: [
      { text: ctx.user, type: 'stdout' },
      { text: `uid=${uid}(root) gid=${gid}(root) groups=${groups}`, type: 'stdout' },
    ],
  };
}

function handleHistory(_args: string[], ctx: CmdContext): CmdResult {
  if (ctx.commandHistory.length === 0) {
    return { lines: [{ text: 'history: no previous commands recorded.', type: 'stdout' }] };
  }
  const lines = ctx.commandHistory.map((cmd, i) => ({
    text: `  ${String(i + 1).padStart(4)}  ${cmd}`,
    type: 'stdout' as const,
  }));
  return { lines };
}

function handleClear(): CmdResult {
  return { lines: [], clearScreen: true };
}

function handleEcho(args: string[]): CmdResult {
  return { lines: [{ text: args.join(' '), type: 'stdout' }] };
}

function handleDate(): CmdResult {
  return { lines: [{ text: new Date().toString(), type: 'stdout' }] };
}

function handleUptime(): CmdResult {
  const hours = Math.floor(Math.random() * 48) + 12;
  const mins = Math.floor(Math.random() * 60);
  const users = Math.floor(Math.random() * 3) + 1;
  const load = (Math.random() * 2).toFixed(2);
  return {
    lines: [
      { text: `  ${hours}:${String(mins).padStart(2, '0')} up ${hours} min,  ${users} user,  load average: ${load}, ${(Number(load) * 0.7).toFixed(2)}, ${(Number(load) * 0.5).toFixed(2)}`, type: 'stdout' },
    ],
  };
}

function handleUname(args: string[]): CmdResult {
  const flags = args[0] || '';
  if (flags === '-a' || flags === '') {
    return { lines: [{ text: 'Linux sawroz-server 6.8.0-sawroz #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux', type: 'stdout' }] };
  }
  if (flags === '-s') return { lines: [{ text: 'Linux', type: 'stdout' }] };
  if (flags === '-n') return { lines: [{ text: 'sawroz-server', type: 'stdout' }] };
  if (flags === '-r') return { lines: [{ text: '6.8.0-sawroz', type: 'stdout' }] };
  if (flags === '-m') return { lines: [{ text: 'x86_64', type: 'stdout' }] };
  return { lines: [{ text: `uname: invalid option -- '${flags}'`, type: 'stderr' }] };
}

function handleNeofetch(): CmdResult {
  const lines: OutputLine[] = [
    { text: '', type: 'stdout' },
    { text: '                    ████████████████', type: 'stdout' },
    { text: '                  ██                ██', type: 'stdout' },
    { text: '                ██                    ██', type: 'stdout' },
    { text: '              ██    ████████████████    ██', type: 'stdout' },
    { text: '              ██  ██                ██  ██', type: 'stdout' },
    { text: '            ██    ██    ████████    ██    ██', type: 'stdout' },
    { text: '            ██    ██  ██        ██  ██    ██', type: 'stdout' },
    { text: '            ██    ██    ████████    ██    ██', type: 'stdout' },
    { text: '              ██  ██                ██  ██', type: 'stdout' },
    { text: '              ██    ████████████████    ██', type: 'stdout' },
    { text: '                ██                    ██', type: 'stdout' },
    { text: '                  ██                ██', type: 'stdout' },
    { text: '                    ████████████████', type: 'stdout' },
    { text: '', type: 'stdout' },
    { text: '  sawroz@sawroz-server', type: 'stdout' },
    { text: '  --------------------', type: 'stdout' },
    { text: '  OS: SAWROZ OS v1.0.4-LTS x86_64', type: 'stdout' },
    { text: '  Host: Custom Workstation (Ryzen 7)', type: 'stdout' },
    { text: '  Kernel: 6.8.0-sawroz', type: 'stdout' },
    { text: '  Uptime: 2 hours, 34 mins', type: 'stdout' },
    { text: '  Packages: 1337 (pacman), 420 (npm global)', type: 'stdout' },
    { text: '  Shell: zsh 5.9 (with custom powerlevel10k)', type: 'stdout' },
    { text: '  Resolution: 1920x1080 @ 165Hz', type: 'stdout' },
    { text: '  WM: bspwm (modular tiling window manager)', type: 'stdout' },
    { text: '  Terminal: Alacritty (GPU-accelerated)', type: 'stdout' },
    { text: '  Font: Fira Code Nerd Font (12pt, ligatures)', type: 'stdout' },
    { text: '  CPU: AMD Ryzen 7 5700X (16) @ 3.4GHz', type: 'stdout' },
    { text: '  GPU: NVIDIA GeForce RTX 3070 Ti (8GB VRAM)', type: 'stdout' },
    { text: '  Memory: 64123MiB / 65536MiB', type: 'stdout' },
    { text: '', type: 'stdout' },
  ];
  return { lines };
}

function handlePwd(_args: string[], ctx: CmdContext): CmdResult {
  return { lines: [{ text: ctx.currentDir, type: 'stdout' }] };
}

function handleLs(args: string[], ctx: CmdContext): CmdResult {
  const targetPath = args[0] ? resolvePath(ctx.currentDir, args[0]) : ctx.currentDir;
  const entries = listDirectory(ctx.vfs, targetPath, ctx.isSudo);

  if (entries === null) {
    return { lines: [{ text: `ls: cannot access '${args[0] || ctx.currentDir}': No such file or directory`, type: 'stderr' }] };
  }

  if (entries.length === 0) {
    return { lines: [{ text: '', type: 'stdout' }] };
  }

  const dirs = entries.filter(e => e.type === 'dir');
  const files = entries.filter(e => e.type === 'file');

  const output: string[] = [
    '  total ' + (dirs.length + files.length),
    '',
  ];

  for (const dir of dirs) {
    const sudoMark = dir.requiredSudo ? ' [root]' : '';
    output.push('  drwxr-xr-x  ' + dir.name + '/' + sudoMark);
  }
  for (const file of files) {
    const execMark = file.requiredSudo ? ' [root]' : '';
    output.push('  -rw-r--r--  ' + file.name + execMark);
  }

  return {
    lines: output.map(t => ({ text: t, type: 'stdout' as const })),
  };
}

function handleCd(args: string[], ctx: CmdContext): CmdResult {
  let targetPath: string;
  if (args.length === 0) {
    targetPath = '/home/sawroz';
  } else if (args[0] === '-') {
    targetPath = ctx.currentDir; // Would need previous dir tracking - simplified
  } else {
    targetPath = resolvePath(ctx.currentDir, args[0]);
  }

  const node = getNodeAtPath(ctx.vfs, targetPath, ctx.isSudo);
  if (!node || node.type !== 'dir') {
    return { lines: [{ text: `cd: ${args[0]}: No such directory`, type: 'stderr' }] };
  }

  let resolved = targetPath;
  if (!targetPath.endsWith('/')) resolved = targetPath;

  return { lines: [], newDir: resolved };
}

function handleCat(args: string[], ctx: CmdContext): CmdResult {
  if (args.length === 0) {
    return { lines: [{ text: 'cat: missing operand', type: 'stderr' }] };
  }

  const targetPath = resolvePath(ctx.currentDir, args[0]);
  const node = getNodeAtPath(ctx.vfs, targetPath, ctx.isSudo);

  if (!node) {
    const sudoNode = getNodeAtPath(ctx.vfs, targetPath, true);
    if (sudoNode && sudoNode.requiredSudo) {
      return { lines: [{ text: `cat: ${args[0]}: Permission denied. Try using 'sudo' first.`, type: 'stderr' }] };
    }
    return { lines: [{ text: `cat: ${args[0]}: No such file`, type: 'stderr' }] };
  }

  if (node.type !== 'file') {
    return { lines: [{ text: `cat: ${args[0]}: Is a directory`, type: 'stderr' }] };
  }

  const contentLines = node.content.split('\n').map(line => ({
    text: line,
    type: 'stdout' as const,
  }));

  return { lines: contentLines };
}

function handleMkdir(args: string[], ctx: CmdContext): CmdResult {
  if (args.length === 0) {
    return { lines: [{ text: 'mkdir: missing operand', type: 'stderr' }] };
  }

  const targetPath = resolvePath(ctx.currentDir, args[0]);
  const existingNode = getNodeAtPath(ctx.vfs, targetPath, ctx.isSudo);

  if (existingNode) {
    return { lines: [{ text: `mkdir: cannot create directory '${args[0]}': File exists`, type: 'stderr' }] };
  }

  const newVfs = createNodeInVFS(ctx.vfs, targetPath, {
    type: 'dir',
    name: args[0].split('/').filter(Boolean).pop() || args[0],
    children: {},
    requiredSudo: ctx.isSudo && ctx.currentDir.startsWith('/root'),
  }, ctx.isSudo);

  if (newVfs === ctx.vfs) {
    return { lines: [{ text: `mkdir: cannot create directory '${args[0]}': Permission denied`, type: 'stderr' }] };
  }

  return { lines: [], newVfs };
}

function handleTouch(args: string[], ctx: CmdContext): CmdResult {
  if (args.length === 0) {
    return { lines: [{ text: 'touch: missing operand', type: 'stderr' }] };
  }

  const targetPath = resolvePath(ctx.currentDir, args[0]);
  const existingNode = getNodeAtPath(ctx.vfs, targetPath, ctx.isSudo);

  if (existingNode) {
    return { lines: ['', `  '${args[0]}' already exists`].map(t => ({ text: t, type: 'stdout' as const })) };
  }

  const newVfs = createNodeInVFS(ctx.vfs, targetPath, {
    type: 'file',
    name: args[0].split('/').filter(Boolean).pop() || args[0],
    content: '',
  }, ctx.isSudo);

  if (newVfs === ctx.vfs) {
    return { lines: [{ text: `touch: cannot touch '${args[0]}': Permission denied`, type: 'stderr' }] };
  }

  return { lines: [] };
}

function handleTheme(args: string[], ctx: CmdContext): CmdResult {
  const validThemes: ThemeName[] = [
    'matrix', 'amber', 'cyberpunk', 'ubuntu', 'monochrome',
    'dracula', 'nord', 'tokyo-night', 'synthwave', 'gruvbox',
    'blood', 'catppuccin',
  ];

  const themeDescriptions: Record<string, string> = {
    matrix: 'Classic green-on-black Matrix aesthetic',
    amber: 'Warm amber phosphor vintage terminal',
    cyberpunk: 'Neon cyan and magenta cyberpunk glow',
    ubuntu: 'Canonical Ubuntu terminal colors',
    monochrome: 'Clean grayscale minimal look',
    dracula: 'Dark purple with vibrant pink accents',
    nord: 'Arctic blue-teal inspired by Nord palette',
    'tokyo-night': 'Deep midnight blues with golden highlights',
    synthwave: 'Retro 80s neon synthwave vibes',
    gruvbox: 'Warm earthy retro color scheme',
    blood: 'Aggressive red-on-black hacker theme',
    catppuccin: 'Soft pastel pink-purple latte tones',
  };

  if (args.length === 0) {
    return {
      lines: [
        { text: '', type: 'stdout' },
        { text: '  Current theme: ' + ctx.theme + '  (' + themeDescriptions[ctx.theme] + ')', type: 'stdout' },
        { text: '', type: 'stdout' },
        { text: '  Available themes:', type: 'stdout' },
        ...validThemes.map(t => ({ text: '    ' + t.padEnd(18) + themeDescriptions[t], type: 'stdout' as const })),
        { text: '', type: 'stdout' },
        { text: '  Usage: theme <name>   (e.g. theme dracula)', type: 'stdout' },
        { text: '', type: 'stdout' },
      ],
    };
  }

  const requested = args[0].toLowerCase() as ThemeName;
  if (!validThemes.includes(requested)) {
    return { lines: [{ text: `theme: '${args[0]}' is not a valid theme`, type: 'stderr' }] };
  }

  return { lines: [{ text: `Theme set to '${requested}'.`, type: 'stdout' }], newTheme: requested };
}

function handleSudo(args: string[], ctx: CmdContext): CmdResult {
  if (args.length === 0) {
    return { lines: [{ text: 'usage: sudo <command>', type: 'stderr' }] };
  }

  if (ctx.isSudo) {
    const subResult = processCommand(args.join(' '), { ...ctx, isSudo: true });
    return subResult;
  }

  return { lines: [{ text: '', type: 'stdout' }], newMode: 'sudo-password' };
}

function handleVi(args: string[], ctx: CmdContext): CmdResult {
  if (args.length === 0) {
    return { lines: [{ text: 'vi: missing filename (use: vi <filename>)', type: 'stderr' }] };
  }

  const targetPath = resolvePath(ctx.currentDir, args[0]);

  const existingNode = getNodeAtPath(ctx.vfs, targetPath, ctx.isSudo);
  let content = '';
  if (existingNode && existingNode.type === 'file') {
    content = existingNode.content;
  }

  return {
    lines: [],
    newMode: 'editor',
    editorContent: content,
    editorFilename: args[0],
  };
}

function handleBanner(_args: string[], ctx: CmdContext): CmdResult {
  const node = getNodeAtPath(ctx.vfs, '/home/sawroz/welcome.txt', ctx.isSudo);
  if (node && node.type === 'file') {
    const lines = node.content.split('\n').map(l => ({ text: l, type: 'stdout' as const }));
    return { lines };
  }
  return { lines: [] };
}

function handleMatrix(_args: string[], _ctx: CmdContext): CmdResult {
  return { lines: [{ text: 'Matrix rain effect toggled.', type: 'stdout' }] };
}

const commandMap: Record<string, (args: string[], ctx: CmdContext) => CmdResult> = {
  help: handleHelp,
  about: handleAbout,
  skills: handleSkills,
  projects: handleProjects,
  contact: handleContact,
  clear: handleClear,
  whoami: handleWhoami,
  history: handleHistory,
  echo: handleEcho,
  date: handleDate,
  uptime: handleUptime,
  uname: handleUname,
  neofetch: handleNeofetch,
  pwd: handlePwd,
  ls: handleLs,
  cd: handleCd,
  cat: handleCat,
  mkdir: handleMkdir,
  touch: handleTouch,
  theme: handleTheme,
  themes: handleTheme,
  sudo: handleSudo,
  vi: handleVi,
  nano: handleVi,
  banner: handleBanner,
  matrix: handleMatrix,
};

export function processCommand(input: string, ctx: CmdContext): CmdResult {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };

  const parts = trimmed.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [trimmed];
  const parsedParts = parts.map(p => p.replace(/^["']|["']$/g, ''));
  const cmd = parsedParts[0].toLowerCase();
  const args = parsedParts.slice(1);

  const handler = commandMap[cmd];
  if (!handler) {
    return {
      lines: [
        { text: `bash: ${cmd}: command not found`, type: 'stderr' },
        { text: `Try 'help' for a list of available commands.`, type: 'stdout' },
      ],
    };
  }

  return handler(args, ctx);
}

export function getAutoCompleteSuggestions(partial: string, ctx: CmdContext): string[] {
  const commands = Object.keys(commandMap);
  const matches: string[] = [];

  const parts = partial.trim().split(/\s+/);
  const isFirstWord = parts.length <= 1 || partial.endsWith(' ');

  if (isFirstWord) {
    const current = parts[0] || '';
    for (const cmd of commands) {
      if (cmd.startsWith(current.toLowerCase()) && cmd !== current) {
        matches.push(cmd);
      }
    }
    return matches;
  }

  // Complete file paths
  const lastPart = parts[parts.length - 1];
  const dirPart = lastPart.includes('/') ? lastPart.substring(0, lastPart.lastIndexOf('/') + 1) : '';
  const filePart = lastPart.includes('/') ? lastPart.substring(lastPart.lastIndexOf('/') + 1) : lastPart;

  const searchPath = dirPart ? resolvePath(ctx.currentDir, dirPart) : ctx.currentDir;
  const entries = listDirectory(ctx.vfs, searchPath, ctx.isSudo);
  if (!entries) return [];

  for (const entry of entries) {
    const displayName = entry.type === 'dir' ? entry.name + '/' : entry.name;
    if (displayName.startsWith(filePart) && displayName !== filePart) {
      matches.push(dirPart + displayName);
    }
  }

  return matches;
}
