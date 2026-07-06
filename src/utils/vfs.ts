export interface VFSFile {
  type: 'file';
  name: string;
  content: string;
  isExecutable?: boolean;
  requiredSudo?: boolean;
}

export interface VFSDirectory {
  type: 'dir';
  name: string;
  children: { [name: string]: VFSNode };
  requiredSudo?: boolean;
}

export type VFSNode = VFSFile | VFSDirectory;

export const INITIAL_VFS: VFSDirectory = {
  type: 'dir',
  name: '/',
  children: {
    bin: {
      type: 'dir',
      name: 'bin',
      children: {
        neofetch: {
          type: 'file',
          name: 'neofetch',
          content: 'echo "Simulated system specifications utility."',
          isExecutable: true,
        },
        editor: {
          type: 'file',
          name: 'editor',
          content: 'echo "Visual text editor utility."',
          isExecutable: true,
        },
        sudo: {
          type: 'file',
          name: 'sudo',
          content: 'echo "Superuser run utility."',
          isExecutable: true,
        },
      },
    },
    home: {
      type: 'dir',
      name: 'home',
      children: {
        sawroz: {
          type: 'dir',
          name: 'sawroz',
          children: {
            'welcome.txt': {
              type: 'file',
              name: 'welcome.txt',
              content: `===================================================================
*  __                  _             _ _                      _   *
* / _|                (_)           | (_)                    | |  *
*| |_ ___  _ __ _   _  _ _ __   __ _| |_ _ __  _   _ ___     | |  *
*|  _/ _ \\| '__| | | || | '_ \\ / _\` | | | '_ \\| | | / __|    | |  *
*| |  (_) | |  | |_| || | | | | (_| | | | | | | |_| \\__ \\    |_|  *
*|_|  \\___/|_|   \\__,_|/|_|_| |_|\\__, |_|_|_| |_|\\__,_|___/    (_)  *
*                                 __/ |                           *
*                                |___/                            *
===================================================================

Welcome to my interactive terminal portfolio!

I'm Sawroz, a Software Engineer and Linux Enthusiast.
This terminal is a full-fledged simulation of a UNIX shell.

Type 'help' to see available commands, or navigate around using 'ls', 'cd', and 'cat'.
You can edit files with 'vi <filename>' or 'nano <filename>'.

Can you find the hidden root files? Try to gain 'sudo' access...
`,
            },
            'about.md': {
              type: 'file',
              name: 'about.md',
              content: `# About Me

Hello! I'm Sawroz, a passionate Systems & Full-stack Software Engineer based in the digital realm.

I specialize in building high-performance APIs, robust distributed systems, and modern, highly interactive web applications. My design philosophy is heavily influenced by the simplicity, minimalism, and efficiency of UNIX systems. 

I love automation, shell scripting, containerization, and configuring my own development environments from scratch.

* Primary Languages: TypeScript, Go, Python, C++
* Favorite OS: Arch Linux (btw), Ubuntu Server
* Text Editor: Neovim (with custom Lua config)
* Keyboard Layout: US QWERTY (preferring modal editing keys)

Use 'cd skills' or 'cat contact.txt' to discover more!
`,
            },
            skills: {
              type: 'dir',
              name: 'skills',
              children: {
                'languages.txt': {
                  type: 'file',
                  name: 'languages.txt',
                  content: `[Languages & Runtimes]
- TypeScript/JavaScript (Advanced) [██████████████████░░] 90%
- Go (Proficient)                  [██████████████░░░░░░] 70%
- Python (Proficient)              [████████████████░░░░] 80%
- C++ (Prior Experience)           [██████████░░░░░░░░░░] 50%
- Shell/Bash/Zsh (Advanced)         [██████████████████░░] 90%
- SQL / NoSQL                      [████████████████░░░░] 80%`,
                },
                'frontend.txt': {
                  type: 'file',
                  name: 'frontend.txt',
                  content: `[Frontend Stack]
- React.js / Next.js              [██████████████████░░] 90%
- Redux Toolkit / Zustand          [████████████████░░░░] 80%
- Tailwind CSS / Radix UI          [████████████████████] 100%
- HTML5 / CSS3 / ESNext            [████████████████████] 100%
- Webpack / Vite / Turbopack       [████████████████░░░░] 80%
- WebSockets / WebRTC              [████████████░░░░░░░░] 60%`,
                },
                'backend.txt': {
                  type: 'file',
                  name: 'backend.txt',
                  content: `[Backend & Datastores]
- Node.js / Express / Fastify      [██████████████████░░] 90%
- Go Gin / Fiber                   [██████████████░░░░░░] 70%
- PostgreSQL / MySQL               [████████████████░░░░] 80%
- MongoDB / Redis (Caching)        [████████████████░░░░] 80%
- gRPC / Protocol Buffers          [██████████░░░░░░░░░░] 50%
- RESTful API Architecture         [██████████████████░░] 90%`,
                },
                'devops.txt': {
                  type: 'file',
                  name: 'devops.txt',
                  content: `[DevOps & Systems]
- Docker / Docker Compose          [██████████████████░░] 90%
- Linux System Administration      [████████████████░░░░] 80%
- Git / GitHub Actions (CI/CD)     [██████████████████░░] 90%
- AWS (S3, EC2, ECS, Lambda)       [██████████████░░░░░░] 70%
- Nginx / Reverse Proxies          [████████████████░░░░] 80%
- Kubernetes (Basics)              [██████████░░░░░░░░░░] 50%`,
                },
              },
            },
            projects: {
              type: 'dir',
              name: 'projects',
              children: {
                'terminal-portfolio': {
                  type: 'dir',
                  name: 'terminal-portfolio',
                  children: {
                    'readme.md': {
                      type: 'file',
                      name: 'readme.md',
                      content: `# Terminal Portfolio

An interactive, responsive retro terminal application mimicking a standard Linux shell.

## Core Features
* Simulated hierarchical UNIX-like virtual file system
* Command execution with history traversal (up/down arrow keys)
* Tab completion for commands and file paths
* In-terminal interactive text editor (vi / nano simulation)
* Multi-theme terminal skins (Matrix, Amber Phosphor, Cyberpunk, Ubuntu)
* Fully styled CRT screen wrapper with authentic scanlines & vignette
* Animated BIOS system boot simulation

## Technology Stack
* React 19 (Functional Components & Hooks)
* TypeScript (Strict Typing)
* Tailwind CSS
* Vite (Fast HMR bundler)`,
                    },
                    'run.sh': {
                      type: 'file',
                      name: 'run.sh',
                      content: '#!/bin/bash\necho "Starting Terminal Portfolio locally..."\nnpm run dev\necho "Running on http://localhost:5173"',
                    },
                  },
                },
                'e-commerce-engine': {
                  type: 'dir',
                  name: 'e-commerce-engine',
                  children: {
                    'details.txt': {
                      type: 'file',
                      name: 'details.txt',
                      content: `Project: E-Commerce Microservices Engine
Status: Production Ready
Role: Lead Backend Engineer

A highly scalable backend engine modeled around a microservices architecture.

[Key Features]
- Independent services for Authentication, Product Catalog, Cart, and Order Processing
- Built with Go and Node.js for high concurrent throughput
- PostgreSQL for ACID transactional order storage
- Redis for product caching and distributed lock management
- RabbitMQ messaging queue for async email triggers and invoice generation
- Hosted on AWS ECS with Docker containers and complete CI/CD via GitHub Actions.`,
                    },
                  },
                },
                'proxmox-homelab': {
                  type: 'dir',
                  name: 'proxmox-homelab',
                  children: {
                    'specs.txt': {
                      type: 'file',
                      name: 'specs.txt',
                      content: `Project: Custom Homelab Server
Status: Active, 99.9% Uptime

A mini-datacenter in my closet running virtualization and storage networks.

[Hardware]
- CPU: AMD Ryzen 7 5700X (8 Cores, 16 Threads)
- RAM: 64GB DDR4 ECC 3200MHz
- Storage: 1TB NVMe (VM Boot), 4x 4TB Western Digital Red (ZFS RAIDZ1 NAS)
- Hypervisor: Proxmox VE 8.1

[Self-Hosted Services]
- Pi-Hole: Network-wide DNS-level ad blocking
- Plex Media Server: Personal streaming with hardware transcoding
- TrueNAS Core: SMB/NFS secure file storage
- Nginx Proxy Manager: Reverse proxy with automated Let's Encrypt SSLs
- Docker VM: Running portainer, redis, ghost blog, and webhooks`,
                    },
                  },
                },
              },
            },
            'contact.txt': {
              type: 'file',
              name: 'contact.txt',
              content: `You can reach out to me through any of the following ports:

- Email:     sawroz@engineer.com
- GitHub:    github.com/sawroz
- LinkedIn:  linkedin.com/in/sawroz
- Twitter:   twitter.com/sawroz_dev
- Website:   sawroz.dev

Or try using the 'contact' command in this terminal to drop a direct message!
`,
            },
          },
        },
      },
    },
    etc: {
      type: 'dir',
      name: 'etc',
      children: {
        motd: {
          type: 'file',
          name: 'motd',
          content: `
Welcome to SAWROZ OS v1.0.4-LTS (x86_64-pc-linux-gnu)

 * Documentation: https://github.com/sawroz/terminal-portfolio
 * System status: Healthy
 * Load average:  0.08, 0.12, 0.05
 * Temperature:   38°C (Idle)

Have fun exploring the file system. Try 'sudo -s' if you dare.
`,
        },
        passwd: {
          type: 'file',
          name: 'passwd',
          content: 'root:x:0:0:root:/root:/bin/bash\nsawroz:x:1000:1000:Sawroz,,,:/home/sawroz:/bin/bash\nguest:x:1001:1001:Guest,,,:/home/sawroz:/bin/bash',
        },
        'secret.txt': {
          type: 'file',
          name: 'secret.txt',
          content: 'Error: Access Denied. Only user "root" can view this file.',
          requiredSudo: true,
        },
      },
    },
    root: {
      type: 'dir',
      name: 'root',
      requiredSudo: true,
      children: {
        'root_secret.md': {
          type: 'file',
          name: 'root_secret.md',
          content: `# CONGRATULATIONS ROOT USER! 🚩

You have successfully escalated privileges and gained root access to this system!
Here is your secret token:

   [ FLAG_SYS_AD_1337_ACC_ESC ]

How did you do it?
Did you guess the password or read the memory structure? 

Either way, you are officially a terminal wizard.
Send this token to sawroz@engineer.com and let's grab a coffee or talk systems!

- Sawroz
`,
          requiredSudo: true,
        },
      },
    },
    var: {
      type: 'dir',
      name: 'var',
      children: {
        log: {
          type: 'dir',
          name: 'log',
          children: {
            'auth.log': {
              type: 'file',
              name: 'auth.log',
              content: `Jul  6 10:14:22 sawroz-server sshd[38294]: Server listening on 0.0.0.0 port 22.
Jul  6 10:15:01 sawroz-server CRON[38302]: pam_unix(cron:session): session opened for user root by (uid=0)
Jul  6 12:43:55 sawroz-server sshd[39241]: Invalid user admin from 198.51.100.12 port 48218
Jul  6 12:43:57 sawroz-server sshd[39241]: Failed password for invalid user admin from 198.51.100.12 port 48218 ssh2
Jul  6 15:20:10 sawroz-server sshd[40122]: Accepted publickey for sawroz from 203.0.113.88 port 59421 ssh2: RSA SHA256:d8a2...
Jul  6 16:30:12 sawroz-server sudo: sawroz : TTY=pts/0 ; PWD=/home/sawroz ; USER=root ; COMMAND=/bin/bash`,
            },
          },
        },
      },
    },
  },
};

