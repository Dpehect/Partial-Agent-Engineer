# AuditPulse: Full-Stack Diagnostic Ecosystem

AuditPulse is an integrated software suite designed for automated project health assessment. It combines a local Python-based command-line interface with a high-performance web dashboard to provide developers with deep insights into their code's security, SEO, and structural integrity.

## Architecture

The system is split into İki primary components that work in tandem:

### 1. AuditPulse CLI (Python Engine)
The CLI acts as the data collection layer. It performs static analysis on local directories and live URL scanning. 

*   **Static Analysis**: Scans source code for sensitive information (API keys, secrets), unsafe functions (e.g., `gets()` in C), and misconfigurations (e.g., unignored `.env` or `node_modules` files).
*   **Network Scanning**: Uses BeautifulSoup4 and Requests to analyze live web pages for SEO metadata, semantic hierarchy, and accessibility standards.
*   **Data Orchestration**: Findings are serialized into JSON and transmitted to the web dashboard via secure POST requests.

### 2. AuditPulse Dashboard (Next.js 15 Framework)
The dashboard serves as the visualization and persistence layer, built using the latest web technologies.

*   **Framework**: Next.js 15 App Router with React 19.
*   **Styling**: A hybrid design system utilizing Tailwind CSS v4 for utility-first styling and Bootstrap 5 for robust grid structures.
*   **Animations**: Framer Motion is used for high-fidelity state transitions and metric visualizations.
*   **Visual Identity**: Inspired by Swiss Minimalism and modern luxury SaaS aesthetics, featuring mesh gradients, glassmorphism, and a strict typographic hierarchy utilizing Outfit and Inter typefaces.

## Technical Specifications

### Security Diagnostics
*   **Secret Detection**: Regex-based scanning for hardcoded credentials and environment leaks.
*   **Static Code Analysis**: Identification of known unsafe coding patterns and vulnerable library inclusions.
*   **Protocol Enforcement**: Verification of security-critical files like `.gitignore` and `.env` to prevent accidental credential leakage.

### SEO & Frontend Auditing
*   **Metadata Validation**: Comprehensive checks for title tags, meta descriptions, and OpenGraph properties.
*   **DOM Integrity**: Verification of semantic HTML5 usage and heading hierarchy for optimal crawlability.
*   **Performance Metrics**: Structural analysis of asset loading and accessibility (A11y) compliance.

### Tech Stack Details
*   **Python Libraries**: `click`, `rich`, `requests`, `beautifulsoup4`.
*   **Web Technologies**: `Next.js 15`, `React 19`, `Tailwind CSS 4`, `Framer Motion`, `Lucide React`, `Bootstrap 5`.
*   **Data Handling**: UUID-based report storage with server-side rendering for persistent result sharing.

## Installation and Usage

### Prerequisites
*   Python 3.9 or higher
*   Node.js 18 or higher

### Setting Up the CLI
Navigate to the `audit-pulse` directory and install the package locally:
```bash
pip install .
```

### Starting the Web Dashboard
Navigate to the `project-auditor` directory, install dependencies, and run the development server:
```bash
npm install
npm run dev
```

### Running an Audit
Once the dashboard is active (default: `localhost:3000`), run the CLI from any project directory:
```bash
audit-pulse .
```
Upon completion, the CLI will provide a summary in the terminal and a prompt to open the full interactive report in your default web browser.

---
© 2026 AuditPulse Engineering. Engineered for precision and reliability.
