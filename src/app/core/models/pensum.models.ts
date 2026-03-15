export type Modalidad = 'presencial' | 'semipresencial' | 'virtual';
export type Nivel    = 'tecnico' | 'grado' | 'postgrado';

export interface Asignatura {
  clave:          string;
  nombre:         string;
  horasTeoricas:  number;
  horasPracticas: number;
  creditos:       number;
  prerequisitos:  string[];
  equivalencias:  string[];
}

export interface Semestre {
  numero:        number;
  nombre:        string;
  totalHT:       number;
  totalHP:       number;
  totalHIV:      number;
  totalHPV:      number;
  totalHI:       number;
  totalCreditos: number;
  asignaturas:   Asignatura[];
}

export interface Carrera {
  id:            string;
  codigo:        string;
  nombre:        string;
  facultad:      string;
  escuela:       string;
  plan:          string;
  nivel:         Nivel;
  modalidad:     Modalidad;
  totalHT:       number;
  totalHP:       number;
  totalHIV:      number;
  totalHPV:      number;
  totalHI:       number;
  totalCreditos: number;
  semestres:     Semestre[];
}