// VFS Helper functions
export function getCleanPathSegments(path: string): string[] {
  return path.split('/').filter((s) => s.length > 0);
}

export function resolvePath(currentPath: string, targetPath: string): string {
  if (targetPath.startsWith('/')) {
    return '/' + getCleanPathSegments(targetPath).join('/');
  }

  const currentSegments = getCleanPathSegments(currentPath);
  const targetSegments = getCleanPathSegments(targetPath);

  for (const segment of targetSegments) {
    if (segment === '.') {
      continue;
    } else if (segment === '..') {
      currentSegments.pop();
    } else {
      currentSegments.push(segment);
    }
  }

  return '/' + currentSegments.join('/');
}

export function getNodeAtPath(
  vfs: VFSDirectory,
  absolutePath: string,
  isSudo: boolean = false
): VFSNode | null {
  const segments = getCleanPathSegments(absolutePath);
  let currentNode: VFSNode = vfs;

  for (const segment of segments) {
    if (currentNode.type !== 'dir') return null;

    const nextNode: VFSNode | undefined = currentNode.children[segment];
    if (!nextNode) return null;

    if (nextNode.requiredSudo && !isSudo) {
      return null;
    }

    currentNode = nextNode;
  }

  return currentNode;
}

export function listDirectory(
  vfs: VFSDirectory,
  absolutePath: string,
  isSudo: boolean = false
): { name: string; type: 'file' | 'dir'; requiredSudo?: boolean }[] | null {
  const node = getNodeAtPath(vfs, absolutePath, isSudo);
  if (!node || node.type !== 'dir') return null;

  return Object.values(node.children).map((child) => ({
    name: child.name,
    type: child.type,
    requiredSudo: child.requiredSudo,
  }));
}

export function createNodeInVFS(
  vfs: VFSDirectory,
  absolutePath: string,
  node: VFSNode,
  isSudo: boolean = false
): VFSDirectory {
  // Deep clone VFS to keep React state pure
  const newVfs = JSON.parse(JSON.stringify(vfs)) as VFSDirectory;
  const segments = getCleanPathSegments(absolutePath);
  
  if (segments.length === 0) return vfs; // Can't replace root directly

  const nodeName = segments[segments.length - 1];
  const parentSegments = segments.slice(0, -1);

  let currentNode = newVfs;
  for (const segment of parentSegments) {
    const nextNode = currentNode.children[segment];
    if (!nextNode || nextNode.type !== 'dir') return vfs; // Path doesn't exist
    if (nextNode.requiredSudo && !isSudo) return vfs; // Permission denied
    currentNode = nextNode;
  }

  currentNode.children[nodeName] = node;
  return newVfs;
}
