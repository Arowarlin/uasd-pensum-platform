import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalculadoraService } from '../../core/services/calculadora.service';
import { Modalidad, NivelAcademico, Asignatura, Semestre, Carrera } from '../../core/models/pensum.models';

interface FilaAsig {
  clave: string; nombre: string; creditos: number;
  horasTeoricas: number; horasPracticas: number; semestre: number;
}

@Component({
  selector: 'app-calculadora',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="cab">
        <h2>🧮 Calculadora de Horas y Créditos</h2>
        <p>Ingresa asignaturas o carga CSV · Calcula HT · HP · HIV · HPV · HI por modalidad</p>
      </div>

      <div class="config">
        <div class="cg">
          <label>Modalidad</label>
          <select [(ngModel)]="modalidad" (change)="calcularTodo()">
            <option value="presencial">Presencial</option>
            <option value="semipresencial">Semipresencial</option>
            <option value="virtual">Virtual</option>
          </select>
        </div>
        <div class="cg">
          <label>Nivel Académico</label>
          <select [(ngModel)]="nivel" (change)="calcularTodo()">
            <option value="tecnico">Técnico Superior</option>
            <option value="grado">Grado (Licenciatura)</option>
            <option value="postgrado">Postgrado</option>
          </select>
        </div>
        <div class="cg cg-wide">
          <label>Nombre de la Carrera</label>
          <input type="text" [(ngModel)]="nombreCarrera" placeholder="Ej. Licenciatura en Informática">
        </div>
      </div>

      <div class="info-cr">
        <strong>📐 1 Crédito =</strong>
        <span>15 HT presenciales</span>
        <span>30 HP presenciales</span>
        <span class="v">15 HIV virtuales</span>
        <span class="v">30 HPV virtuales</span>
        <span class="v">45 HI investigación</span>
      </div>

      <div class="tabs">
        <button [class.act]="tab==='manual'"    (click)="tab='manual'">✏️ Manual</button>
        <button [class.act]="tab==='excel'"     (click)="tab='excel'">📂 CSV/Excel</button>
        <button [class.act]="tab==='resultado'" (click)="tab='resultado'"
                [disabled]="filas.length===0">📊 Resultados ({{ filas.length }})</button>
      </div>

      @if (tab === 'manual') {
        <div class="panel">
          <h3>Agregar Asignatura</h3>
          <div class="fgrid">
            <div class="fg">
              <label>Clave</label>
              <input [(ngModel)]="nva.clave" placeholder="INF5100" maxlength="10">
            </div>
            <div class="fg fg2">
              <label>Nombre de la Asignatura</label>
              <input [(ngModel)]="nva.nombre" placeholder="Introducción a la Programación">
            </div>
            <div class="fg">
              <label>Créditos (CR)</label>
              <input type="number" [(ngModel)]="nva.creditos" min="1" max="10" (input)="autoCalc()">
            </div>
            <div class="fg">
              <label>HT Teóricas</label>
              <input type="number" [(ngModel)]="nva.horasTeoricas" min="0">
            </div>
            <div class="fg">
              <label>HP Prácticas</label>
              <input type="number" [(ngModel)]="nva.horasPracticas" min="0">
            </div>
            <div class="fg">
              <label>Semestre #</label>
              <input type="number" [(ngModel)]="nva.semestre" min="1" max="12">
            </div>
          </div>
          <div class="facciones">
            <button class="btn-calc" (click)="autoCalc()">🔄 Auto-calcular</button>
            <button class="btn-add"  (click)="agregar()">+ Agregar</button>
          </div>

          @if (nva.creditos > 0) {
            <div class="preview">
              <strong>Preview — {{ nva.creditos }} CR en modalidad {{ modalidad }}:</strong>
              <div class="prev-items">
                <span>HT: {{ calcService.calcularDesdeCredito(nva.creditos, modalidad).HT }}</span>
                <span>HP: {{ calcService.calcularDesdeCredito(nva.creditos, modalidad).HP }}</span>
                @if (modalidad !== 'presencial') {
                  <span class="v">HIV: {{ calcService.calcularDesdeCredito(nva.creditos, modalidad).HIV }}</span>
                  @if (modalidad === 'virtual') {
                    <span class="v">HPV: {{ calcService.calcularDesdeCredito(nva.creditos, modalidad).HPV }}</span>
                  }
                  <span class="v">HI: {{ calcService.calcularDesdeCredito(nva.creditos, modalidad).HI }}</span>
                }
              </div>
            </div>
          }

          @if (filas.length > 0) {
            <div class="lista">
              <div class="lista-head">
                <h4>Asignaturas ({{ filas.length }})</h4>
                <button class="btn-del-all" (click)="limpiar()">🗑 Limpiar todo</button>
              </div>
              <table class="mini">
                <thead>
                  <tr>
                    <th>Sem</th><th>Clave</th><th>Asignatura</th>
                    <th>CR</th><th>HT</th><th>HP</th>
                    @if (modalidad !== 'presencial') {
                      <th class="v">HIV</th><th class="v">HI</th>
                    }
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  @for (f of filas; track f.clave; let i = $index) {
                    <tr>
                      <td>{{ f.semestre }}</td>
                      <td><code>{{ f.clave }}</code></td>
                      <td>{{ f.nombre }}</td>
                      <td class="cn">{{ f.creditos }}</td>
                      <td class="cn">{{ f.horasTeoricas }}</td>
                      <td class="cn">{{ f.horasPracticas }}</td>
                      @if (modalidad !== 'presencial') {
                        <td class="cn v">{{ calcService.calcularDesdeCredito(f.creditos, modalidad).HIV }}</td>
                        <td class="cn v">{{ calcService.calcularDesdeCredito(f.creditos, modalidad).HI }}</td>
                      }
                      <td><button class="bdel" (click)="eliminar(i)">✕</button></td>
                    </tr>
                  }
                </tbody>
              </table>
              <button class="btn-result" (click)="calcularTodo(); tab='resultado'">
                Ver Resultados →
              </button>
            </div>
          }
        </div>
      }

      @if (tab === 'excel') {
        <div class="panel">
          <h3>📂 Cargar desde CSV o Excel</h3>
          <p class="hint">Formato de columnas: <code>clave, nombre, creditos, HT, HP, semestre</code></p>
          <div class="upload" (dragover)="$event.preventDefault()" (drop)="onDrop($event)">
            <div class="up-icon">📂</div>
            <p>Arrastra tu archivo aquí</p>
            <label class="btn-file">
              Seleccionar archivo .csv / .xlsx
              <input type="file" accept=".xlsx,.xls,.csv" (change)="onFile($event)" hidden>
            </label>
          </div>
          <div class="csv-box">
            <h4>O pega datos CSV directamente</h4>
            <p class="hint">Una asignatura por línea</p>
            <textarea [(ngModel)]="csvTexto" rows="8"
              placeholder="INF5100,Introducción a la Programación,4,4,0,2
INF5110,Lab de Int a la Programación,1,0,2,2
MAT0140,Matemática Básica,4,4,0,2"></textarea>
            <button class="btn-add" (click)="parsearCSV()">📥 Importar</button>
          </div>
        </div>
      }

      @if (tab === 'resultado' && resultado) {
        <div class="panel">
          <h3>📊 Resultados — {{ nombreCarrera || 'Carrera' }}</h3>
          <p class="rmeta">
            Modalidad: <strong>{{ modalidad }}</strong> &nbsp;|&nbsp;
            Nivel: <strong>{{ getLabelNivel() }}</strong> &nbsp;|&nbsp;
            Semestres: <strong>{{ resultado.semestres.length }}</strong>
          </p>

          <div class="vbox" [class.vok]="validRes?.valido" [class.verr]="!validRes?.valido">
            <strong>{{ validRes?.valido ? '✅ APROBADO' : '⚠️ OBSERVACIONES' }}</strong>
            <ul>
              @for (m of validRes?.mensajes; track m) { <li>{{ m }}</li> }
            </ul>
          </div>

          @for (sem of resultado.semestres; track sem.numero) {
            @if (sem.asignaturas.length > 0) {
              <div class="rsem">
                <div class="rsem-head">
                  <span>Semestre {{ sem.numero }}</span>
                  <span>
                    {{ sem.totalCreditos }} CR | {{ sem.totalHT }} HT | {{ sem.totalHP }} HP
                    @if (modalidad !== 'presencial') {
                      | {{ sem.totalHIV }} HIV | {{ sem.totalHI }} HI
                    }
                  </span>
                </div>
                <table class="mini">
                  <thead>
                    <tr>
                      <th>Clave</th><th>Asignatura</th><th>CR</th><th>HT</th><th>HP</th>
                      @if (modalidad !== 'presencial') {
                        <th class="v">HIV</th><th class="v">HPV</th><th class="v">HI</th>
                      }
                    </tr>
                  </thead>
                  <tbody>
                    @for (a of sem.asignaturas; track a.clave) {
                      <tr>
                        <td><code>{{ a.clave }}</code></td>
                        <td>{{ a.nombre }}</td>
                        <td class="cn">{{ a.creditos }}</td>
                        <td class="cn">{{ calcService.calcularHorasAsignatura(a, modalidad).HT }}</td>
                        <td class="cn">{{ calcService.calcularHorasAsignatura(a, modalidad).HP }}</td>
                        @if (modalidad !== 'presencial') {
                          <td class="cn v">{{ calcService.calcularHorasAsignatura(a, modalidad).HIV }}</td>
                          <td class="cn v">{{ calcService.calcularHorasAsignatura(a, modalidad).HPV }}</td>
                          <td class="cn v">{{ calcService.calcularHorasAsignatura(a, modalidad).HI }}</td>
                        }
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          }

          @if (totalesRes) {
            <div class="tfinal">
              <h4>Totales Finales de la Carrera</h4>
              <div class="tgrid">
                <div class="ti"><span class="tv">{{ totalesRes.CR }}</span><span class="tl">Créditos</span></div>
                <div class="ti"><span class="tv">{{ totalesRes.HT }}</span><span class="tl">HT Pres.</span></div>
                <div class="ti"><span class="tv">{{ totalesRes.HP }}</span><span class="tl">HP Pres.</span></div>
                <div class="ti v"><span class="tv">{{ totalesRes.HIV }}</span><span class="tl">HIV Virtual</span></div>
                <div class="ti v"><span class="tv">{{ totalesRes.HPV }}</span><span class="tl">HPV Virtual</span></div>
                <div class="ti v"><span class="tv">{{ totalesRes.HI }}</span><span class="tl">HI Invest.</span></div>
                <div class="ti pres"><span class="tv">{{ totalesRes.totalHorasPresenciales }}</span><span class="tl">Total Presencial</span></div>
                <div class="ti virt"><span class="tv">{{ totalesRes.totalHorasVirtuales }}</span><span class="tl">Total Virtual</span></div>
                <div class="ti big"><span class="tv">{{ totalesRes.totalGeneral }}</span><span class="tl">TOTAL GENERAL</span></div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width:1100px; margin:0 auto; padding:1.5rem; }
    .cab { text-align:center; margin-bottom:1.5rem; }
    .cab h2 { font-size:1.8rem; color:#1a365d; }
    .cab p { color:#718096; }

    .config { display:flex; gap:1rem; flex-wrap:wrap; background:white; padding:1.2rem; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.07); margin-bottom:1rem; }
    .cg { display:flex; flex-direction:column; gap:4px; flex:1; min-width:160px; }
    .cg-wide { flex:2; }
    .cg label { font-size:0.75rem; font-weight:600; color:#4a5568; text-transform:uppercase; }
    .cg select, .cg input { padding:8px 10px; border:1px solid #e2e8f0; border-radius:6px; font-size:0.9rem; }

    .info-cr { background:#ebf8ff; border:1px solid #bee3f8; padding:10px 16px; border-radius:8px; margin-bottom:1rem; display:flex; gap:8px; flex-wrap:wrap; align-items:center; font-size:0.83rem; }
    .info-cr span { background:white; padding:3px 10px; border-radius:12px; border:1px solid #bee3f8; }
    .info-cr .v { background:#e6fffa; border-color:#81e6d9; color:#276749; }

    .tabs { display:flex; gap:4px; margin-bottom:1rem; }
    .tabs button { padding:8px 18px; border:1px solid #e2e8f0; border-radius:8px; background:white; cursor:pointer; font-size:0.88rem; }
    .tabs button.act { background:#2b6cb0; color:white; border-color:#2b6cb0; }
    .tabs button:disabled { opacity:0.4; cursor:not-allowed; }

    .panel { background:white; border-radius:10px; padding:1.5rem; box-shadow:0 2px 8px rgba(0,0,0,0.07); }
    .panel h3 { margin:0 0 1.2rem; color:#1a365d; }
    .hint { color:#718096; font-size:0.83rem; margin-bottom:0.5rem; }

    .fgrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:12px; margin-bottom:1rem; }
    .fg { display:flex; flex-direction:column; gap:4px; }
    .fg2 { grid-column:span 2; }
    .fg label { font-size:0.75rem; font-weight:600; color:#4a5568; }
    .fg input { padding:8px; border:1px solid #e2e8f0; border-radius:6px; }
    .facciones { display:flex; gap:10px; margin-bottom:1rem; }
    .btn-calc { padding:8px 16px; background:#e2e8f0; border:none; border-radius:6px; cursor:pointer; }
    .btn-add  { padding:8px 20px; background:#276749; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:600; }
    .btn-result { margin-top:1rem; padding:10px 24px; background:#2b6cb0; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600; }
    .btn-del-all { background:none; border:1px solid #e53e3e; color:#e53e3e; padding:4px 12px; border-radius:6px; cursor:pointer; font-size:0.82rem; }
    .bdel { background:none; border:none; color:#e53e3e; cursor:pointer; font-size:1rem; }
    .btn-file { display:inline-block; padding:8px 20px; background:#2b6cb0; color:white; border-radius:6px; cursor:pointer; margin-top:0.5rem; }

    .preview { background:#f0fff4; border:1px solid #9ae6b4; padding:10px 14px; border-radius:8px; margin-bottom:1rem; font-size:0.86rem; }
    .prev-items { display:flex; gap:8px; margin-top:6px; flex-wrap:wrap; }
    .prev-items span { background:white; padding:3px 12px; border-radius:10px; font-weight:600; }
    .prev-items .v { color:#2b6cb0; }

    .lista { margin-top:1.5rem; }
    .lista-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; }
    .lista-head h4 { margin:0; }

    .mini { width:100%; border-collapse:collapse; font-size:0.84rem; }
    .mini th { background:#f7fafc; padding:7px 10px; text-align:left; border-bottom:2px solid #e2e8f0; font-size:0.73rem; text-transform:uppercase; color:#4a5568; }
    .mini td { padding:7px 10px; border-bottom:1px solid #f0f4f8; }
    .mini tr:hover td { background:#f7fafc; }
    .mini .v { color:#2b6cb0; }
    .cn { text-align:center; }
    code { background:#ebf8ff; color:#2b6cb0; padding:2px 5px; border-radius:3px; font-size:0.76rem; }

    .upload { border:2px dashed #bee3f8; border-radius:12px; padding:3rem; text-align:center; background:#f7faff; margin-bottom:1.5rem; }
    .up-icon { font-size:3rem; margin-bottom:0.5rem; }
    .csv-box { margin-top:1rem; }
    .csv-box h4 { margin-bottom:0.5rem; }
    .csv-box textarea { width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:8px; font-family:monospace; font-size:0.83rem; margin-bottom:0.5rem; resize:vertical; }

    .rmeta { color:#718096; font-size:0.86rem; margin-bottom:1rem; }
    .vbox { padding:1rem; border-radius:8px; margin-bottom:1.5rem; font-size:0.86rem; }
    .vbox.vok  { background:#f0fff4; border-left:4px solid #38a169; color:#276749; }
    .vbox.verr { background:#fff5f5; border-left:4px solid #e53e3e; color:#742a2a; }
    .vbox ul { margin:0.5rem 0 0 1.2rem; line-height:1.9; }

    .rsem { margin-bottom:1.5rem; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; }
    .rsem-head { background:#f7fafc; padding:8px 14px; display:flex; justify-content:space-between; font-size:0.84rem; font-weight:600; border-bottom:1px solid #e2e8f0; }

    .tfinal { margin-top:2rem; background:#f7fafc; border-radius:12px; padding:1.5rem; }
    .tfinal h4 { margin:0 0 1rem; color:#1a365d; }
    .tgrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(110px,1fr)); gap:10px; }
    .ti { background:white; border-radius:8px; padding:1rem; text-align:center; border:1px solid #e2e8f0; }
    .ti.v { background:#ebf8ff; border-color:#bee3f8; }
    .ti.pres { background:#f0fff4; border-color:#9ae6b4; }
    .ti.virt { background:#e6fffa; border-color:#81e6d9; }
    .ti.big { background:#1a365d; grid-column:span 2; border:none; }
    .tv { display:block; font-size:1.5rem; font-weight:800; color:#2b6cb0; }
    .ti.big .tv { color:#63b3ed; font-size:1.9rem; }
    .tl { font-size:0.68rem; color:#718096; text-transform:uppercase; }
    .ti.big .tl { color:rgba(255,255,255,0.7); }
  `]
})
export class CalculadoraComponent {
  tab = 'manual';
  modalidad: Modalidad = 'presencial';
  nivel: NivelAcademico = 'grado';
  nombreCarrera = '';
  csvTexto = '';
  nva: FilaAsig = { clave:'', nombre:'', creditos:3, horasTeoricas:3, horasPracticas:0, semestre:1 };
  filas: FilaAsig[] = [];
  resultado: Carrera | null = null;
  totalesRes: any = null;
  validRes: any = null;

  constructor(public calcService: CalculadoraService) {}

  autoCalc() {
    const h = this.calcService.calcularDesdeCredito(this.nva.creditos, this.modalidad);
    this.nva.horasTeoricas  = h.HT;
    this.nva.horasPracticas = h.HP;
  }

  agregar() {
    if (!this.nva.clave || !this.nva.nombre) return;
    this.filas.push({ ...this.nva });
    this.nva = { clave:'', nombre:'', creditos:3, horasTeoricas:3, horasPracticas:0, semestre: this.nva.semestre };
  }

  eliminar(i: number) { this.filas.splice(i, 1); }
  limpiar() { this.filas = []; this.resultado = null; }

  calcularTodo() {
    if (!this.filas.length) return;
    const maxSem = Math.max(...this.filas.map(f => f.semestre));
    const semestres: Semestre[] = [];
    for (let i = 1; i <= maxSem; i++) {
      const asigs: Asignatura[] = this.filas
        .filter(f => f.semestre === i)
        .map(f => ({
          clave: f.clave, nombre: f.nombre, creditos: f.creditos,
          horasTeoricas: f.horasTeoricas, horasPracticas: f.horasPracticas,
          prerequisitos: [], equivalencias: []
        }));
      const s: Semestre = {
        numero:i, nombre:`Semestre ${i}`, asignaturas: asigs,
        totalHT:0, totalHP:0, totalHIV:0, totalHPV:0, totalHI:0, totalCreditos:0
      };
      semestres.push(this.calcService.calcularTotalesSemestre(s, this.modalidad));
    }
    this.resultado = {
      id:'calc', codigo:'', nombre: this.nombreCarrera || 'Carrera',
      facultad:'', escuela:'', plan:'', nivel: this.nivel, modalidad: this.modalidad,
      semestres, totalHT:0, totalHP:0, totalHIV:0, totalHPV:0, totalHI:0, totalCreditos:0
    };
    this.totalesRes  = this.calcService.calcularTotalesCarrera(this.resultado);
    this.validRes    = this.calcService.validarCarrera(this.resultado);
  }

  parsearCSV() {
    const lines = this.csvTexto.trim().split('\n');
    for (const line of lines) {
      const p = line.split(',').map(x => x.trim());
      if (p.length >= 6) {
        this.filas.push({
          clave:p[0], nombre:p[1], creditos:+p[2],
          horasTeoricas:+p[3], horasPracticas:+p[4], semestre:+p[5]
        });
      }
    }
    this.csvTexto = '';
    this.tab = 'manual';
  }

  onFile(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => { this.csvTexto = e.target.result; this.parsearCSV(); };
    reader.readAsText(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.onFile({ target: { files: [file] } });
  }

  getLabelNivel() {
    return { tecnico:'Técnico Superior', grado:'Grado (Licenciatura)', postgrado:'Postgrado' }[this.nivel];
  }
}