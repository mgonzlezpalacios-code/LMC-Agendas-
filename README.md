# Laboratorio de Materia Condensada · EPN

Panel web (SPA) del Laboratorio de Materia Condensada de la Escuela Politécnica Nacional.
React + Vite + Tailwind CSS + Framer Motion.

## Secciones

- **Inicio**: bienvenida con red de grafeno animada, indicadores y lo último registrado.
- **Mantenimiento**: cronograma semanal de tareas de mantenimiento (Myriam y Kevin, 26 semanas).
- **Bitácora**: bloc de notas para apuntes, experimentos y protocolos, con búsqueda y exportación a JSON.
- **Agenda**: eventos, visitas, capacitaciones y llegada de equipos; cualquiera puede agregar, editar o eliminar.
- **Noticias**: noticias editables y enlace a Instagram.
- **Datos curiosos**: carrusel "¿Sabías que…?" sobre nanomateriales.

## Desarrollo

```bash
npm install
npm run dev
```

`npm run build` genera el sitio estático en `dist/`.

## Datos

Las noticias, eventos y notas iniciales (de ejemplo), los datos curiosos y el enlace de Instagram
están en `src/data/mock.js`. El cronograma está en `src/data/cronograma.json`, generado desde
`Cronograma_LMC_Myriam_Kevin.xlsx` (si cambia el Excel hay que regenerarlo); la app muestra solo
la sección de mantenimiento.

Todo lo que se agrega o edita en la app (notas, noticias, agenda, tareas marcadas) se guarda en el
LocalStorage del navegador de cada dispositivo: **no se comparte entre usuarios ni teléfonos**.
Para que todos vean los mismos datos hace falta un backend (por ejemplo Firebase o Supabase).

## Publicar en GitHub Pages

1. Sube el proyecto a un repositorio de GitHub (rama `main`).
2. En el repositorio: **Settings → Pages → Source: GitHub Actions**.
3. Cada `push` a `main` ejecuta `.github/workflows/deploy.yml` y publica el sitio.

## Instalar en el teléfono

Abre la dirección de GitHub Pages y:

- **iPhone/iPad (Safari)**: Compartir → *Agregar a inicio*.
- **Android (Chrome)**: menú ⋮ → *Agregar a pantalla principal* / *Instalar app*.
