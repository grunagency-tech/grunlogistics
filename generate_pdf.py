import os
import subprocess

readme_path = "/var/home/carlos_un/unlogistics/README.md"
html_path = "/var/home/carlos_un/unlogistics/GRUNLOGISTICS_Documento.html"
pdf_path = "/var/home/carlos_un/unlogistics/GRUNLOGISTICS_Documento_y_Propuesta.pdf"
artifact_pdf_path = "/var/home/carlos_un/.gemini/antigravity-cli/brain/f60ebe78-4f1e-462a-964f-72149eaa6c2d/GRUNLOGISTICS_Documento_y_Propuesta.pdf"

with open(readme_path, "r", encoding="utf-8") as f:
    md_content = f.read()

# Simple markdown to styled HTML converter
try:
    import markdown
    body_html = markdown.markdown(md_content, extensions=['tables', 'fenced_code'])
except ImportError:
    # Basic fallback converter
    body_html = md_content.replace("\n", "<br>")

styled_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>GRUNLOGISTICS — Documentación & Propuesta de Valor</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
  
  @page {{
    size: letter;
    margin: 18mm 18mm 18mm 18mm;
  }}

  body {{
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #0f172a;
    line-height: 1.6;
    font-size: 11pt;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
  }}

  h1 {{
    font-size: 22pt;
    font-weight: 800;
    color: #047857;
    border-bottom: 2px solid #10b981;
    padding-bottom: 8px;
    margin-top: 0;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
  }}

  h2 {{
    font-size: 15pt;
    font-weight: 700;
    color: #0f172a;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 6px;
    margin-top: 24px;
    margin-bottom: 12px;
    page-break-after: avoid;
  }}

  h3 {{
    font-size: 12pt;
    font-weight: 700;
    color: #047857;
    margin-top: 18px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }}

  h4 {{
    font-size: 11pt;
    font-weight: 600;
    color: #1e293b;
    margin-top: 14px;
    margin-bottom: 6px;
  }}

  blockquote {{
    background-color: #ecfdf5;
    border-left: 4px solid #10b981;
    margin: 12px 0;
    padding: 10px 16px;
    font-weight: 500;
    color: #065f46;
    border-radius: 0 8px 8px 0;
  }}

  p {{
    margin-top: 0;
    margin-bottom: 10px;
    text-align: justify;
  }}

  ul, ol {{
    margin-top: 0;
    margin-bottom: 12px;
    padding-left: 20px;
  }}

  li {{
    margin-bottom: 4px;
  }}

  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }}

  th {{
    background-color: #0f172a;
    color: #ffffff;
    font-weight: 600;
    text-align: left;
    padding: 8px 10px;
    border: 1px solid #0f172a;
  }}

  td {{
    padding: 8px 10px;
    border: 1px solid #cbd5e1;
  }}

  tr:nth-child(even) {{
    background-color: #f8fafc;
  }}

  code {{
    font-family: 'JetBrains Mono', monospace;
    background-color: #f1f5f9;
    color: #0f172a;
    padding: 2px 5px;
    border-radius: 4px;
    font-size: 9.5pt;
  }}

  pre {{
    background-color: #0f172a;
    color: #f8fafc;
    padding: 12px;
    border-radius: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9pt;
    overflow-x: auto;
    page-break-inside: avoid;
  }}

  hr {{
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 20px 0;
  }}

  strong {{
    color: #0f172a;
  }}
</style>
</head>
<body>
{body_html}
</body>
</html>
"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(styled_html)

print("HTML created. Converting to PDF using LibreOffice...")
cmd = ["libreoffice", "--headless", "--convert-to", "pdf", "--outdir", "/var/home/carlos_un/unlogistics", html_path]
res = subprocess.run(cmd, capture_output=True, text=True)
print(res.stdout)

# Copy output to final named PDF
generated_pdf = "/var/home/carlos_un/unlogistics/GRUNLOGISTICS_Documento.pdf"
if os.path.exists(generated_pdf):
    os.rename(generated_pdf, pdf_path)
    subprocess.run(["cp", pdf_path, artifact_pdf_path])
    print("SUCCESS: PDF created at", pdf_path)
else:
    print("PDF generation failed:", res.stderr)
