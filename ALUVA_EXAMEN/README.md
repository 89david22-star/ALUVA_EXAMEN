# 🛒 ALUVA - Proyecto de Examen

¡Bienvenido al repositorio oficial de **ALUVA**! Este sitio web ha sido desarrollado como parte de la evaluación práctica de la asignatura, aplicando de manera estricta los estándares de diseño web semántico, accesibilidad y manipulación dinámica del DOM mediante JavaScript.

---

## 🚀 Despliegue en Vivo
El sitio web se encuentra completamente operativo, optimizado y desplegado en la plataforma de hosting en la nube **Netlify**. 

🔗 **[VER SITIO DESPLEGADO EN NETLIFY](https://netlify.app)** *(Nota: Reemplaza este enlace por la URL real que te entregue Netlify al subir tu proyecto)*

---

## 🛠️ Tecnologías Utilizadas y Buenas Prácticas Aplicadas

Para este proyecto se implementaron las siguientes directrices basadas en los manuales de estudio de la asignatura:

*   **HTML5 Semántico:** Organización del contenido utilizando etiquetas estructurales correctas (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) para garantizar un código limpio y mejorar el posicionamiento SEO.
*   **Accesibilidad y Estándares Web:** Incorporación obligatoria del atributo `alt` en todos los recursos gráficos (imágenes) y enlaces relativos válidos en todo el sitio para asegurar la compatibilidad con lectores de pantalla.
*   **CSS3 e Interatividad:** Estilos modernos y adaptables (Responsive Design) con efectos visuales interactivos mediante pseudoclases (`:hover`, `:blur`) para botones de acción.
*   **Manipulación Dinámica del DOM (JavaScript):**
    *   Uso de selectores del DOM oficiales (`document.getElementById`).
    *   Validación en frontend de formularios de contacto mediante la captura de eventos clave como `blur` (validación en tiempo real cuando el usuario sale del input) y `submit` (prevención del envío automático mediante `event.preventDefault()` hasta que los datos sean correctos).
*   **Integración de Canales de Atención:** Inclusión de un enlace directo y botón flotante interactivo enlazado a la API oficial de WhatsApp (`wa.me`) para soporte inmediato.

---

## 📁 Estructura del Repositorio

El proyecto mantiene una organización rigurosa de carpetas y archivos en su raíz:

```text
ALUVA_EVALUACION/
├── css/
│   └── style.css          # Hoja de estilos con diseños interactivos de WhatsApp y formulario
├── js/
│   └── script.js          # Lógica de JavaScript para validación dinámica del DOM
├── img/
│   ├── bandana-negra.jpeg # Recursos gráficos optimizados del catálogo
│   └── ...                # Demás imágenes del proyecto
├── index.html             # Documento HTML principal estructurado de forma semántica
└── README.md              # Documentación del proyecto (Este archivo)
```

---

## 👥 Integrantes del Grupo
*   **[David Salinas]** - *Desarrollador Frontend / Integración de WhatsApp y CSS / Documentación*
*   **[Miguel Saez]** - *Desarrollador JavaScript / Validaciones y Lógica del DOM / Control de Calidad y Despliegue*

---
*Nota: Este proyecto fue desarrollado con fines exclusivamente académicos de acuerdo con las instrucciones de la evaluación institucional.*
