# Chase Playwright Agentic

A **Playwright** project using **TypeScript + Chrome**, pre-configured to work with
**Playwright Test Agents** (🎭 planner, 🎭 generator, 🎭 healer).

## ✨ Features

- **TypeScript** end-to-end testing with Playwright Test
- **Chrome** (system-installed Google Chrome via `channel: 'chrome'`)
- **Playwright Test Agents** initialized for VS Code (`--loop=vscode`)
- Custom fixtures in `fixtures/` with a ready-to-use `seed.spec.ts`
- `specs/` directory for human-readable test plans
- HTML test reports, traces, and screenshots on failure

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Google Chrome](https://www.google.com/chrome/) installed on the system
- VS Code **v1.105+** for the agentic experience

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Install the Chrome browser for Playwright
npx playwright install chrome

# 3. Run the tests
npm test
```

## 🎭 Playwright Test Agents

This project ships with three Playwright Test Agents (in `.github/agents/`):

| Agent | Purpose |
|-------|---------|
| 🎭 **planner** | Explores your app and produces a Markdown test plan in `specs/` |
| 🎭 **generator** | Transforms the plan into executable Playwright tests in `tests/` |
| 🎭 **healer** | Runs the suite and automatically repairs failing tests |

### Using the agents

The agents are driven through your AI tool of choice (VS Code Copilot, Claude Code,
Codex, etc.). The MCP server is configured in `.vscode/mcp.json`.

**Typical agentic workflow:**

1. **Planner** — ask it to explore your app and generate a plan:
   > "Generate a plan for guest checkout."
2. **Generator** — ask it to turn the plan into tests:
   > "Generate tests from `specs/basic-operations.md`."
3. **Healer** — ask it to fix failing tests:
   > "Heal the failing test `add-valid-todo`."

### Regenerating agent definitions

Agent definitions should be regenerated whenever Playwright is updated:

```bash
npx playwright init-agents --loop=vscode
```

## 📁 Project Structure

```
.
├── .github/
│   ├── agents/              # Playwright Test Agent definitions
│   └── workflows/           # Copilot setup steps
├── .vscode/
│   └── mcp.json             # Playwright MCP server config
├── fixtures/
│   └── index.ts             # Custom Playwright fixtures
├── specs/                   # Human-readable test plans (planner output)
├── tests/
│   └── seed.spec.ts         # Seed test bootstrapping the environment
├── playwright.config.ts     # Playwright configuration (Chrome)
├── tsconfig.json
└── package.json
```

## 🧪 Useful Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (headless) |
| `npm run test:headed` | Run tests in headed mode |
| `npm run test:ui` | Open the Playwright UI mode |
| `npm run test:debug` | Run tests with the debugger |
| `npm run report` | Open the HTML test report |
| `npm run codegen` | Generate tests with the codegen tool |
| `npm run agents:init` | Regenerate Playwright Test Agents |

## ⚙️ Configuration

Edit `playwright.config.ts` to adjust:

- **Base URL** — set `BASE_URL` env var or change `use.baseURL`
- **Web server** — uncomment the `webServer` block to auto-start your app
- **Browsers** — add more projects (Firefox, WebKit) as needed

## 📄 License

Private project.
