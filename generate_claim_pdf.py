import os
import sys
import subprocess

def generate_claim_pdf(case_code="REC-5831-01", trip_number="5831", customer_name="TechLogistics Corp (Customer A)", amount="1,500"):
    html_path = f"/var/home/carlos_un/unlogistics/Carta_Reclamacion_{case_code}.html"
    pdf_name = f"Carta_Reclamacion_Estadia_{trip_number}.pdf"
    pdf_path = f"/var/home/carlos_un/unlogistics/{pdf_name}"

    html_content = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Carta de Reclamación de Estadía — {case_code}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
  @page {{ size: letter; margin: 20mm; }}
  body {{ font-family: 'Inter', sans-serif; color: #0f172a; font-size: 11pt; line-height: 1.5; }}
  .header {{ border-bottom: 2px solid #047857; padding-bottom: 12px; margin-bottom: 20px; }}
  .company-title {{ font-size: 18pt; font-weight: 800; color: #047857; }}
  .doc-type {{ font-size: 10pt; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }}
  .meta-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px; }}
  .meta-item {{ font-size: 10pt; }}
  .meta-label {{ text-transform: uppercase; font-size: 8pt; font-weight: 700; color: #64748b; display: block; }}
  .meta-value {{ font-weight: 700; color: #0f172a; font-family: 'JetBrains Mono', monospace; }}
  .amount-box {{ background: #ecfdf5; border: 1px solid #a7f3d0; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px; }}
  .amount-val {{ font-size: 22pt; font-weight: 800; color: #065f46; font-family: 'JetBrains Mono', monospace; }}
  table {{ width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 10pt; }}
  th {{ background: #0f172a; color: white; padding: 8px 10px; text-align: left; }}
  td {{ padding: 8px 10px; border: 1px solid #cbd5e1; }}
  .footer {{ margin-top: 40px; border-top: 1px solid #e2e8f0; pt: 15px; font-size: 9pt; color: #64748b; text-align: center; }}
</style>
</head>
<body>
  <div class="header">
    <div class="doc-type">COMPROBANTE OFICIAL DE RECLAMACIÓN Y FACTURACIÓN DE ESTADÍA</div>
    <div class="company-title">LOGÍSTICA METROPOLITANA MX S.A. DE C.V.</div>
    <div style="font-size: 9pt; color: #64748b;">RFC: LME120418-9A3 · Autotransporte Federal de Carga</div>
  </div>

  <div class="meta-grid">
    <div class="meta-item"><span class="meta-label">FOLIO DE RECLAMACIÓN</span><span class="meta-value">{case_code}</span></div>
    <div class="meta-item"><span class="meta-label">NÚMERO DE VIAJE</span><span class="meta-value">TRIP #{trip_number}</span></div>
    <div class="meta-item"><span class="meta-label">CLIENTE DEUDOR</span><span class="meta-value">{customer_name}</span></div>
    <div class="meta-item"><span class="meta-label">FECHA DE EMISIÓN</span><span class="meta-value">2026-09-20</span></div>
  </div>

  <div class="amount-box">
    <span class="meta-label">MONTO TOTAL A COBRAR POR CONCEPTO DE ESTADÍA EN RAMPA</span>
    <div class="amount-val">${amount} MXN</div>
  </div>

  <h3>DESGLOSE DE TIEMPOS Y EVIDENCIA DE GPS EN RAMPA</h3>
  <table>
    <thead>
      <tr>
        <th>Concepto / Evento</th>
        <th>Estampa de Tiempo (Timestamp)</th>
        <th>Estatus / Registro GPS</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Arribo de Unidad a Caseta CEDIS Norte</td><td>2026-09-20 14:32 hrs</td><td>Registrado por Wialon GPS (Lat: 19.498, Lng: -99.162)</td></tr>
      <tr><td>Asignación e Inicio de Descarga en Rampa</td><td>2026-09-20 16:46 hrs</td><td>Foto de sello tomada por operador Roberto Gómez</td></tr>
      <tr><td>Tiempo Total Transcurrido en Espera</td><td>134 Minutos</td><td>Saturación comprobada de andenes</td></tr>
      <tr><td>Tiempo Libre Contratado (Franquicia)</td><td>30 Minutos libres</td><td>Según contrato vigente de flete</td></tr>
      <tr><td><strong>TIEMPO EXCEDENTE COBRABLE</strong></td><td><strong>104 Minutos excedentes</strong></td><td><strong>Tarifa pactada: $600 MXN / Hora adicional</strong></td></tr>
    </tbody>
  </table>

  <p><strong>Fundamento de Reclamación:</strong> Por medio del presente comprobante se notifica formalmente el cobro del tiempo de estadía en rampa excedente generado en las instalaciones del cliente durante el viaje #{trip_number}. Los registros satelitales y fotográficos adjuntos sirven como prueba suficiente de la permanencia de la unidad en sus instalaciones.</p>

  <div class="footer">
    Logística Metropolitana de Carga S.A. de C.V. · Departamento de Facturación y Cobranza de Estadías<br>
    Documento autogenerado por la plataforma GRUNLOGISTICS.
  </div>
</body>
</html>"""

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    subprocess.run(["libreoffice", "--headless", "--convert-to", "pdf", "--outdir", "/var/home/carlos_un/unlogistics", html_path], capture_output=True)
    out_pdf = f"/var/home/carlos_un/unlogistics/Carta_Reclamacion_{case_code}.pdf"
    if os.path.exists(out_pdf):
        os.rename(out_pdf, pdf_path)
        print("Claim PDF created:", pdf_path)

if __name__ == "__main__":
    generate_claim_pdf()
