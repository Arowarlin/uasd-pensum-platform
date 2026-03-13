import { Injectable } from '@angular/core';
import {
  Asignatura, Carrera, HorasCalculadas, Modalidad,
  Semestre, HORAS_POR_CREDITO, LIMITES_POR_NIVEL, LimitesNivel
} from '../models/pensum.models';

export interface ResultadoValidacion {
  valido: boolean;
  mensajes: string[];
  creditos: number;
  limites: LimitesNivel;
  porcentajeHT: number;
}

export interface TotalesCarrera {
  HT: number; HP: number; HIV: number; HPV: number; HI: number; CR: number;
  totalHorasPresenciales: number;
  totalHorasVirtuales: number;
  totalGeneral: number;
}

@Injectable({ providedIn: 'root' })
export class CalculadoraService {

  calcularHorasAsignatura(asig: Asignatura, modalidad: Modalidad): HorasCalculadas {
    const cr = asig.creditos;
    switch (modalidad) {
      case 'presencial':
        return {
          HT: asig.horasTeoricas, HP: asig.horasPracticas,
          HIV: 0, HPV: 0, HI: 0, CR: cr,
          totalHoras: asig.horasTeoricas + asig.horasPracticas
        };
      case 'semipresencial':
        const hivS = asig.horasInteraccionVirtual ?? Math.round(cr * HORAS_POR_CREDITO.HIV * 0.5);
        const hiS  = asig.horasInvestigacion     ?? Math.round(cr * HORAS_POR_CREDITO.HI  * 0.3);
        return {
          HT: asig.horasTeoricas, HP: asig.horasPracticas,
          HIV: hivS, HPV: 0, HI: hiS, CR: cr,
          totalHoras: asig.horasTeoricas + asig.horasPracticas + hivS + hiS
        };
      case 'virtual':
        const hivV = asig.horasInteraccionVirtual ?? cr * HORAS_POR_CREDITO.HIV;
        const hpvV = asig.horasPracticasVirtuales ?? cr * HORAS_POR_CREDITO.HPV;
        const hiV  = asig.horasInvestigacion      ?? cr * HORAS_POR_CREDITO.HI;
        return {
          HT: 0, HP: 0, HIV: hivV, HPV: hpvV, HI: hiV, CR: cr,
          totalHoras: hivV + hpvV + hiV
        };
    }
  }

  calcularTotalesSemestre(semestre: Semestre, modalidad: Modalidad): Semestre {
    let totalHT=0, totalHP=0, totalHIV=0, totalHPV=0, totalHI=0, totalCR=0;
    for (const asig of semestre.asignaturas) {
      const h = this.calcularHorasAsignatura(asig, modalidad);
      totalHT+=h.HT; totalHP+=h.HP; totalHIV+=h.HIV;
      totalHPV+=h.HPV; totalHI+=h.HI; totalCR+=h.CR;
    }
    return { ...semestre, totalHT, totalHP, totalHIV, totalHPV, totalHI, totalCreditos: totalCR };
  }

  calcularTotalesCarrera(carrera: Carrera): TotalesCarrera {
    let HT=0, HP=0, HIV=0, HPV=0, HI=0, CR=0;
    for (const sem of carrera.semestres) {
      const s = this.calcularTotalesSemestre(sem, carrera.modalidad);
      HT+=s.totalHT; HP+=s.totalHP; HIV+=s.totalHIV;
      HPV+=s.totalHPV; HI+=s.totalHI; CR+=s.totalCreditos;
    }
    return {
      HT, HP, HIV, HPV, HI, CR,
      totalHorasPresenciales: HT + HP,
      totalHorasVirtuales: HIV + HPV + HI,
      totalGeneral: HT + HP + HIV + HPV + HI
    };
  }

  validarCarrera(carrera: Carrera): ResultadoValidacion {
    const totales = this.calcularTotalesCarrera(carrera);
    const limites = LIMITES_POR_NIVEL[carrera.nivel];
    const mensajes: string[] = [];
    let valido = true;

    if (totales.CR < limites.minCreditos) {
      valido = false;
      mensajes.push(`❌ Créditos insuficientes: ${totales.CR} (mínimo ${limites.minCreditos})`);
    } else if (totales.CR > limites.maxCreditos) {
      valido = false;
      mensajes.push(`❌ Créditos excedidos: ${totales.CR} (máximo ${limites.maxCreditos})`);
    } else {
      mensajes.push(`✅ Créditos en rango: ${totales.CR} (${limites.minCreditos}–${limites.maxCreditos})`);
    }

    const totalConCR = totales.CR * HORAS_POR_CREDITO.HT;
    const porcHT = totalConCR > 0 ? Math.round((totales.HT / totalConCR) * 100) : 0;

    if (porcHT < limites.minHTporc) {
      mensajes.push(`⚠️ % HT bajo: ${porcHT}% (mínimo ${limites.minHTporc}%)`);
    } else {
      mensajes.push(`✅ Distribución HT correcta: ${porcHT}%`);
    }

    if (carrera.modalidad === 'virtual' && totales.HT > 0) {
      valido = false;
      mensajes.push(`❌ Modalidad virtual no puede tener HT presenciales`);
    }

    mensajes.push(`ℹ️ Total horas presenciales: ${totales.totalHorasPresenciales}`);
    mensajes.push(`ℹ️ Total horas virtuales: ${totales.totalHorasVirtuales}`);

    return { valido, mensajes, creditos: totales.CR, limites, porcentajeHT: porcHT };
  }

  calcularDesdeCredito(cr: number, modalidad: Modalidad) {
    switch (modalidad) {
      case 'presencial':
        return { HT: cr*15, HP: cr*30, HIV: 0, HPV: 0, HI: 0 };
      case 'semipresencial':
        return { HT: Math.round(cr*15*0.5), HP: Math.round(cr*30*0.5), HIV: Math.round(cr*15*0.5), HPV: 0, HI: Math.round(cr*45*0.3) };
      case 'virtual':
        return { HT: 0, HP: 0, HIV: cr*15, HPV: cr*30, HI: cr*45 };
    }
  }
}