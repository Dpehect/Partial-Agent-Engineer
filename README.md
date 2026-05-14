# SB Detector: Full-Stack Diagnostic Ecosystem

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://partial-agent-engineer-7glo.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/Dpehect/Partial-Agent-Engineer.git)
[![Hackathon Win](https://img.shields.io/badge/Recognition-1st_Place_Hackathon_China-gold)](https://github.com/Dpehect/Partial-Agent-Engineer.git)

SB Detector is an integrated software suite designed for automated project health assessment. **This project was awarded 1st Place at a local Agent Engineering Hackathon in China for its innovative approach to automated code diagnostics.**

## Architecture

The system is split into İki primary components that work in tandem:

### 1. SB Detector CLI (Python Engine)
The CLI acts as the data collection layer. It performs static analysis on local directories and live URL scanning. 

*   **Static Analysis**: Scans source code for sensitive information (API keys, secrets), unsafe functions (e.g., `gets()` in C), and misconfigurations (e.g., unignored `.env` or `node_modules` files).
*   **Network Scanning**: Uses BeautifulSoup4 and Requests to analyze live web pages for SEO metadata, semantic hierarchy, and accessibility standards.
*   **Data Orchestration**: Findings are serialized into JSON and transmitted to the web dashboard via secure POST requests.

### 2. SB Detector Dashboard (Next.js 15 Framework)
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

## Installation and Setup

The SB Detector ecosystem requires both the web dashboard and the Python CLI to be configured for the full interactive experience.

### 1. Web Dashboard Setup (Next.js)
The dashboard acts as the central hub for viewing reports. 
1.  Navigate to the `project-auditor` directory.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`
4.  The dashboard will be available at `http://localhost:3000`.

### 2. Python CLI Installation (SB Detector Tool)
The CLI tool is what performs the actual scanning on your machine. To install it as a global command on your PC:

1.  **Ensure Python is installed**: Open your terminal/command prompt and type `python --version`. You need version 3.9 or higher.
2.  **Navigate to the tool directory**:
    ```bash
    cd audit-pulse
    ```
3.  **Install the package**: This will install all dependencies (`click`, `rich`, `requests`, etc.) and register the `audit-pulse` command.
    ```bash
    pip install .
    ```
    *Note: If you are on a Mac/Linux and encounter permission issues, use `pip install -e .` or `pip install --user .`*

4.  **Verification**: Type `audit-pulse --help` in your terminal. If you see the SB Detector help menu, the installation was successful.

## How to Run a Scan

1.  **Open the Web Dashboard**: Make sure your Next.js server is running (`npm run dev`).
2.  **Navigate to any project**: Open a new terminal and go to the directory of the project you want to audit.
3.  **Initiate Scan**: Run the following command:
    ```bash
    audit-pulse .
    ```
4.  **Interactive Experience**:
    *   The CLI will display a **SB Detector CLI** panel with a progress bar.
    *   It will perform a deep scan of your files and network status.
    *   A summary table will appear in your terminal showing detected issues.
    *   **Prompt**: The tool will ask: `Do you want to view the full interactive report in your browser? [Y/n]`.
    *   Press **Y** to automatically open the luxury web report on your dashboard.

---
© 2026 SB Detector Engineering. Engineered for precision and reliability.
