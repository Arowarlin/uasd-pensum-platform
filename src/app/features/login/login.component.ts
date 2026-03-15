import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="login-bg">
      <div class="login-card">
        <div class="logo-area">
          <div class="logo-circle">U</div>
          <h1>UASD Pensum</h1>
          <p>Sistema de Gestión Académica</p>
        </div>

        <form (ngSubmit)="onLogin()" class="form">
          <div class="field">
            <label>Matrícula / Usuario</label>
            <input
              type="text"
              [(ngModel)]="creds.matricula"
              name="matricula"
              placeholder="Ej. 100679806"
              autocomplete="username"
              [class.input-error]="error()"
            />
          </div>
          <div class="field">
            <label>Contraseña</label>
            <div class="pass-wrap">
              <input
                [type]="verPass() ? 'text' : 'password'"
                [(ngModel)]="creds.password"
                name="password"
                placeholder="Tu contraseña"
                autocomplete="current-password"
                [class.input-error]="error()"
              />
              <button type="button" class="eye" (click)="verPass.set(!verPass())">
                {{ verPass() ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          @if (error()) {
            <div class="alert-error">⚠️ {{ error() }}</div>
          }

          <button type="submit" class="btn-login" [disabled]="cargando()">
            @if (cargando()) { <span class="spinner-sm"></span> }
            {{ cargando() ? 'Ingresando...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="demo-box">
          <p class="demo-title">Cuentas de prueba:</p>
          <div class="demo-accounts">
            <button class="demo-btn admin" (click)="llenar('admin','admin123')">
              🔑 Admin
            </button>
            <button class="demo-btn estudiante" (click)="llenar('100679806','100679806')">
              🎓 Estudiante
            </button>
          </div>
        </div>

        <p class="footer-txt">Universidad Autónoma de Santo Domingo — 1538</p>
      </div>
    </div>
  `,
  styles: [`
    .login-bg {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 1rem;
    }
    .login-card {
      background: white; border-radius: 20px; padding: 2.5rem 2rem;
      width: 100%; max-width: 420px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.5);
      animation: slideUp 0.4s ease;
    }
    @keyframes slideUp {
      from { opacity:0; transform:translateY(30px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .logo-area { text-align:center; margin-bottom:2rem; }
    .logo-circle {
      width:70px; height:70px; background:linear-gradient(135deg,#1a365d,#2b6cb0);
      border-radius:50%; display:flex; align-items:center; justify-content:center;
      font-size:2rem; font-weight:900; color:white; margin:0 auto 0.8rem;
      box-shadow: 0 8px 20px rgba(43,108,176,0.4);
    }
    h1 { font-size:1.5rem; font-weight:800; color:#1a365d; margin:0; }
    .logo-area p { font-size:0.8rem; color:#718096; margin:0.3rem 0 0; }

    .form { display:flex; flex-direction:column; gap:1rem; }
    .field { display:flex; flex-direction:column; gap:6px; }
    .field label { font-size:0.82rem; font-weight:600; color:#4a5568; }
    .field input {
      padding:11px 14px; border:2px solid #e2e8f0; border-radius:10px;
      font-size:0.95rem; transition:border-color 0.2s; outline:none;
      width:100%; box-sizing:border-box;
    }
    .field input:focus { border-color:#2b6cb0; box-shadow:0 0 0 3px rgba(43,108,176,0.1); }
    .input-error { border-color:#e53e3e !important; }
    .pass-wrap { position:relative; }
    .pass-wrap input { padding-right:44px; }
    .eye {
      position:absolute; right:10px; top:50%; transform:translateY(-50%);
      background:none; border:none; cursor:pointer; font-size:1.1rem; padding:4px;
    }
    .alert-error {
      background:#fff5f5; border:1px solid #feb2b2; color:#c53030;
      padding:10px 14px; border-radius:8px; font-size:0.85rem;
    }
    .btn-login {
      background:linear-gradient(135deg,#1a365d,#2b6cb0);
      color:white; border:none; padding:13px; border-radius:10px;
      font-size:1rem; font-weight:700; cursor:pointer; transition:all 0.2s;
      display:flex; align-items:center; justify-content:center; gap:8px;
      margin-top:0.3rem;
    }
    .btn-login:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 20px rgba(43,108,176,0.4); }
    .btn-login:disabled { opacity:0.7; cursor:not-allowed; }
    .spinner-sm {
      width:16px; height:16px; border:3px solid rgba(255,255,255,0.3);
      border-top-color:white; border-radius:50%; animation:spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform:rotate(360deg); } }

    .demo-box { margin-top:1.5rem; padding:1rem; background:#f7fafc; border-radius:10px; }
    .demo-title { font-size:0.78rem; color:#718096; text-align:center; margin:0 0 0.6rem; font-weight:600; }
    .demo-accounts { display:flex; gap:0.6rem; justify-content:center; }
    .demo-btn { padding:7px 18px; border-radius:8px; border:2px solid; font-size:0.82rem; font-weight:600; cursor:pointer; transition:all 0.2s; }
    .demo-btn.admin { border-color:#1a365d; color:#1a365d; background:white; }
    .demo-btn.admin:hover { background:#1a365d; color:white; }
    .demo-btn.estudiante { border-color:#276749; color:#276749; background:white; }
    .demo-btn.estudiante:hover { background:#276749; color:white; }

    .footer-txt { text-align:center; font-size:0.73rem; color:#a0aec0; margin:1.2rem 0 0; }
  `]
})
export class LoginComponent {
  creds = { matricula: '', password: '' };
  error   = signal('');
  cargando = signal(false);
  verPass  = signal(false);

  constructor(private auth: AuthService, private router: Router) {
    if (auth.isLoggedIn) this.router.navigate(['/home']);
  }

  llenar(m: string, p: string) {
    this.creds.matricula = m;
    this.creds.password  = p;
    this.error.set('');
  }

  onLogin() {
    if (!this.creds.matricula || !this.creds.password) {
      this.error.set('Completa todos los campos');
      return;
    }
    this.cargando.set(true);
    this.error.set('');
    setTimeout(() => {
      const res = this.auth.login(this.creds);
      this.cargando.set(false);
      if (res.ok) {
        this.router.navigate(['/home']);
      } else {
        this.error.set(res.mensaje);
      }
    }, 600);
  }
}