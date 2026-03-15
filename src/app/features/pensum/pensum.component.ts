import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CalculadoraService, TotalesCarrera } from '../../core/services/calculadora.service';
import { Carrera, Semestre, Modalidad } from '../../core/models/pensum.models';

// JSON EMBEBIDO DIRECTAMENTE - funciona sin necesidad de archivos externos
const PENSUM_INFORMATICA: Carrera = {
  id: 'informatica', codigo: '40601',
  nombre: 'Licenciatura en Informatica',
  facultad: 'Facultad de Ciencias',
  escuela: 'Escuela de Informatica',
  plan: '200820', nivel: 'grado', modalidad: 'presencial',
  totalHT: 135, totalHP: 64, totalHIV: 0, totalHPV: 0, totalHI: 0, totalCreditos: 186,
  semestres: [
    {
      numero: 1, nombre: 'Primer Semestre',
      totalHT: 16, totalHP: 5, totalHIV: 0, totalHPV: 0, totalHI: 0, totalCreditos: 18,
      asignaturas: [
        { clave: 'BIO0140', nombre: 'Biologia Basica', horasTeoricas: 2, horasPracticas: 2, creditos: 3, prerequisitos: [], equivalencias: ['BIO0110','BIO0130'] },
        { clave: 'DOP1000', nombre: 'Orientacion Institucional', horasTeoricas: 1, horasPracticas: 0, creditos: 1, prerequisitos: [], equivalencias: ['DOP0100'] },
        { clave: 'HIS0110', nombre: 'Fund de Hist Social Dominicana', horasTeoricas: 3, horasPracticas: 0, creditos: 3, prerequisitos: [], equivalencias: ['HIS1100'] },
        { clave: 'INF2060', nombre: 'Computacion Esencial', horasTeoricas: 4, horasPracticas: 0, creditos: 4, prerequisitos: [], equivalencias: ['INF1020'] },
        { clave: 'INF2070', nombre: 'Lab de Computacion Esencial', horasTeoricas: 0, horasPracticas: 2, creditos: 1, prerequisitos: ['INF2060'], equivalencias: ['INF1020'] },
        { clave: 'LET0110', nombre: 'Lengua Espanola Basica I', horasTeoricas: 3, horasPracticas: 1, creditos: 3, prerequisitos: [], equivalencias: ['LET0130'] },
        { clave: 'SOC0100', nombre: 'Introd A Las Ciencias Sociales', horasTeoricas: 3, horasPracticas: 0, creditos: 3, prerequisitos: [], equivalencias: ['ICS0110'] }
      ]
    },
    {
      numero: 2, nombre: 'Segundo Semestre',
      totalHT: 17, totalHP: 5, totalHIV: 0, totalHPV: 0, totalHI: 0, totalCreditos: 19,
      asignaturas: [
        { clave: 'EFS0120', nombre: 'Educacion Fisica', horasTeoricas: 1, horasPracticas: 2, creditos: 2, prerequisitos: [], equivalencias: ['EFI0120'] },
        { clave: 'IDI0280', nombre: 'Ingles Elemental', horasTeoricas: 5, horasPracticas: 0, creditos: 5, prerequisitos: [], equivalencias: ['IDI0230'] },
        { clave: 'INF5100', nombre: 'Introduccion a la Programacion', horasTeoricas: 4, horasPracticas: 0, creditos: 4, prerequisitos: ['INF2060','INF2070'], equivalencias: ['INF4110'] },
        { clave: 'INF5110', nombre: 'Lab de Int a la Programacion', horasTeoricas: 0, horasPracticas: 2, creditos: 1, prerequisitos: ['INF5100'], equivalencias: ['INF4110'] },
        { clave: 'LET0120', nombre: 'Lengua Espanola Basica II', horasTeoricas: 3, horasPracticas: 1, creditos: 3, prerequisitos: ['LET0110'], equivalencias: ['LET0130'] },
        { clave: 'MAT0140', nombre: 'Matematica Basica', horasTeoricas: 4, horasPracticas: 0, creditos: 4, prerequisitos: [], equivalencias: ['MAT0120'] }
      ]
    },
    {
      numero: 3, nombre: 'Tercer Semestre',
      totalHT: 20, totalHP: 10, totalHIV: 0, totalHPV: 0, totalHI: 0, totalCreditos: 24,
      asignaturas: [
        { clave: 'FIL0110', nombre: 'Int a la Filosofia', horasTeoricas: 3, horasPracticas: 0, creditos: 3, prerequisitos: [], equivalencias: [] },
        { clave: 'FIS0140', nombre: 'Fisica Basica', horasTeoricas: 3, horasPracticas: 3, creditos: 4, prerequisitos: [], equivalencias: ['FIS0120'] },
        { clave: 'IDI0130', nombre: 'Ingles Tecnico', horasTeoricas: 4, horasPracticas: 0, creditos: 4, prerequisitos: ['IDI0280'], equivalencias: [] },
        { clave: 'INF5120', nombre: 'Lenguaje de Programacion I', horasTeoricas: 4, horasPracticas: 0, creditos: 4, prerequisitos: ['INF5100','INF5110'], equivalencias: [] },
        { clave: 'INF5130', nombre: 'Lab de Lenguaje de Programac I', horasTeoricas: 0, horasPracticas: 2, creditos: 1, prerequisitos: ['INF5120'], equivalencias: [] },
        { clave: 'MAT2330', nombre: 'Analisis Lineal Y Matricial', horasTeoricas: 4, horasPracticas: 2, creditos: 5, prerequisitos: ['MAT0140'], equivalencias: ['MAT2300'] },
        { clave: 'QUI0140', nombre: 'Quimica Basica', horasTeoricas: 2, horasPracticas: 3, creditos: 3, prerequisitos: [], equivalencias: ['QUI0110'] }
      ]
    },
    {
      numero: 4, nombre: 'Cuarto Semestre',
      totalHT: 13, totalHP: 8, totalHIV: 0, totalHPV: 0, totalHI: 0, totalCreditos: 17,
      asignaturas: [
        { clave: 'FIS1150', nombre: 'Fisica para Informatica', horasTeoricas: 3, horasPracticas: 0, creditos: 3, prerequisitos: ['FIS0140'], equivalencias: [] },
        { clave: 'FIS1160', nombre: 'Lab de Fisica para Informatica', horasTeoricas: 0, horasPracticas: 2, creditos: 1, prerequisitos: ['FIS0140','FIS1150'], equivalencias: [] },
        { clave: 'INF5140', nombre: 'Lenguaje de Programacion II', horasTeoricas: 4, horasPracticas: 0, creditos: 4, prerequisitos: ['INF5120','INF5130'], equivalencias: [] },
        { clave: 'INF5150', nombre: 'Lab de Lenguaje de Program II', horasTeoricas: 0, horasPracticas: 2, creditos: 1, prerequisitos: ['INF5140'], equivalencias: [] },
        { clave: 'INF5260', nombre: 'Estructura De Datos', horasTeoricas: 2, horasPracticas: 2, creditos: 3, prerequisitos: ['INF5120'], equivalencias: [] },
        { clave: 'MAT3560', nombre: 'Calculo I', horasTeoricas: 4, horasPracticas: 2, creditos: 5, prerequisitos: ['MAT2330'], equivalencias: ['MAT2500'] }
      ]
    },
    {
      numero: 5, nombre: 'Quinto Semestre',
      totalHT: 16, totalHP: 6, totalHIV: 0, totalHPV: 0, totalHI: 0, totalCreditos: 19,
      asignaturas: [
        { clave: 'EST2110', nombre: 'Estadistica Basica', horasTeoricas: 4, horasPracticas: 2, creditos: 5, prerequisitos: ['MAT0140'], equivalencias: [] },
        { clave: 'INF2080', nombre: 'Organiz y Arq del Computador', horasTeoricas: 4, horasPracticas: 0, creditos: 4, prerequisitos: ['INF2060'], equivalencias: [] },
        { clave: 'INF5160', nombre: 'Lenguaje de Programacion III', horasTeoricas: 4, horasPracticas: 0, creditos: 4, prerequisitos: ['INF5140','INF5150'], equivalencias: [] },
        { clave: 'INF5170', nombre: 'Lab Lenguaje de Program III', horasTeoricas: 0, horasPracticas: 2, creditos: 1, prerequisitos: ['INF5160'], equivalencias: [] },
        { clave: 'MAT3570', nombre: 'Calculo II', horasTeoricas: 4, horasPracticas: 2, creditos: 5, prerequisitos: ['MAT3560'], equivalencias: ['MAT3500'] }
      ]
    },
    {
      numero: 6, nombre: 'Sexto Semestre',
      totalHT: 15, totalHP: 8, totalHIV: 0, totalHPV: 0, totalHI: 0, totalCreditos: 19,
      asignaturas: [
        { clave: 'CON1190', nombre: 'Contabilidad General I', horasTeoricas: 4, horasPracticas: 2, creditos: 5, prerequisitos: ['MAT0140'], equivalencias: ['CON1110'] },
        { clave: 'INF3220', nombre: 'Algoritmos Computacionales', horasTeoricas: 4, horasPracticas: 2, creditos: 5, prerequisitos: ['INF5120','MAT3570'], equivalencias: [] },
        { clave: 'INF3240', nombre: 'Sistemas Operativos', horasTeoricas: 3, horasPracticas: 2, creditos: 4, prerequisitos: ['INF2080'], equivalencias: [] },
        { clave: 'INF4200', nombre: 'Base de Datos I', horasTeoricas: 4, horasPracticas: 2, creditos: 5, prerequisitos: ['INF5140'], equivalencias: ['INF4240'] }
      ]
    },
    {
      numero: 7, nombre: 'Septimo Semestre',
      totalHT: 16, totalHP: 8, totalHIV: 0, totalHPV: 0, totalHI: 0, totalCreditos: 24,
      asignaturas: [
        { clave: 'BIO2400', nombre: 'Bioetica', horasTeoricas: 2, horasPracticas: 0, creditos: 2, prerequisitos: ['FIL0110','BIO0140'], equivalencias: [] },
        { clave: 'INF3290', nombre: 'Analisis y Diseno de Sistema', horasTeoricas: 3, horasPracticas: 2, creditos: 5, prerequisitos: ['INF4200'], equivalencias: ['INF3230'] },
        { clave: 'INF5200', nombre: 'Base de Datos II', horasTeoricas: 4, horasPracticas: 2, creditos: 5, prerequisitos: ['INF4200'], equivalencias: [] },
        { clave: 'INFZZA0', nombre: 'Asignatura Optativa I', horasTeoricas: 0, horasPracticas: 0, creditos: 3, prerequisitos: [], equivalencias: [] },
        { clave: 'MAT1430', nombre: 'Matematica Financiera', horasTeoricas: 4, horasPracticas: 2, creditos: 5, prerequisitos: ['MAT0140'], equivalencias: ['MAT1410'] },
        { clave: 'MAT3920', nombre: 'Matematica Discr para Computac', horasTeoricas: 3, horasPracticas: 2, creditos: 4, prerequisitos: ['MAT0140'], equivalencias: [] }
      ]
    },
    {
      numero: 8, nombre: 'Octavo Semestre',
      totalHT: 13, totalHP: 8, totalHIV: 0, totalHPV: 0, totalHI: 0, totalCreditos: 22,
      asignaturas: [
        { clave: 'INF4250', nombre: 'Teleproceso', horasTeoricas: 3, horasPracticas: 2, creditos: 4, prerequisitos: ['INF3240','INF4260'], equivalencias: [] },
        { clave: 'INF4260', nombre: 'Redes De Proc De Datos', horasTeoricas: 3, horasPracticas: 2, creditos: 4, prerequisitos: ['INF3240','INF3220'], equivalencias: [] },
        { clave: 'INF5220', nombre: 'Ingenieria de Software I', horasTeoricas: 3, horasPracticas: 2, creditos: 4, prerequisitos: ['INF3240','INF5200'], equivalencias: [] },
        { clave: 'INFZZB0', nombre: 'Asignatura Optativa II', horasTeoricas: 0, horasPracticas: 0, creditos: 5, prerequisitos: [], equivalencias: [] },
        { clave: 'MAT3940', nombre: 'Investigacion de Operaciones', horasTeoricas: 4, horasPracticas: 2, creditos: 5, prerequisitos: ['MAT3570'], equivalencias: ['MAT3470'] }
      ]
    },
    {
      numero: 9, nombre: 'Noveno Semestre',
      totalHT: 9, totalHP: 6, totalHIV: 0, totalHPV: 0, totalHI: 0, totalCreditos: 16,
      asignaturas: [
        { clave: 'INF5230', nombre: 'Auditoria de Sist Informaticos', horasTeoricas: 3, horasPracticas: 2, creditos: 4, prerequisitos: ['INF3240','INF3290','INF4260'], equivalencias: [] },
        { clave: 'INF5240', nombre: 'Adm de Centros de Computos', horasTeoricas: 3, horasPracticas: 2, creditos: 4, prerequisitos: ['INF4260','INF3240'], equivalencias: [] },
        { clave: 'INF5250', nombre: 'Ingenieria de Software II', horasTeoricas: 3, horasPracticas: 2, creditos: 4, prerequisitos: ['INF5220'], equivalencias: [] },
        { clave: 'INFZZC0', nombre: 'Asignatura Optativa III', horasTeoricas: 0, horasPracticas: 0, creditos: 4, prerequisitos: [], equivalencias: [] }
      ]
    }
  ]
};

