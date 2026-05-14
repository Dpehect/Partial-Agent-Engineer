from setuptools import setup, find_packages

setup(
    name="audit-pulse",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "rich",
        "beautifulsoup4",
        "requests",
        "click",
    ],
    entry_points={
        "console_scripts": [
            "audit-pulse=audit_pulse.main:cli",
        ],
    },
    author="Antigravity",
    description="A professional full-stack project auditor CLI.",
    python_requires=">=3.7",
)
