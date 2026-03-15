import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalculadoraService } from '../../core/services/calculadora.service';

@Component({
  selector: 'app-calculadora',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="calc-wrap">

      <div class="calc-header">
        <div>
          <h2>🧮 Calculadora de Horas</h2>
          <p>Calcula horas academicas segun creditos, modalidad y nivel</p>
        </div>
      </div>

      <div class="calc-body">

        <div class="form-card">
          <h3>⚙️ Parametros</h3>

          <div class="field-row">
            <div class="field">
              <label>Nombre de la asignatura</label>
              <input type="text" [(ngModel)]="nombre" placeholder="Ej. Calculo I" />
            </div>
          </div>

          <div class="field-row three">
            <div class="field">
              <label>Creditos (CR)</label>
              <input type="number" [(ngModel)]="creditos" min="1" max="10" placeholder="4" />
            </div>
            <div class="field">
              <label>Horas Teoricas</label>
              <input type="number" [(ngModel)]="horasT" min="0" max="10" placeholder="4" />
            </div>
            <div class="field">
              <label>Horas Practicas</label>
              <input type="number" [(ngModel)]="horasP" min="0" max="10" placeholder="2" />
            </div>
          </div>

          <div class="field-row two">
            <div class="field">
              <label>Modalidad</label>
              <div class="select-wrap">
                <select [(ngModel)]="modalidad">
                  <option value="presencial">Presencial</option>
                  <option value="semipresencial">Semipresencial</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>Nivel Academico</label>
              <div class="select-wrap">
                <select [(ngModel)]="nivel">
                  <option value="tecnico">Tecnico (60-120 CR)</option>
                  <option value="grado">Grado (120-200 CR)</option>
                  <option value="postgrado">Postgrado (30-80 CR)</option>
                </select>
              </div>
            </div>
          </div>

          <button class="btn-calc" (click)="calcular()">
            🧮 Calcular Horas
          </button>
        </div>

        @if (resultado) {
          <div class="resultado-card" [class.show]="resultado">
            <div class="res-header">
              <h3>📊 Resultado: <em>{{ nombre || 'Asignatura' }}</em></h3>
              <span class="modal-badge" [class]="modalidad">{{ modalidad }}</span>
            </div>

            <div class="res-grid">
              <div class="ri">
                <span class="rv">{{ resultado.HT }}</span>
                <span class="rl">Horas Teoricas</span>
                <span class="rf">Presencial</span>
              </div>
              <div class="ri">
                <span class="rv">{{ resultado.HP }}</span>
                <span class="rl">Horas Practicas</span>
                <span class="rf">Presencial</span>
              </div>
              <div class="ri virt" [class.dim]="modalidad==='presencial'">
                <span class="rv">{{ resultado.HIV }}</span>
                <span class="rl">Horas Ind. Virtual</span>
                <span class="rf">Virtual/Semi</span>
              </div>
              <div class="ri virt" [class.dim]="modalidad!=='virtual'">
                <span class="rv">{{ resultado.HPV }}</span>
                <span class="rl">Horas Prac. Virtual</span>
                <span class="rf">Solo Virtual</span>
              </div>
              <div class="ri virt" [class.dim]="modalidad==='presencial'">
                <span class="rv">{{ resultado.HI }}</span>
                <span class="rl">Horas Investigacion</span>
                <span class="rf">Virtual/Semi</span>
              </div>
              <div class="ri total">
                <span class="rv big">{{ resultado.total }}</span>
                <span class="rl">TOTAL HORAS</span>
              </div>
            </div>

            <div class="formula-box">
              <div class="formula-title">📐 Formula aplicada — Modalidad {{ modalidad }}</div>
              @if (modalidad === 'presencial') {
                <div class="formula-items">
                  <span>HT = {{ horasT }} × 15 = <strong>{{ resultado.HT }}</strong></span>
                  <span>HP = {{ horasP }} × 30 = <strong>{{ resultado.HP }}</strong></span>
                  <span>Total = HT + HP = <strong>{{ resultado.total }}</strong></span>
                </div>
              }
              @if (modalidad === 'semipresencial') {
                <div class="formula-items">
                  <span>HT  = {{ horasT }} × 15 = <strong>{{ resultado.HT }}</strong></span>
                  <span>HP  = {{ horasP }} × 30 = <strong>{{ resultado.HP }}</strong></span>
                  <span>HIV = {{ creditos }} × 15 × 0.5 = <strong>{{ resultado.HIV }}</strong></span>
                  <span>HI  = {{ creditos }} × 45 × 0.3 = <strong>{{ resultado.HI }}</strong></span>
                  <span>Total = <strong>{{ resultado.total }}</strong></span>
                </div>
              }
              @if (modalidad === 'virtual') {
                <div class="formula-items">
                  <span>HIV = {{ creditos }} × 15 = <strong>{{ resultado.HIV }}</strong></span>
                  <span>HPV = {{ creditos }} × 30 = <strong>{{ resultado.HPV }}</strong></span>
                  <span>HI  = {{ creditos }} × 45 = <strong>{{ resultado.HI }}</strong></span>
                  <span>Total = <strong>{{ resultado.total }}</strong></span>
                </div>
              }
            </div>
          </div>
        }

        <div class="ref-card">
          <h3>📖 Referencia de Formulas UASD</h3>
          <table class="ref-tbl">
            <thead>
              <tr>
                <th>Modalidad</th>
                <th>HT</th>
                <th>HP</th>
                <th>HIV</th>
                <th>HPV</th>
                <th>HI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="mbadge pres">Presencial</span></td>
                <td>HT × 15</td>
                <td>HP × 30</td>
                <td class="dim">0</td>
                <td class="dim">0</td>
                <td class="dim">0</td>
              </tr>
              <tr>
                <td><span class="mbadge semi">Semipresencial</span></td>
                <td>HT × 15</td>
                <td>HP × 30</td>
                <td>CR × 15 × 0.5</td>
                <td class="dim">0</td>
                <td>CR × 45 × 0.3</td>
              </tr>
              <tr>
                <td><span class="mbadge virt">Virtual</span></td>
                <td class="dim">0</td>
                <td class="dim">0</td>
                <td>CR × 15</td>
                <td>CR × 30</td>
                <td>CR × 45</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .calc-wrap { max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem; }

    .calc-header {
      background: linear-gradient(135deg, #1a365d, #2b6cb0);
      border-radius: 14px; padding: 1.5rem 2rem;
      color: white; margin-bottom: 1.5rem;
    }
    .calc-header h2 { margin: 0; font-size: 1.35rem; }
    .calc-header p  { margin: 4px 0 0; opacity: 0.8; font-size: 0.85rem; }

    .calc-body { display: flex; flex-direction: column; gap: 1.2rem; }

    .form-card { background: white; border-radius: 14px; padding: 1.8rem; box-shadow: 0 3px 15px rgba(0,0,0,0.08); }
    .form-card h3 { margin: 0 0 1.3rem; color: #1a365d; font-size: 1rem; }

    .field-row { display: flex; gap: 1rem; margin-bottom: 1rem; }
    .field-row.three { }
    .field-row.two { }
    .field { display: flex; flex-direction: column; gap: 5px; flex: 1; }
    .field label { font-size: 0.78rem; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: 0.5px; }
    .field input, .field select {
      padding: 10px 13px; border: 2px solid #e2e8f0;
      border-radius: 9px; font-size: 0.92rem; outline: none;
      transition: border-color 0.2s; background: #f8fafc;
    }
    .field input:focus, .field select:focus { border-color: #3182ce; background: white; }
    .select-wrap { position: relative; }
    .select-wrap select { width: 100%; appearance: none; cursor: pointer; }

    .btn-calc {
      width: 100%; padding: 13px; background: linear-gradient(135deg, #1a365d, #3182ce);
      color: white; border: none; border-radius: 11px; font-size: 1rem; font-weight: 800;
      cursor: pointer; transition: all 0.2s; margin-top: 0.5rem;
      box-shadow: 0 4px 15px rgba(49,130,206,0.35);
    }
    .btn-calc:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(49,130,206,0.5); }

    .resultado-card {
      background: white; border-radius: 14px; padding: 1.8rem;
      box-shadow: 0 3px 15px rgba(0,0,0,0.08);
      border-top: 4px solid #3182ce;
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    .res-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.3rem; flex-wrap: wrap; gap: 0.5rem; }
    .res-header h3 { margin: 0; color: #1a365d; font-size: 1rem; }
    .res-header em { color: #3182ce; font-style: normal; }
    .modal-badge { padding: 4px 12px; border-radius: 10px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
    .modal-badge.presencial     { background: #dcfce7; color: #166534; }
    .modal-badge.semipresencial { background: #fef9c3; color: #854d0e; }
    .modal-badge.virtual        { background: #dbeafe; color: #1d4ed8; }

    .res-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 1.2rem; }
    .ri { background: #f8fafc; border-radius: 10px; padding: 1rem; text-align: center; }
    .ri.virt  { background: #eff6ff; }
    .ri.total { background: linear-gradient(135deg, #1a365d, #2b6cb0); grid-column: span 3; }
    .ri.dim   { opacity: 0.4; }
    .rv { display: block; font-size: 1.6rem; font-weight: 900; color: #2b6cb0; }
    .rv.big { font-size: 2rem; color: white; }
    .rl { display: block; font-size: 0.7rem; color: #64748b; text-transform: uppercase; margin-top: 2px; }
    .ri.total .rl { color: rgba(255,255,255,0.7); }
    .rf { display: block; font-size: 0.62rem; color: #94a3b8; margin-top: 1px; }

    .formula-box { background: #1e293b; border-radius: 10px; padding: 1.2rem 1.5rem; }
    .formula-title { font-size: 0.78rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.7rem; font-weight: 700; }
    .formula-items { display: flex; flex-wrap: wrap; gap: 10px; }
    .formula-items span { background: rgba(255,255,255,0.07); color: #e2e8f0; padding: 5px 12px; border-radius: 7px; font-size: 0.82rem; font-family: monospace; }
    .formula-items strong { color: #63b3ed; }

    .ref-card { background: white; border-radius: 14px; padding: 1.8rem; box-shadow: 0 3px 15px rgba(0,0,0,0.08); }
    .ref-card h3 { margin: 0 0 1.1rem; color: #1a365d; font-size: 1rem; }
    .ref-tbl { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
    .ref-tbl th { background: #f1f5f9; padding: 9px 12px; text-align: left; border-bottom: 2px solid #e2e8f0; font-size: 0.72rem; text-transform: uppercase; color: #64748b; }
    .ref-tbl td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
    .ref-tbl td.dim { color: #cbd5e1; }
    .mbadge { padding: 3px 10px; border-radius: 8px; font-size: 0.72rem; font-weight: 700; }
    .mbadge.pres { background: #dcfce7; color: #166534; }
    .mbadge.semi { background: #fef9c3; color: #854d0e; }
    .mbadge.virt { background: #dbeafe; color: #1d4ed8; }

    @media(max-width:600px) {
      .field-row { flex-direction: column; }
      .res-grid { grid-template-columns: repeat(2,1fr); }
      .ri.total { grid-column: span 2; }
    }
  `]
})
export class CalculadoraComponent {
  nombre   = '';
  creditos = 4;
  horasT   = 4;
  horasP   = 0;
  modalidad: any = 'presencial';
  nivel: any    = 'grado';
  resultado: any = null;

  constructor(private calc: CalculadoraService) {}

  calcular() {
    const asig: any = {
      clave: 'CALC', nombre: this.nombre || 'Asignatura',
      horasTeoricas: Number(this.horasT),
      horasPracticas: Number(this.horasP),
      creditos: Number(this.creditos),
      prerequisitos: [], equivalencias: []
    };
    this.resultado = this.calc.calcularHorasAsignatura(asig, this.modalidad);
  }
}
