export type Modalidad = 'presencial' | 'semipresencial' | 'virtual';
export type NivelAcademico = 'tecnico' | 'grado' | 'postgrado';

export interface Asignatura {
  clave: string;
  nombre: string;
  horasTeoricas: number;
  horasPracticas: number;
  creditos: number;
  horasInteraccionVirtual?: number;
  horasPracticasVirtuales?: number;
  horasInvestigacion?: number;
  prerequisitos: string[];
  equivalencias: string[];
}

export interface HorasCalculadas {
  HT: number;
  HP: number;
  HIV: number;
  HPV: number;
  HI: number;
  CR: number;
  totalHoras: number;
}

export interface Semestre {
  numero: number;
  nombre: string;
  asignaturas: Asignatura[];
  totalHT: number;
  totalHP: number;
  totalHIV: number;
  totalHPV: number;
  totalHI: number;
  totalCreditos: number;
}

export interface Carrera {
  id: string;
  codigo: string;
  nombre: string;
  facultad: string;
  escuela: string;
  plan: string;
  nivel: NivelAcademico;
  modalidad: Modalidad;
  semestres: Semestre[];
  totalHT: number;
  totalHP: number;
  totalHIV: number;
  totalHPV: number;
  totalHI: number;
  totalCreditos: number;
}

export interface LimitesNivel {
  minCreditos: number;
  maxCreditos: number;
  minHTporc: number;
  maxHTporc: number;
  descripcion: string;
}

export const LIMITES_POR_NIVEL: Record<NivelAcademico, LimitesNivel> = {
  tecnico: {
    minCreditos: 60, maxCreditos: 90,
    minHTporc: 30, maxHTporc: 70,
    descripcion: 'Técnico Superior Universitario'
  },
  grado: {
    minCreditos: 120, maxCreditos: 200,
    minHTporc: 40, maxHTporc: 75,
    descripcion: 'Licenciatura / Grado'
  },
  postgrado: {
    minCreditos: 30, maxCreditos: 120,
    minHTporc: 50, maxHTporc: 80,
    descripcion: 'Maestría / Especialidad / Doctorado'
  }
};

export const HORAS_POR_CREDITO = {
  HT: 15,
  HP: 30,
  HIV: 15,
  HPV: 30,
  HI: 45
};