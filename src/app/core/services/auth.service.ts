import { Injectable, signal } from '@angular/core';
import { User, LoginCredentials, UserRole } from '../models/auth.models';

const USUARIOS: User[] = [
  {
    id: '1',
    nombre: 'Administrador UASD',
    matricula: 'admin',
    email: 'admin@uasd.edu.do',
    password: 'admin123',
    role: 'admin',
    avatar: 'A'
  },
  {
    id: '2',
    nombre: 'Arowarlin Suárez Díaz',
    matricula: '100679806',
    email: '100679806@uasd.edu.do',
    password: '100679806',
    role: 'estudiante',
    avatar: 'A'
  },
  {
    id: '3',
    nombre: 'Juan Pérez',
    matricula: '100000001',
    email: '100000001@uasd.edu.do',
    password: '123456',
    role: 'estudiante',
    avatar: 'J'
  }
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _usuario = signal<User | null>(this.cargarSesion());

  get usuario() { return this._usuario(); }
  get isLoggedIn() { return this._usuario() !== null; }
  get isAdmin() { return this._usuario()?.role === 'admin'; }
  get isEstudiante() { return this._usuario()?.role === 'estudiante'; }

  login(creds: LoginCredentials): { ok: boolean; mensaje: string } {
    const user = USUARIOS.find(
      u => u.matricula === creds.matricula.trim() &&
           u.password === creds.password.trim()
    );
    if (user) {
      this._usuario.set(user);
      localStorage.setItem('uasd_user', JSON.stringify(user));
      return { ok: true, mensaje: `Bienvenido, ${user.nombre}` };
    }
    return { ok: false, mensaje: 'Matrícula o contraseña incorrecta' };
  }

  logout() {
    this._usuario.set(null);
    localStorage.removeItem('uasd_user');
  }

  private cargarSesion(): User | null {
    try {
      const raw = localStorage.getItem('uasd_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}