import os
import re
from bs4 import BeautifulSoup
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class AuditIssue:
    category: str
    severity: str
    title: str
    description: str
    recommendation: str
    file: Optional[str] = None

class AuditEngine:
    def __init__(self, root_path: str):
        self.root_path = root_path
        self.issues: List[AuditIssue] = []

    def run(self):
        self._audit_gitignore()
        self._scan_files()
        return self.issues

    def _audit_gitignore(self):
        gitignore_path = os.path.join(self.root_path, ".gitignore")
        if not os.path.exists(gitignore_path):
            self.issues.append(AuditIssue(
                "Backend", "Low", "Missing .gitignore",
                "No .gitignore file found in the root directory.",
                "Create a .gitignore file to prevent sensitive files from being tracked."
            ))
        else:
            with open(gitignore_path, 'r') as f:
                content = f.read()
                if ".env" not in content:
                    self.issues.append(AuditIssue(
                        "Security", "High", ".env Not Ignored",
                        ".env files contain secrets and should never be committed.",
                        "Add '.env' to your .gitignore file immediately.",
                        ".gitignore"
                    ))
                if "node_modules" not in content and os.path.exists(os.path.join(self.root_path, "package.json")):
                    self.issues.append(AuditIssue(
                        "Backend", "Medium", "node_modules Not Ignored",
                        "Committing node_modules makes your repository unnecessarily large.",
                        "Add 'node_modules' to your .gitignore file.",
                        ".gitignore"
                    ))

    def _scan_files(self):
        for root, dirs, files in os.walk(self.root_path):
            if any(x in root for x in [".git", "node_modules", "__pycache__", "dist", ".next"]):
                continue

            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, self.root_path)
                
                # Check for secrets in all text files
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        self._audit_secrets(content, rel_path)
                        
                        ext = os.path.splitext(file)[1].lower()
                        if ext in ['.html', '.php', '.jsx', '.tsx']:
                            self._audit_frontend(content, rel_path)
                        elif ext in ['.py', '.js', '.c', '.cpp']:
                            self._audit_backend_code(content, rel_path, ext)
                except Exception:
                    continue

    def _audit_secrets(self, content: str, file_path: str):
        # Basic secret detection regex
        patterns = {
            "Hardcoded Password": r'(password|passwd|pwd)\s*=\s*["\'][^"\']+["\']',
            "API Key Pattern": r'(api_key|secret_key|token)\s*=\s*["\'][^"\']+["\']',
        }
        for title, pattern in patterns.items():
            if re.search(pattern, content, re.IGNORECASE):
                self.issues.append(AuditIssue(
                    "Security", "High", title,
                    f"A potential secret was detected in {file_path}.",
                    "Move secrets to environment variables or a secure vault.",
                    file_path
                ))

    def _audit_frontend(self, content: str, file_path: str):
        soup = BeautifulSoup(content, 'html.parser')
        
        # SEO: Title
        if not soup.title:
            self.issues.append(AuditIssue(
                "SEO", "High", "Missing Title Tag",
                f"No <title> tag found in {file_path}.",
                "Add a descriptive <title> tag for search engines.",
                file_path
            ))
            
        # SEO: Meta Description
        if not soup.find("meta", attrs={"name": "description"}):
             self.issues.append(AuditIssue(
                "SEO", "Medium", "Missing Meta Description",
                f"Meta description is missing in {file_path}.",
                "Add a <meta name='description' content='...'> tag.",
                file_path
            ))

        # Accessibility: Alt tags
        for img in soup.find_all("img"):
            if not img.get("alt"):
                self.issues.append(AuditIssue(
                    "Frontend", "Medium", "Missing Alt Attribute",
                    f"An <img> tag in {file_path} is missing an alt attribute.",
                    "Add descriptive alt text to all images.",
                    file_path
                ))

    def _audit_backend_code(self, content: str, file_path: str, ext: str):
        if ext == '.c' and 'gets(' in content:
            self.issues.append(AuditIssue(
                "Security", "High", "Unsafe gets() Function",
                "The gets() function is highly vulnerable to buffer overflows.",
                "Use fgets() instead for safer input handling.",
                file_path
            ))
        
        if ext == '.py' and 'except:' in content:
             self.issues.append(AuditIssue(
                "Backend", "Low", "Bare Except Clause",
                "Using 'except:' without a specific exception type can hide bugs.",
                "Catch specific exceptions instead (e.g., except ValueError:).",
                file_path
            ))
