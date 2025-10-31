# Nails Finder

Aplicación web enfocada en conectar clientes con profesionales de manicura, permitiéndoles explorar perfiles destacados, conocer sus servicios y agendar citas directamente desde la plataforma.

---

## Tabla de contenidos
- [Características principales](#características-principales)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Configuración del entorno](#configuración-del-entorno)
- [Ejecución local](#ejecución-local)
- [Uso de la aplicación](#uso-de-la-aplicación)
- [Integración con Supabase](#integración-con-supabase)
- [Mejoras futuras](#mejoras-futuras)

---

## Características principales
- Listado dinámico de profesionales con datos reales provenientes de funciones de Supabase.
- Vista de detalle (tras iniciar sesión) con información de contacto, servicios ofrecidos e imágenes de trabajos previos.
- Modal de reserva para solicitar citas con envío directo al endpoint de Supabase.
- Asociación única de imágenes locales a cada card de profesional para evitar repeticiones.
- Enlace directo al perfil de Instagram de cada profesional.
- Inicio de sesión con Google usando Supabase Auth y saludo personalizado en la navegación.
- Lightbox para ampliar las fotografías de trabajos realizados o imágenes de profesionales.
- Modales informativos para "Sobre nosotros" y "Términos" en el pie de página, más una alerta de confirmación al agendar.
- Formulario de contacto con confirmación y acceso directo a WhatsApp.

---

## Tecnologías utilizadas
- **HTML5** para la estructura de la aplicación.
- **CSS3** (archivo `assets/styles.css`) para estilos y layout responsivo.
- **JavaScript Vanilla** para el consumo de APIs, manipulación del DOM y lógica del modal.
- **Supabase Edge Functions** para la obtención de profesionales y creación de reservas.

---

## Estructura del proyecto
```
Proyecto Nails Finder/
├── assets/
│   ├── styles.css          # Estilos globales
│   └── ...                 # Otros assets originales
├── public/
│   └── static/
│       └── images/         # Imágenes utilizadas en las cards de profesionales
├── index.html              # Entrada principal de la aplicación
└── README.md               # Documentación del proyecto
```

---

## Configuración del entorno
1. Clona o descarga este repositorio.
2. Asegúrate de contar con un navegador moderno (Chrome, Firefox, Edge, Safari) para ejecutar la aplicación.
3. Configura en `assets/app.js` las constantes `SUPABASE_URL` y `SUPABASE_ANON_KEY` con los valores de tu proyecto Supabase para habilitar el login con Google.
4. Actualiza la constante `TOKEN` en `assets/app.js` por un JWT válido (emitido por Supabase) para consumir las funciones edge.
5. Si deseas utilizar otro `cliente_id` por defecto para las reservas, actualiza la constante `CLIENTE_ID` en `assets/app.js`.

> **Nota:** El token actual dentro del repositorio es únicamente de ejemplo. Reemplázalo por uno gestionado por tu proyecto en Supabase.

---

## Ejecución local
1. Abre el archivo `index.html` directamente en el navegador o levanta un servidor estático (por ejemplo, con `npx serve`, `http-server`, `live-server`, etc.).
2. Verifica que las peticiones a Supabase respondan correctamente. Si trabajas desde `http://localhost`, confirma que tu política de CORS en Supabase permita ese origen.

---

## Uso de la aplicación
1. **Explorar profesionales:** al cargar la página se muestran cards con información general y una imagen asignada de forma única.
2. **Iniciar sesión con Google:** desde la barra superior pulsa “Inicia sesión con Google”. Una vez autenticado, verás un saludo y tendrás disponible el botón de “Cerrar sesión”.
3. **Ver detalle:** después de iniciar sesión haz clic en una card o en el botón “Contratar” para abrir la vista de detalles del profesional.
4. **Visitar Instagram:** usa el botón “Visitar Instagram” dentro del detalle para abrir la red social en una pestaña nueva.
5. **Ampliar imágenes:** haz clic en cualquier fotografía de profesional o trabajo para verla en grande; usa el botón de cierre o la tecla `Escape` para volver.
6. **Consultar información institucional:** en el pie de página, “Sobre nosotros” y “Términos” despliegan modales con información relevante, e “Instagram” abre el perfil oficial.
7. **Agendar cita:** pulsa “Contratar ahora” para abrir el modal, completa los datos requeridos (el ID de cliente se muestra bloqueado), selecciona el estado y envía la reserva. Se mostrará una alerta con opciones para cerrar o contactar a la manicurista por WhatsApp.
8. **Escribir al equipo:** desde el menú superior, “Contacto” abre un formulario para enviar tu mensaje; al enviarlo se muestra un saludo y un enlace directo a WhatsApp.

---

## Integración con Supabase
- **Profesionales:** `GET https://lawtkrasflphvcwxdnlw.supabase.co/functions/v1/profesionales`
- **Detalle profesional:** `GET https://lawtkrasflphvcwxdnlw.supabase.co/functions/v1/Informaci-n-desplegada?id={profesional_id}`
- **Reservas:** `POST https://lawtkrasflphvcwxdnlw.supabase.co/functions/v1/reservas`
- **Autenticación:** `supabase.auth.signInWithOAuth({ provider: "google" })` usando el SDK oficial (`@supabase/supabase-js`).

Todas las solicitudes requieren el encabezado `Authorization: Bearer <TOKEN>` y `Content-Type: application/json`.

Payload esperado para crear una reserva:
```json
{
  "cliente_id": "UUID",
  "profesional_id": "UUID",
  "servicio_id": "UUID",
  "fecha": "2025-11-15T10:00:00Z",
  "estado": "pendiente",
  "notas": "Mensaje opcional"
}
```

---

## Mejoras futuras
- Registro e inicio de sesión de usuarios para manejar el `cliente_id` de forma automática.
- Gestión de disponibilidad de horarios por profesional.
- Panel administrativo para profesionales (actualización de servicios, precios e imágenes).
- Internacionalización de textos y soporte multimoneda.

---

¡Gracias por revisar Nails Finder! Para dudas o sugerencias, abre un issue o contacta al equipo desarrollador.