const PENSUMS: Record<string, Carrera> = {
  'informatica': PENSUM_INFORMATICA
};

@Component({
  selector: 'app-pensum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (cargando) {
      <div class="loading">
        <div class="spinner"></div>
        <p>Cargando pensum...</p>
      </div>
    }
    @if (!cargando && !carrera) {
      <div class="error-box">
        <div class="err-icon">⚠️</div>
        <h3>Pensum no encontrado</h3>
        <p>No existe pensum con ID: <code>{{ idActual }}</code></p>
      </div>
    }
    @if (!cargando && carrera) {
      <div class="pensum-wrap">

        <div class="p-hero">
          <div class="p-hero-left">
            <div class="p-tags">
              <span class="ptag fac">{{ carrera.facultad }}</span>
              <span class="ptag esc">{{ carrera.escuela }}</span>
              <span class="ptag plan">Plan {{ carrera.plan }}</span>
            </div>
            <h1>{{ carrera.nombre }}</h1>
            <p class="p-meta">
              Codigo: <strong>{{ carrera.codigo }}</strong>
              &nbsp;·&nbsp; Nivel: <strong>{{ getNivelLabel() }}</strong>
              &nbsp;·&nbsp; <strong>{{ carrera.semestres.length }}</strong> semestres
            </p>
          </div>
          <div class="p-hero-right">
            <div class="modal-label">Modalidad de calculo:</div>
            <div class="modal-tabs">
              <button [class.on]="modalidad==='presencial'"     (click)="setModal('presencial')">Presencial</button>
              <button [class.on]="modalidad==='semipresencial'" (click)="setModal('semipresencial')">Semipres.</button>
              <button [class.on]="modalidad==='virtual'"        (click)="setModal('virtual')">Virtual</button>
            </div>
          </div>
        </div>

        @if (totales) {
          <div class="totales-bar">
            <div class="tbi"><span class="tbv">{{ totales.CR }}</span><span class="tbl">Creditos</span></div>
            <div class="tbsep"></div>
            <div class="tbi"><span class="tbv">{{ totales.HT }}</span><span class="tbl">HT Presencial</span></div>
            <div class="tbi"><span class="tbv">{{ totales.HP }}</span><span class="tbl">HP Presencial</span></div>
            @if (modalidad !== 'presencial') {
              <div class="tbsep"></div>
              <div class="tbi virt"><span class="tbv">{{ totales.HIV }}</span><span class="tbl">HIV</span></div>
              <div class="tbi virt"><span class="tbv">{{ totales.HPV }}</span><span class="tbl">HPV</span></div>
              <div class="tbi virt"><span class="tbv">{{ totales.HI }}</span><span class="tbl">HI Invest.</span></div>
            }
            <div class="tbsep"></div>
            <div class="tbi tot"><span class="tbv">{{ totales.totalGeneral }}</span><span class="tbl">TOTAL HORAS</span></div>
          </div>
        }

        @if (validacion) {
          <div class="val-bar" [class.ok]="validacion.valido" [class.no]="!validacion.valido">
            <span>{{ validacion.valido ? '✅ Pensum valido' : '⚠️ Requiere revision' }}</span>
            <span class="val-det">{{ validacion.creditos }} CR · Rango: {{ validacion.limites.minCreditos }}–{{ validacion.limites.maxCreditos }}</span>
          </div>
        }

        <div class="sems">
          @for (sem of semsCalc; track sem.numero) {
            <div class="sem-card">
              <div class="sem-hd" [class]="'c'+ ((sem.numero-1)%6)">
                <div class="sem-title">
                  <span class="sem-num">{{ sem.numero }}</span>
                  {{ sem.nombre }}
                </div>
                <div class="sem-tots">
                  <span>{{ sem.totalCreditos }} CR</span>
                  <span>{{ sem.totalHT }} HT</span>
                  <span>{{ sem.totalHP }} HP</span>
                  @if (modalidad !== 'presencial') {
                    <span class="v">{{ sem.totalHIV }} HIV</span>
                  }
                  <span class="cnt">{{ sem.asignaturas.length }} asig</span>
                </div>
              </div>
              <div class="tbl-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Clave</th>
                      <th>Asignatura</th>
                      <th class="c">CR</th>
                      <th class="c">HT</th>
                      <th class="c">HP</th>
                      @if (modalidad !== 'presencial') {
                        <th class="c v">HIV</th>
                        @if (modalidad === 'virtual') { <th class="c v">HPV</th> }
                        <th class="c v">HI</th>
                      }
                      <th>Prerequisitos</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (a of sem.asignaturas; track a.clave) {
                      <tr>
                        <td><span class="clave">{{ a.clave }}</span></td>
                        <td class="nom">{{ a.nombre }}</td>
                        <td class="c"><span class="cr-b">{{ a.creditos }}</span></td>
                        <td class="c">{{ getH(a).HT }}</td>
                        <td class="c">{{ getH(a).HP }}</td>
                        @if (modalidad !== 'presencial') {
                          <td class="c v">{{ getH(a).HIV }}</td>
                          @if (modalidad === 'virtual') { <td class="c v">{{ getH(a).HPV }}</td> }
                          <td class="c v">{{ getH(a).HI }}</td>
                        }
                        <td>
                          @if (a.prerequisitos.length === 0) {
                            <span class="no-pre">—</span>
                          } @else {
                            @for (p of a.prerequisitos; track p) {
                              <span class="pre-t">{{ p }}</span>
                            }
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2"><strong>Subtotales</strong></td>
                      <td class="c"><strong>{{ sem.totalCreditos }}</strong></td>
                      <td class="c"><strong>{{ sem.totalHT }}</strong></td>
                      <td class="c"><strong>{{ sem.totalHP }}</strong></td>
                      @if (modalidad !== 'presencial') {
                        <td class="c v"><strong>{{ sem.totalHIV }}</strong></td>
                        @if (modalidad === 'virtual') { <td class="c v"><strong>{{ sem.totalHPV }}</strong></td> }
                        <td class="c v"><strong>{{ sem.totalHI }}</strong></td>
                      }
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          }
        </div>

        @if (totales) {
          <div class="resumen">
            <h3>📊 Resumen General</h3>
            <div class="res-grid">
              <div class="ri"><div class="rv">{{ carrera.semestres.length }}</div><div class="rl">Semestres</div></div>
              <div class="ri"><div class="rv">{{ totales.CR }}</div><div class="rl">Creditos</div></div>
              <div class="ri blue"><div class="rv">{{ totales.HT }}</div><div class="rl">HT Pres.</div></div>
              <div class="ri blue"><div class="rv">{{ totales.HP }}</div><div class="rl">HP Pres.</div></div>
              <div class="ri teal"><div class="rv">{{ totales.HIV }}</div><div class="rl">HIV Virt.</div></div>
              <div class="ri teal"><div class="rv">{{ totales.HPV }}</div><div class="rl">HPV Virt.</div></div>
              <div class="ri teal"><div class="rv">{{ totales.HI }}</div><div class="rl">HI Invest.</div></div>
              <div class="ri dark span2">
                <div class="rv big">{{ totales.totalGeneral }}</div>
                <div class="rl">TOTAL GENERAL DE HORAS</div>
              </div>
            </div>
          </div>
        }

      </div>
    }
  `,
  styles: [`
    .loading { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:1rem; color:#718096; }
    .spinner { width:48px; height:48px; border:5px solid #e2e8f0; border-top-color:#2b6cb0; border-radius:50%; animation:spin 0.8s linear infinite; }
    @keyframes spin { to { transform:rotate(360deg); } }
    .error-box { text-align:center; padding:4rem 2rem; }
    .err-icon { font-size:3.5rem; margin-bottom:1rem; }
    .error-box h3 { color:#e53e3e; margin:0 0 0.5rem; }
    .error-box code { background:#fff5f5; padding:2px 8px; border-radius:4px; font-size:0.82rem; color:#e53e3e; }

    .pensum-wrap { max-width:1200px; margin:0 auto; }

    .p-hero {
      background:linear-gradient(135deg,#0f172a,#1e3a5f,#2b6cb0);
      padding:2rem 2.5rem; color:white;
      display:flex; justify-content:space-between; align-items:flex-start;
      flex-wrap:wrap; gap:1.5rem;
    }
    .p-tags { display:flex; gap:7px; flex-wrap:wrap; margin-bottom:0.7rem; }
    .ptag { padding:3px 10px; border-radius:10px; font-size:0.7rem; font-weight:700; text-transform:uppercase; }
    .ptag.fac  { background:rgba(99,179,237,0.2); color:#bee3f8; }
    .ptag.esc  { background:rgba(104,211,145,0.2); color:#9ae6b4; }
    .ptag.plan { background:rgba(246,224,94,0.2); color:#faf089; }
    h1 { margin:0 0 0.4rem; font-size:1.55rem; font-weight:900; }
    .p-meta { margin:0; font-size:0.82rem; opacity:0.72; }
    .p-hero-right { min-width:260px; }
    .modal-label { font-size:0.72rem; opacity:0.75; text-transform:uppercase; letter-spacing:1px; margin-bottom:0.5rem; }
    .modal-tabs { display:flex; gap:3px; background:rgba(0,0,0,0.3); padding:4px; border-radius:11px; }
    .modal-tabs button { flex:1; padding:8px 6px; border:none; border-radius:8px; background:transparent; color:rgba(255,255,255,0.65); font-size:0.76rem; cursor:pointer; transition:all 0.2s; }
    .modal-tabs button.on { background:white; color:#1a365d; font-weight:800; box-shadow:0 2px 8px rgba(0,0,0,0.2); }

    .totales-bar { display:flex; align-items:center; background:#1a365d; overflow-x:auto; }
    .tbi { flex:1; padding:14px 10px; text-align:center; min-width:70px; }
    .tbi.virt { background:rgba(99,179,237,0.15); }
    .tbi.tot  { background:rgba(255,255,255,0.12); }
    .tbv { display:block; font-size:1.4rem; font-weight:900; color:#63b3ed; }
    .tbi.tot .tbv { color:white; font-size:1.6rem; }
    .tbl { display:block; font-size:0.6rem; color:rgba(255,255,255,0.55); text-transform:uppercase; margin-top:2px; }
    .tbsep { width:1px; height:34px; background:rgba(255,255,255,0.1); flex-shrink:0; }

    .val-bar { padding:11px 1.5rem; display:flex; align-items:center; gap:12px; font-size:0.84rem; font-weight:600; flex-wrap:wrap; }
    .val-bar.ok { background:#f0fff4; color:#276749; border-bottom:2px solid #68d391; }
    .val-bar.no { background:#fff5f5; color:#742a2a; border-bottom:2px solid #fc8181; }
    .val-det { font-weight:400; opacity:0.8; }

    .sems { padding:1.2rem 1.5rem; display:flex; flex-direction:column; gap:1.2rem; }
    .sem-card { border-radius:12px; overflow:hidden; box-shadow:0 3px 15px rgba(0,0,0,0.1); }
    .sem-hd { display:flex; justify-content:space-between; align-items:center; padding:0.85rem 1.2rem; color:white; flex-wrap:wrap; gap:0.5rem; }
    .c0{background:linear-gradient(135deg,#1a365d,#2b6cb0);}
    .c1{background:linear-gradient(135deg,#166534,#16a34a);}
    .c2{background:linear-gradient(135deg,#134e4a,#0d9488);}
    .c3{background:linear-gradient(135deg,#7c2d12,#c2410c);}
    .c4{background:linear-gradient(135deg,#581c87,#9333ea);}
    .c5{background:linear-gradient(135deg,#831843,#db2777);}
    .sem-title { display:flex; align-items:center; gap:9px; font-weight:800; font-size:0.92rem; }
    .sem-num { width:27px; height:27px; background:rgba(255,255,255,0.22); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.82rem; font-weight:900; flex-shrink:0; }
    .sem-tots { display:flex; gap:5px; flex-wrap:wrap; }
    .sem-tots span { background:rgba(255,255,255,0.2); padding:2px 8px; border-radius:10px; font-size:0.72rem; }
    .sem-tots .v   { background:rgba(99,179,237,0.3); }
    .sem-tots .cnt { background:rgba(255,255,255,0.35); font-weight:700; }

    .tbl-wrap { overflow-x:auto; background:white; }
    table { width:100%; border-collapse:collapse; font-size:0.84rem; }
    thead th { background:#f8fafc; padding:8px 10px; text-align:left; border-bottom:2px solid #e2e8f0; font-size:0.7rem; text-transform:uppercase; color:#64748b; white-space:nowrap; }
    thead th.v { color:#1d4ed8; }
    tbody td { padding:8px 10px; border-bottom:1px solid #f1f5f9; vertical-align:middle; }
    tbody tr:hover td { background:#f8fafc; }
    tfoot td { background:#f1f5f9; padding:8px 10px; border-top:2px solid #e2e8f0; }
    .c  { text-align:center; }
    .nom { font-weight:600; color:#1e293b; min-width:160px; }
    .clave { background:#eff6ff; color:#1d4ed8; padding:2px 6px; border-radius:5px; font-family:monospace; font-size:0.75rem; white-space:nowrap; }
    .cr-b  { background:#166534; color:white; padding:2px 8px; border-radius:10px; font-size:0.74rem; font-weight:800; }
    .pre-t { background:#fef3c7; color:#92400e; padding:2px 6px; border-radius:4px; font-size:0.7rem; margin-right:3px; display:inline-block; white-space:nowrap; margin-bottom:2px; }
    .no-pre { color:#cbd5e1; }
    tbody td.v { color:#2b6cb0; font-weight:500; }

    .resumen { margin:0 1.5rem 2rem; background:white; border-radius:14px; padding:1.8rem; box-shadow:0 4px 20px rgba(0,0,0,0.08); }
    .resumen h3 { margin:0 0 1.2rem; color:#1a365d; }
    .res-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(110px,1fr)); gap:10px; }
    .ri { background:#f8fafc; border-radius:10px; padding:1rem; text-align:center; }
    .ri.blue { background:#eff6ff; }
    .ri.teal { background:#f0fdfa; }
    .ri.dark { background:linear-gradient(135deg,#0f172a,#1a365d); }
    .ri.span2 { grid-column:span 2; }
    .rv { font-size:1.6rem; font-weight:900; color:#2b6cb0; }
    .rv.big { font-size:2rem; color:#63b3ed; }
    .rl { font-size:0.63rem; color:#94a3b8; text-transform:uppercase; margin-top:3px; }
    .ri.dark .rl { color:rgba(255,255,255,0.55); }
  `]
})
export class PensumComponent implements OnInit {
  carrera:   Carrera | null = null;
  cargando   = true;
  modalidad: Modalidad = 'presencial';
  semsCalc:  Semestre[] = [];
  totales:   TotalesCarrera | null = null;
  validacion: any = null;
  idActual   = 'informatica';

  constructor(
    private route: ActivatedRoute,
    private calc:  CalculadoraService
  ) {}

  ngOnInit() {
    this.idActual = this.route.snapshot.paramMap.get('id') || 'informatica';
    // Cargar desde datos embebidos — no depende de archivos externos
    const data = PENSUMS[this.idActual];
    if (data) {
      this.carrera  = { ...data };
      this.modalidad = data.modalidad as Modalidad;
      this.recalcular();
    }
    this.cargando = false;
  }

  setModal(m: Modalidad) { this.modalidad = m; this.recalcular(); }

  recalcular() {
    if (!this.carrera) return;
    this.carrera.modalidad = this.modalidad;
    this.semsCalc   = this.carrera.semestres.map(s =>
      this.calc.calcularTotalesSemestre(s, this.modalidad)
    );
    this.totales    = this.calc.calcularTotalesCarrera(this.carrera);
    this.validacion = this.calc.validarCarrera(this.carrera);
  }

  getH(a: any) { return this.calc.calcularHorasAsignatura(a, this.modalidad); }

  getNivelLabel() {
    const l: any = { tecnico:'Tecnico', grado:'Grado', postgrado:'Postgrado' };
    return l[this.carrera?.nivel || 'grado'];
  }
}
