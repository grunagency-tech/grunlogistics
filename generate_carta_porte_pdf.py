import sys
import os
import subprocess

def create_carta_porte_pdf(output_filename="Carta_Porte_SAT_3.1_5831.pdf"):
    html_content = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Representación Impresa Carta Porte 3.1 SAT</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; margin: 0; padding: 25px; font-size: 11px; background: #fff; }
        .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start; }
        .company-title { font-size: 18px; font-weight: bold; color: #0f172a; letter-spacing: -0.5px; }
        .company-sub { font-size: 9px; color: #64748b; margin-top: 2px; }
        .sat-badge { background: #064e3b; color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 10px; display: inline-block; }
        .section-title { font-size: 10px; font-weight: bold; color: #047857; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-top: 15px; margin-bottom: 8px; }
        .grid-2 { display: table; width: 100%; table-layout: fixed; margin-bottom: 10px; }
        .col { display: table-cell; vertical-align: top; padding-right: 10px; }
        .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; margin-bottom: 8px; }
        .label { font-size: 8px; color: #64748b; font-weight: bold; text-transform: uppercase; }
        .value { font-size: 10px; font-weight: bold; color: #0f172a; margin-top: 2px; }
        .mono { font-family: monospace; }
        table.data-table { width: 100%; border-collapse: collapse; margin-top: 5px; }
        table.data-table th { background: #f1f5f9; color: #475569; font-size: 8px; text-transform: uppercase; padding: 5px; text-align: left; border: 1px solid #cbd5e1; }
        table.data-table td { padding: 5px; border: 1px solid #cbd5e1; font-size: 9px; }
        .legal-notice { font-size: 7.5px; color: #64748b; border: 1px solid #cbd5e1; padding: 6px; border-radius: 4px; background: #fff; margin-top: 15px; line-height: 1.3; }
        .footer { margin-top: 20px; font-size: 8px; color: #94a3b8; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="company-title">LOGÍSTICA METROPOLITANA DE CARGA S.A. DE C.V.</div>
            <div class="company-sub">RFC: LME120418-9A3 · Autotransporte Federal de Carga General</div>
            <div class="company-sub">Permiso SCT: SCT-098231-MEX · Régimen Fiscal: 601 General de Ley Personas Morales</div>
        </div>
        <div style="text-align: right;">
            <span class="sat-badge">SAT COMPLEMENTO CARTA PORTE 3.1</span>
            <div style="font-size: 11px; font-weight: bold; margin-top: 5px;">Folio Viaje: TRIP #5831</div>
        </div>
    </div>

    <div class="box" style="background: #ecfdf5; border-color: #a7f3d0;">
        <div class="grid-2" style="margin-bottom: 0;">
            <div class="col">
                <div class="label">Folio Fiscal CFDI (UUID SAT):</div>
                <div class="value mono">4A8F92C1-3D9B-4E8A-9812-7A11928C10F9</div>
            </div>
            <div class="col">
                <div class="label">Póliza de Seguro de Carga Activa:</div>
                <div class="value">Qualitas Cia de Seguros · Pol: POL-99281-MEX ($2,500,000 MXN)</div>
            </div>
        </div>
    </div>

    <div class="section-title">1. UBICACIONES Y RUTA OPERATIVA (ORIGEN Y DESTINO)</div>
    <div class="grid-2">
        <div class="col">
            <div class="box">
                <div class="label">Origen (Remitente):</div>
                <div class="value">TechLogistics Corp - CEDIS Apodaca, NL</div>
                <div style="font-size: 8.5px; color: #475569; margin-top: 3px;">Av. Industrial 402, Apodaca, N.L. CP 66600</div>
                <div class="label" style="margin-top: 5px;">Fecha y Hora Salida:</div>
                <div class="value">2026-09-20 06:15 hrs</div>
            </div>
        </div>
        <div class="col">
            <div class="box">
                <div class="label">Destino (Destinatario):</div>
                <div class="value">CEDIS Vallejo / Norte, CDMX</div>
                <div style="font-size: 8.5px; color: #475569; margin-top: 3px;">Calz. Vallejo 1820, Gustavo A. Madero, CDMX. CP 07700</div>
                <div class="label" style="margin-top: 5px;">Cita Estimada Entrega:</div>
                <div class="value">2026-09-20 18:00 hrs</div>
            </div>
        </div>
    </div>

    <div class="section-title">2. MERCANCÍAS Y BIENES TRANSPORTADOS (CATÁLOGO SAT)</div>
    <table class="data-table">
        <thead>
            <tr>
                <th>Clave Prod/Serv SAT</th>
                <th>Descripción de Carga</th>
                <th>Cantidad</th>
                <th>Clave Unidad</th>
                <th>Peso en KG</th>
                <th>Material Peligroso</th>
                <th>Fracción Arancelaria</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="mono font-bold">24101600</td>
                <td>Componentes Electrónicos de Alta Prioridad</td>
                <td>1,420 Cajas</td>
                <td>KGM</td>
                <td class="font-bold">18,500.00 kg</td>
                <td>No</td>
                <td class="mono">8542.31.01</td>
            </tr>
        </tbody>
    </table>

    <div class="section-title">3. AUTOTRANSPORTE FEDERAL Y OPERADOR ASIGNADO</div>
    <div class="grid-2">
        <div class="col">
            <div class="box">
                <div class="label">Vehículo de Carga (Tractor):</div>
                <div class="value">Unit #184 · Freightliner Cascadia 2022</div>
                <div style="font-size: 8.5px; color: #475569; margin-top: 2px;">Placas: 88-AF-3X · Configuración Vehicular: T3S2</div>
                <div style="font-size: 8.5px; color: #475569; margin-top: 2px;">Remolque: TR-5301 (Placas 12-TY-9U)</div>
            </div>
        </div>
        <div class="col">
            <div class="box">
                <div class="label">Operador / Chófer Certificado:</div>
                <div class="value">Roberto Gómez</div>
                <div style="font-size: 8.5px; color: #475569; margin-top: 2px;">RFC: GOCR840211-HN2 · Licencia Federal: LIC-FED-88291</div>
                <div style="font-size: 8.5px; color: #475569; margin-top: 2px;">Vigencia Licencia: 2028-11-15 (Tipo B Carga General)</div>
            </div>
        </div>
    </div>

    <div class="legal-notice">
        <strong>Representación Impresa Digital Carta Porte 3.1:</strong> Este documento ampara el transporte legal de mercancías en territorio nacional conforme al artículo 29 del Código Fiscal de la Federación y las Reglas de la Miscelánea Fiscal vigentes publicadas por el SAT. Válido para inspección ante la Guardia Nacional División Carreteras y la Secretaría de Infraestructura, Comunicaciones y Transportes (SICT).
    </div>

    <div class="footer">
        GRUNLOGISTICS Operations Intelligence Platform · Generado automáticamente el 2026-09-28 · Autotransporte Federal Certificado
    </div>
</body>
</html>
"""
    html_file = "carta_porte_temp.html"
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    cmd = f"libreoffice --headless --convert-to pdf {html_file} --outdir public/"
    subprocess.run(cmd, shell=True, check=True)
    
    generated_pdf = os.path.join("public", "carta_porte_temp.pdf")
    target_pdf = os.path.join("public", output_filename)
    if os.path.exists(generated_pdf):
        os.rename(generated_pdf, target_pdf)
        print(f"Generated {target_pdf} successfully!")
    if os.path.exists(html_file):
        os.remove(html_file)

if __name__ == "__main__":
    create_carta_porte_pdf()
