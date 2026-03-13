import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="hero">
      <div class="uasd-badge">UASD · Primada de América</div>
      <h1>Plataforma de Carreras y Pensum</h1>
      <p class="sub">Diseño, evaluación y validación de planes de estudio<br>Presencial · Semipresencial · Virtual</p>
      <div class="hero-btns">
        <a routerLink="/carreras"    class="btn-p">Ver Carreras</a>
        <a routerLink="/calculadora" class="btn-o">Calculadora de Horas</a>
      </div>
    </div>

    <div class="features">
      <div class="fc">
        <div class="icon">📋</div>
        <h3>Plan de Estudios</h3>
        <p>Visualiza el pensum completo semestre a semestre.</p>
        <a routerLink="/pensum/informatica" class="btn-s">Ver Informática</a>
      </div>
      <div class="fc">
        <div class="icon">🧮</div>
        <h3>Calculadora de Horas</h3>
        <p>Calcula HT · HP · HIV · HPV · HI según modalidad y créditos.</p>
        <a routerLink="/calculadora" class="btn-s">Calcular</a>
      </div>
      <div class="fc">
        <div class="icon">📊</div>
        <h3>Validación por Nivel</h3>
        <p>Verifica requisitos para Técnico, Grado o Postgrado.</p>
        <a routerLink="/calculadora" class="btn-s">Validar</a>
      </div>
      <div class="fc">
        <div class="icon">📂</div>
        <h3>Carga desde Excel/CSV</h3>
        <p>Importa asignaturas o digita manualmente cada línea.</p>
        <a routerLink="/calculadora" class="btn-s">Importar</a>
      </div>
    </div>

    <div class="banner">
      <div class="bi"><span class="n">3</span><span class="l">Modalidades</span></div>
      <div class="bi"><span class="n">3</span><span class="l">Niveles Académicos</span></div>
      <div class="bi"><span class="n">5</span><span class="l">Tipos de Horas</span></div>
      <div class="bi"><span class="n">1 CR</span><span class="l">= 15HT / 30HP / 45HI</span></div>
    </div>
  `,
  styles: [`
    .hero { background:linear-gradient(160deg,#1a365d,#2a6496,#3182ce); color:white; padding:5rem 2rem 4rem; text-align:center; }
    .uasd-badge { display:inline-block; background:rgba(255,255,255,0.15); padding:4px 16px; border-radius:20px; font-size:0.8rem; margin-bottom:1rem; }
    h1 { font-size:2.4rem; font-weight:800; margin-bottom:1rem; }
    .sub { font-size:1.05rem; opacity:0.85; margin-bottom:2rem; line-height:1.7; }
    .hero-btns { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; }
    .btn-p,.btn-o,.btn-s { padding:0.6rem 1.5rem; border-radius:8px; font-weight:600; text-decoration:none; font-size:0.9rem; transition:all 0.2s; }
    .btn-p { background:white; color:#1a365d; }
    .btn-o { background:transparent; color:white; border:2px solid rgba(255,255,255,0.6); }
    .btn-s { display:inline-block; background:#2b6cb0; color:white; padding:0.4rem 1rem; border-radius:6px; font-size:0.85rem; }
    .features { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1.5rem; padding:3rem 2rem; max-width:1100px; margin:0 auto; }
    .fc { background:white; border-radius:12px; padding:1.8rem; box-shadow:0 2px 12px rgba(0,0,0,0.07); text-align:center; transition:transform 0.2s; }
    .fc:hover { transform:translateY(-4px); }
    .icon { font-size:2.5rem; margin-bottom:0.8rem; }
    h3 { font-size:1rem; color:#1a365d; margin-bottom:0.5rem; }
    p { color:#718096; font-size:0.88rem; margin-bottom:1.2rem; }
    .banner { background:#1a365d; display:flex; justify-content:center; gap:3rem; flex-wrap:wrap; padding:2.5rem 2rem; }
    .bi { text-align:center; }
    .n { display:block; font-size:2rem; font-weight:800; color:#63b3ed; }
    .l { font-size:0.78rem; color:rgba(255,255,255,0.7); text-transform:uppercase; letter-spacing:1px; }
  `]
})
export class HomeComponent {}