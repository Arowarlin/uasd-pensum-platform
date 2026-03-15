import { Injectable } from '@angular/core';
import { Asignatura, Semestre, Carrera, Modalidad, Nivel } from '../models/pensum.models';

export interface HorasAsignatura {
  HT: number; HP: number; HIV: number; HPV: number; HI: number; total: number;
}

export interface TotalesCarrera {
  CR: number; HT: number; HP: number; HIV: number; HPV: number; HI: number;
  totalHorasPresenciales: number;
  totalHorasVirtuales: number;
  totalGeneral: number;
}

export interface ValidacionCarrera {
  valido: boolean;
  creditos: number;
  mensajes: string[];
  limites: { minCreditos: number; maxCreditos: number; minHT: number; maxHT: number };
}

const LIMITES: Record<any, { minCreditos: number; maxCreditos: number; minHT: number; maxHT: number }> = {
  tecnico:   { minCreditos: 60,  maxCreditos: 120, minHT: 40, maxHT: 70 },
  grado:     { minCreditos: 120, maxCreditos: 200, minHT: 40, maxHT: 75 },
  postgrado: { minCreditos: 30,  maxCreditos: 80,  minHT: 30, maxHT: 60 },
};

@Injectable({ providedIn: 'root' })
export class CalculadoraService {

  calcularHorasAsignatura(a: Asignatura, modalidad: Modalidad): HorasAsignatura {
    let HT = 0, HP = 0, HIV = 0, HPV = 0, HI = 0;
    switch (modalidad) {
      case 'presencial':
        HT  = a.horasTeoricas  * 15;
        HP  = a.horasPracticas * 30;
        break;
      case 'semipresencial':
        HT  = a.horasTeoricas  * 15;
        HP  = a.horasPracticas * 30;
        HIV = Math.round(a.creditos * 15 * 0.5);
        HI  = Math.round(a.creditos * 45 * 0.3);
        break;
      case 'virtual':
        HIV = a.creditos * 15;
        HPV = a.creditos * 30;
        HI  = a.creditos * 45;
        break;
    }
    return { HT, HP, HIV, HPV, HI, total: HT + HP + HIV + HPV + HI };
  }

  calcularTotalesSemestre(sem: Semestre, modalidad: Modalidad): Semestre {
    let tHT = 0, tHP = 0, tHIV = 0, tHPV = 0, tHI = 0, tCR = 0;
    sem.asignaturas.forEach(a => {
      const h = this.calcularHorasAsignatura(a, modalidad);
      tHT += h.HT; tHP += h.HP; tHIV += h.HIV; tHPV += h.HPV; tHI += h.HI;
      tCR += a.creditos;
    });
    return { ...sem, totalHT: tHT, totalHP: tHP, totalHIV: tHIV, totalHPV: tHPV, totalHI: tHI, totalCreditos: tCR };
  }

  calcularTotalesCarrera(carrera: Carrera): TotalesCarrera {
    let CR = 0, HT = 0, HP = 0, HIV = 0, HPV = 0, HI = 0;
    carrera.semestres.forEach(sem => {
      const s = this.calcularTotalesSemestre(sem, carrera.modalidad);
      CR += s.totalCreditos; HT += s.totalHT; HP += s.totalHP;
      HIV += s.totalHIV;     HPV += s.totalHPV; HI += s.totalHI;
    });
    return {
      CR, HT, HP, HIV, HPV, HI,
      totalHorasPresenciales: HT + HP,
      totalHorasVirtuales: HIV + HPV + HI,
      totalGeneral: HT + HP + HIV + HPV + HI
    };
  }

  validarCarrera(carrera: Carrera): ValidacionCarrera {
    const totales = this.calcularTotalesCarrera(carrera);
    const limites = LIMITES[carrera.nivel] || LIMITES['grado'];
    const mensajes: string[] = [];
    if (totales.CR < limites.minCreditos)
      mensajes.push(`Creditos insuficientes: ${totales.CR} (minimo ${limites.minCreditos})`);
    if (totales.CR > limites.maxCreditos)
      mensajes.push(`Creditos excesivos: ${totales.CR} (maximo ${limites.maxCreditos})`);
    const pctHT = totales.totalGeneral > 0
      ? Math.round((totales.HT / totales.totalGeneral) * 100) : 0;
    if (pctHT < limites.minHT)
      mensajes.push(`% HT bajo: ${pctHT}% (minimo ${limites.minHT}%)`);
    if (pctHT > limites.maxHT)
      mensajes.push(`% HT alto: ${pctHT}% (maximo ${limites.maxHT}%)`);
    return { valido: mensajes.length === 0, creditos: totales.CR, mensajes, limites };
  }
}
