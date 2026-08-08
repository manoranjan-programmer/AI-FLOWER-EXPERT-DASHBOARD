# 🌸 FlowerAI Command System

A professional, enterprise-grade, standalone **AI Command System CLI** built for the **Flower AI Expert Dashboard**.

Inspired by industry-standard CLI architectures such as **Git**, **Docker**, **Vercel CLI**, **Supabase CLI**, **Cursor CLI**, and **Claude Code**.

```
  ███████╗██╗      ██████╗ ██╗    ██╗███████╗██████╗      █████╗ ██╗
  ██╔════╝██║     ██╔═══██╗██║    ██║██╔════╝██╔══██╗    ██╔══██╗██║
  █████╗  ██║     ██║   ██║██║ █╗ ██║█████╗  ██████╔╝    ███████║██║
  ██╔══╝  ██║     ██║   ██║██║███╗██║██╔══╝  ██╔══██╗    ██╔══██║██║
  ██║     ███████╗╚██████╔╝╚███╔███╔╝███████╗██║  ██║    ██║  ██║██║
  ╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝
```

---

## 🌟 Key Features

- 🧠 **Natural Language AI Command Parser**: Understands spoken/written English queries like `"Show today's analytics"`, `"Search sunflower"`, or `"Export PDF"`.
- ⚡ **Command Registry & Alias Engine**: Built-in support for short aliases (e.g. `flower-ai dash` -> `dashboard`).
- 🌐 **Browser Route Dispatcher**: Seamlessly opens dashboard views (`/dashboard`, `/analytics`, `/chatbot`, `/users`, `/flowers`, `/settings`) without modifying frontend or backend logic.
- 📊 **Export Engine**: Export analytical data into **PDF**, **Excel**, and **CSV** files with custom topics.
- 📜 **Execution History & Telemetry**: Stores local history logs in `~/.flower-ai-history.json` with execution timing & success metrics.
- 🔌 **Extensible Plugin Loader**: Modular architecture allowing external extension plugins to be registered at runtime.
- 🎨 **Rich Terminal Design**: Formatted ANSI boxes, tables, animated spinners, status tags, and ASCII headers.

---

## 📁 Directory Structure

```
FlowerAI-Command-System/
│
├── bin/
│   └── flower-ai.js            # Executable CLI entrypoint (#!/usr/bin/env node)
├── cli/
│   └── interactive-shell.js    # Interactive REPL mode
├── command-engine/
│   ├── executor.js             # Execution orchestrator & timing pipeline
│   ├── aliases.js              # Shorthand alias manager
│   ├── history.js              # Command history recorder & storage
│   └── plugin-loader.js        # Plugin architecture loader
├── parser/
│   ├── cli-parser.js           # Strict CLI argument & flag parser
│   └── ai-parser.js            # Natural Language intent & entity mapping engine
├── registry/
│   └── command-registry.js     # Central command store & route handlers
├── services/
│   ├── browser-service.js      # System browser URL launcher
│   ├── export-service.js       # PDF / Excel / CSV file generator
│   ├── report-service.js       # Analytical report generator
│   └── api-service.js          # Knowledge search & REST client
├── config/
│   ├── default-config.json     # System route defaults & settings
│   └── config-manager.js       # Persistent configuration manager (~/.flower-ai-config.json)
├── utils/
│   ├── logger.js               # Styled terminal logger (banners, boxes, tables)
│   ├── spinner.js              # Animated terminal loading indicator
│   └── autocomplete.js         # Command fuzzy search & suggestions
├── package.json                # NPM configuration & binary definition
├── index.js                    # Core Node.js library exports
└── README.md                   # Full documentation
```

---

## 🚀 Quick Start & Installation

### 1. Global Link (Recommended for CLI use)
To make the `flower-ai` command accessible anywhere in your terminal:

```bash
cd FlowerAI-Command-System
npm link
```

Now you can run:
```bash
flower-ai help
```

### 2. Direct Execution via Node
You can also run commands directly using Node:

```bash
node bin/flower-ai.js help
node bin/flower-ai.js dashboard
```

---

## 💻 Usage & Examples

### 1. Standard CLI Commands
```bash
flower-ai dashboard            # Opens main dashboard view
flower-ai analytics            # Opens real-time analytics
flower-ai chatbot              # Opens AI chatbot interface
flower-ai users                # Opens user directory
flower-ai flowers              # Opens flower catalog statistics
flower-ai settings             # Opens system settings
flower-ai report               # Generates terminal analytics report
flower-ai search sunflower     # Performs knowledge search for Sunflower
flower-ai search lotus         # Performs knowledge search for Lotus
flower-ai export pdf           # Exports analytical data to PDF
flower-ai export excel         # Exports analytical data to Excel
flower-ai export csv           # Exports analytical data to CSV
flower-ai refresh              # Clears cache and pings server status
flower-ai reload               # Reloads CLI configurations
flower-ai help                 # Displays interactive help menu
```

### 2. Natural Language AI Commands
The CLI automatically parses natural language instructions:

```bash
flower-ai "Open dashboard"
flower-ai "Show today's analytics"
flower-ai "Open flower statistics"
flower-ai "Search sunflower"
flower-ai "Generate monthly report"
flower-ai "Export PDF"
flower-ai "Open chatbot analytics"
```

### 3. Shorthand Aliases
```bash
flower-ai dash                 # Alias for dashboard
flower-ai stat                 # Alias for analytics
flower-ai chat                 # Alias for chatbot
flower-ai flw                  # Alias for flowers
flower-ai set                  # Alias for settings
flower-ai exp pdf              # Alias for export pdf
```

### 4. Interactive Shell (REPL Mode)
Launch the interactive shell by running `flower-ai` without arguments:

```bash
flower-ai
```
*Prompt:*
```
flower-ai 🌸 > dashboard
flower-ai 🌸 > "Search sunflower"
flower-ai 🌸 > exit
```

---

## ⚙️ Configuration

Configurations are stored in `~/.flower-ai-config.json` and can be inspected or updated via CLI:

```bash
# View configuration
flower-ai config get

# Update Base URL
flower-ai config set baseUrl http://localhost:5173

# Reset to defaults
flower-ai config reset
```

---

## 🔒 Independent Architecture Guarantee

This module lives strictly inside `./FlowerAI-Command-System/` and does **NOT**:
- Modify existing frontend or backend source code.
- Modify MongoDB or database schemas.
- Alter existing authentication or REST API endpoints.
- Break existing project logic.

It communicates with the **Flower AI Expert Dashboard** purely through browser URLs and HTTP contracts.
