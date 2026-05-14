import click
import os
import requests
import webbrowser
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.progress import Progress
from .engine import AuditEngine

console = Console()
API_BASE_URL = "http://localhost:3000/api/report"
WEB_BASE_URL = "http://localhost:3000/report"

@click.command()
@click.argument('path', default='.', type=click.Path(exists=True))
def cli(path):
    """🚀 SB Detector: Professional Full-Stack Project Auditor"""
    
    console.print(Panel.fit(
        "[bold white]SB Detector CLI[/bold white]\n[dim]Analyzing project health...[/dim]",
        border_style="blue"
    ))

    root_path = os.path.abspath(path)
    engine = AuditEngine(root_path)

    with Progress() as progress:
        task = progress.add_task("[cyan]Scanning project files...", total=None)
        issues = engine.run()
        progress.update(task, completed=100)

    if not issues:
        console.print("\n[bold green]✨ No issues found! Your project is in excellent shape.[/bold green]")
        return

    # Summary Table
    table = Table(title="\n[bold]Audit Summary[/bold]", show_header=True, header_style="bold magenta")
    table.add_column("Category", style="cyan")
    table.add_column("Severity", style="bold")
    table.add_column("Issue", style="white")
    table.add_column("File", style="dim")

    for issue in issues:
        severity_style = "red" if issue.severity == "High" else "yellow" if issue.severity == "Medium" else "blue"
        table.add_row(
            issue.category,
            f"[{severity_style}]{issue.severity}[/{severity_style}]",
            issue.title,
            issue.file or "N/A"
        )

    console.print(table)

    # Detailed Feedback
    console.print("\n[bold]🔍 Detailed Feedback:[/bold]")
    for i, issue in enumerate(issues, 1):
        color = "red" if issue.severity == "High" else "yellow" if issue.severity == "Medium" else "blue"
        
        console.print(f"\n[bold {color}]{i}. {issue.title}[/bold {color}]")
        console.print(f"   [dim]Location:[/dim] {issue.file or 'Global'}")
        console.print(f"   [dim]Description:[/dim] {issue.description}")
        console.print(f"   [bold green]💡 Recommendation:[/bold green] {issue.recommendation}")

    console.print(f"\n[bold blue]Done![/bold blue] Found [bold]{len(issues)}[/bold] items that need attention.\n")

    # Upload and Open Browser
    if click.confirm("Do you want to view the full interactive report in your browser?", default=True):
        try:
            with console.status("[bold green]Uploading report..."):
                # Prepare data for API
                # Calculate simple stats for the web view
                stats = {"frontend": 100, "backend": 100, "seo": 100, "security": 100}
                for issue in issues:
                    penalty = 20 if issue.severity == "High" else 10 if issue.severity == "Medium" else 5
                    cat = issue.category.lower()
                    if cat in stats:
                        stats[cat] -= penalty
                        if stats[cat] < 0: stats[cat] = 0
                
                score = sum(stats.values()) // 4
                
                payload = {
                    "score": score,
                    "stats": stats,
                    "issues": [
                        {
                            "category": i.category,
                            "severity": i.severity,
                            "title": i.title,
                            "description": i.description,
                            "recommendation": i.recommendation,
                            "file": i.file
                        } for i in issues
                    ]
                }
                
                response = requests.post(API_BASE_URL, json=payload)
                response.raise_for_status()
                report_id = response.json().get("reportId")
                
                report_url = f"{WEB_BASE_URL}/{report_id}"
                console.print(f"[bold green]✔ Report uploaded successfully![/bold green]")
                console.print(f"🔗 [link={report_url}]{report_url}[/link]")
                
                webbrowser.open(report_url)
        except Exception as e:
            console.print(f"[bold red]✘ Failed to upload report:[/bold red] {str(e)}")
            console.print("[dim]Make sure the AuditPulse web server is running at http://localhost:3000[/dim]")

if __name__ == "__main__":
    cli()
