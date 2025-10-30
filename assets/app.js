import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxhd3RrcmFzZmxwaHZjd3hkbmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MzY2NDAsImV4cCI6MjA3MzIxMjY0MH0.A18gO8TBTctb-KcN3Nf8n7dEIXQ_WtwuIr5bKUTUizs";
const CLIENTE_ID = "0825d76a-7fd8-44ef-a9ed-b67a85e6721e";
const SUPABASE_URL = "https://lawtkrasflphvcwxdnlw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxhd3RrcmFzZmxwaHZjd3hkbmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MzY2NDAsImV4cCI6MjA3MzIxMjY0MH0.A18gO8TBTctb-KcN3Nf8n7dEIXQ_WtwuIr5bKUTUizs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    body: document.body,
    yearSpan: document.getElementById("yy"),
    searchForm: document.querySelector(".search"),
    vistaListado: document.getElementById("vista-listado"),
    vistaDetalle: document.getElementById("vista-detalle"),
    gridProfesionales: document.getElementById("grid-profesionales"),
    profName: document.getElementById("prof-name"),
    profInfo: document.getElementById("prof-info"),
    profServicios: document.getElementById("prof-servicios"),
    profTrabajos: document.getElementById("prof-trabajos"),
    btnVolver: document.getElementById("btn-volver"),
    btnContratar: document.getElementById("btn-contratar"),
    btnLogin: document.getElementById("btn-login"),
    btnLogout: document.getElementById("btn-logout"),
    authGreeting: document.getElementById("auth-greeting"),
    modalOverlay: document.getElementById("modal-contratar"),
    modalForm: document.getElementById("form-contratar"),
    modalServiceSelect: document.getElementById("modal-servicio-id"),
    modalProfesionalInput: document.getElementById("modal-profesional-id"),
    modalClienteInput: document.getElementById("modal-cliente-id"),
    modalTitle: document.getElementById("modal-title"),
    lightbox: document.getElementById("lightbox"),
    lightboxImage: document.getElementById("lightbox-image"),
    lightboxCaption: document.getElementById("lightbox-caption"),
  };

  const modalCloseBtn = elements.modalOverlay?.querySelector(".modal-close");
  const modalCancelBtn = elements.modalOverlay?.querySelector("[data-modal-cancel]");
  const lightboxCloseElements = elements.lightbox?.querySelectorAll("[data-lightbox-close]");

  const servicioPlaceholder = '<option value="">Selecciona un servicio</option>';
  const imagenesBase = [
    "./public/static/images/image1.jpg",
    "./public/static/images/image2.png",
    "./public/static/images/image3.jpg",
  ];

  let profesionalActual = null;

  if (elements.yearSpan) {
    elements.yearSpan.textContent = new Date().getFullYear();
  }

  if (elements.modalClienteInput) {
    elements.modalClienteInput.value = CLIENTE_ID;
  }

  elements.searchForm?.addEventListener("submit", (event) => event.preventDefault());

  function renderAuth(user) {
    if (!elements.btnLogin || !elements.btnLogout || !elements.authGreeting) return;
    if (user) {
      const displayName = user.user_metadata?.full_name || user.email || "usuario";
      elements.authGreeting.textContent = `Hola ${displayName}`;
      elements.btnLogin.classList.add("hidden");
      elements.btnLogout.classList.remove("hidden");
    } else {
      elements.authGreeting.textContent = "";
      elements.btnLogin.classList.remove("hidden");
      elements.btnLogout.classList.add("hidden");
    }
  }

  async function handleLogin() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      renderAuth(null);
    } catch (error) {
      alert(error.message);
    }
  }

  function poblarServicios(profesional) {
    if (!elements.modalServiceSelect) return;
    elements.modalServiceSelect.innerHTML = servicioPlaceholder;
    (profesional?.profesional_servicios || []).forEach((rel) => {
      const option = document.createElement("option");
      option.value = rel.servicios.id;
      option.textContent = `${rel.servicios.nombre} - Q${rel.servicios.precio}`;
      elements.modalServiceSelect.appendChild(option);
    });
  }

  function abrirModal() {
    if (!profesionalActual || !elements.modalOverlay) return;
    elements.modalOverlay.classList.remove("hidden");
    elements.modalOverlay.setAttribute("aria-hidden", "false");
    elements.body.style.overflow = "hidden";
    if (elements.modalProfesionalInput) {
      elements.modalProfesionalInput.value = profesionalActual.id;
    }
    if (elements.modalTitle) {
      elements.modalTitle.textContent = `Agendar cita con ${profesionalActual.usuarios.nombre}`;
    }
    poblarServicios(profesionalActual);
  }

  function abrirLightbox(src, caption = "") {
    if (!elements.lightbox || !elements.lightboxImage) return;
    elements.lightboxImage.src = src;
    elements.lightboxImage.alt = caption || "Imagen ampliada";
    if (elements.lightboxCaption) {
      elements.lightboxCaption.textContent = caption;
      elements.lightboxCaption.classList.toggle("hidden", !caption);
    }
    elements.lightbox.classList.remove("hidden");
    elements.lightbox.setAttribute("aria-hidden", "false");
    elements.body.style.overflow = "hidden";
  }

  function cerrarLightbox() {
    if (!elements.lightbox) return;
    elements.lightbox.classList.add("hidden");
    elements.lightbox.setAttribute("aria-hidden", "true");
    if (elements.lightboxImage) {
      elements.lightboxImage.src = "";
      elements.lightboxImage.alt = "";
    }
    if (elements.lightboxCaption) {
      elements.lightboxCaption.textContent = "";
      elements.lightboxCaption.classList.remove("hidden");
    }
    if (!elements.modalOverlay || elements.modalOverlay.classList.contains("hidden")) {
      elements.body.style.overflow = "";
    }
  }

  function cerrarModal() {
    if (!elements.modalOverlay) return;
    elements.modalOverlay.classList.add("hidden");
    elements.modalOverlay.setAttribute("aria-hidden", "true");
    elements.body.style.overflow = "";
    elements.modalForm?.reset();
    if (elements.modalClienteInput) {
      elements.modalClienteInput.value = CLIENTE_ID;
    }
    if (profesionalActual) {
      poblarServicios(profesionalActual);
      if (elements.modalProfesionalInput) {
        elements.modalProfesionalInput.value = profesionalActual.id;
      }
      if (elements.modalTitle) {
        elements.modalTitle.textContent = `Agendar cita con ${profesionalActual.usuarios.nombre}`;
      }
    } else if (elements.modalServiceSelect) {
      elements.modalServiceSelect.innerHTML = servicioPlaceholder;
    }
  }

  async function enviarReserva(event) {
    event.preventDefault();
    if (!elements.modalForm || !profesionalActual) {
      alert("Selecciona un profesional antes de crear una reserva.");
      return;
    }

    const formData = new FormData(elements.modalForm);
    const fechaRaw = formData.get("fecha");
    if (!fechaRaw) {
      alert("Ingresa una fecha y hora válidas.");
      return;
    }

    const payload = {
      cliente_id: formData.get("cliente_id"),
      profesional_id: formData.get("profesional_id"),
      servicio_id: formData.get("servicio_id"),
      fecha: new Date(fechaRaw).toISOString(),
      estado: formData.get("estado"),
      notas: formData.get("notas") || "",
    };

    if (!payload.servicio_id) {
      alert("Selecciona el servicio que deseas reservar.");
      return;
    }

    try {
      const response = await fetch("https://lawtkrasflphvcwxdnlw.supabase.co/functions/v1/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message = errorBody.message || "No se pudo crear la reserva.";
        throw new Error(message);
      }

      alert("Reserva creada con éxito. ¡Te contactaremos pronto!");
      cerrarModal();
    } catch (error) {
      console.error(error);
      alert(error.message || "Ocurrió un error al crear la reserva. Intenta nuevamente.");
    }
  }

  async function cargarProfesionales() {
    if (!elements.gridProfesionales) return;

    try {
      const resp = await fetch("https://lawtkrasflphvcwxdnlw.supabase.co/functions/v1/profesionales", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (!resp.ok) throw new Error("Error al obtener profesionales");

      const { profesionales } = await resp.json();
      elements.gridProfesionales.innerHTML = "";

      const imagenesDisponibles = [...imagenesBase];

      profesionales.forEach((prof) => {
        const imgRandom = imagenesDisponibles.length
          ? imagenesDisponibles.splice(Math.floor(Math.random() * imagenesDisponibles.length), 1)[0]
          : imagenesBase[Math.floor(Math.random() * imagenesBase.length)];

        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
          <div class="thumb">
            <img src="${imgRandom}" alt="">
          </div>
          <div class="content">
            <h3 class="title">${prof.usuarios.nombre} ${prof.usuarios.apellido}</h3>
            <p class="desc">${prof.descripcion}</p>
            <p class="desc">💼 <strong>Experiencia:</strong> ${prof.experiencia} años</p>
            <p class="desc">⭐ <strong>Calificación:</strong> ${prof.calificacion_promedio}</p>
            <button class="btn" type="button">Contratar</button>
          </div>
        `;

        card.addEventListener("click", () => verDetalle(prof.id));
        card.querySelector(".btn")?.addEventListener("click", (event) => {
          event.stopPropagation();
          verDetalle(prof.id);
        });

        elements.gridProfesionales.appendChild(card);
      });
      elements.gridProfesionales.querySelectorAll(".thumb img").forEach((img) => {
        img.addEventListener("click", (event) => {
          event.stopPropagation();
          abrirLightbox(img.src, img.alt || "Profesional destacado");
        });
      });
    } catch (error) {
      console.error(error);
      elements.gridProfesionales.innerHTML = "<p>No se pudieron cargar los profesionales.</p>";
    }
  }

  async function verDetalle(id) {
    if (!elements.vistaListado || !elements.vistaDetalle) return;

    elements.vistaListado.classList.add("hidden");
    elements.vistaDetalle.classList.remove("hidden");

    const resp = await fetch(`https://lawtkrasflphvcwxdnlw.supabase.co/functions/v1/Informaci-n-desplegada?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const { profesional, trabajos } = await resp.json();

    if (!profesional) {
      if (elements.profName) elements.profName.textContent = "Profesional no encontrado";
      return;
    }

    if (elements.profName) {
      elements.profName.textContent = `💅 ${profesional.usuarios.nombre} ${profesional.usuarios.apellido}`;
    }

    if (elements.profInfo) {
      elements.profInfo.innerHTML = `
        <p>💼 <strong>Experiencia:</strong> ${profesional.experiencia} años</p>
        <p>⭐ <strong>Calificación:</strong> ${profesional.calificacion_promedio}</p>
        <p>📍 <strong>Dirección:</strong> ${profesional.direccion}</p>
        <p>📞 <strong>Teléfono:</strong> ${profesional.usuarios.telefono}</p>
        <p>📧 <strong>Email:</strong> ${profesional.usuarios.email}</p>
        <p>${profesional.descripcion}</p>
        <a class="btn-instagram" href="https://www.instagram.com/anny_nails_studio_?igsh=OXcwazJsenVxMDRs" target="_blank" rel="noopener noreferrer">
          <span aria-hidden="true">📸</span>
          Visitar Instagram
        </a>
      `;
    }

    if (elements.profServicios) {
      elements.profServicios.innerHTML = "";
      (profesional.profesional_servicios || []).forEach((rel) => {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
          <div class="content">
            <h3 class="title">💅 ${rel.servicios.nombre}</h3>
            <p class="desc">${rel.servicios.descripcion}</p>
            <p class="desc">⏱️ ${rel.servicios.duracion_minutos} min</p>
            <p class="desc">💵 Q${rel.servicios.precio}</p>
          </div>
        `;
        elements.profServicios.appendChild(card);
      });
    }

    const trabajosLista = Array.isArray(trabajos) ? trabajos : [];
    if (elements.profTrabajos) {
      elements.profTrabajos.innerHTML = "";
      trabajosLista.forEach((trabajo) => {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
          <div class="thumb"><img src="${trabajo.url}" alt="${trabajo.descripcion ?? "Trabajo realizado"}"></div>
          <div class="content"><p class="desc">🎨 ${trabajo.descripcion ?? "Trabajo realizado"}</p></div>
        `;
        elements.profTrabajos.appendChild(card);
      });
      elements.profTrabajos.querySelectorAll(".thumb img").forEach((img) => {
        img.addEventListener("click", (event) => {
          event.stopPropagation();
          abrirLightbox(img.src, img.alt);
        });
      });
    }

    profesionalActual = profesional;
    if (elements.modalProfesionalInput) {
      elements.modalProfesionalInput.value = profesional.id;
    }
    if (elements.modalTitle) {
      elements.modalTitle.textContent = `Agendar cita con ${profesional.usuarios.nombre}`;
    }
    poblarServicios(profesional);
  }

  function volverListado() {
    if (!elements.vistaListado || !elements.vistaDetalle) return;
    elements.vistaDetalle.classList.add("hidden");
    elements.vistaListado.classList.remove("hidden");
  }

  elements.btnLogin?.addEventListener("click", handleLogin);
  elements.btnLogout?.addEventListener("click", handleLogout);
  elements.btnContratar?.addEventListener("click", abrirModal);
  elements.btnVolver?.addEventListener("click", volverListado);
  modalCloseBtn?.addEventListener("click", cerrarModal);
  modalCancelBtn?.addEventListener("click", cerrarModal);
  elements.modalOverlay?.addEventListener("click", (event) => {
    if (event.target === elements.modalOverlay) {
      cerrarModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.modalOverlay && !elements.modalOverlay.classList.contains("hidden")) {
      cerrarModal();
    }
  });
  elements.modalForm?.addEventListener("submit", enviarReserva);
  lightboxCloseElements?.forEach((btn) => btn.addEventListener("click", cerrarLightbox));
  elements.lightbox?.addEventListener("click", (event) => {
    if (event.target === elements.lightbox) {
      cerrarLightbox();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.lightbox && !elements.lightbox.classList.contains("hidden")) {
      cerrarLightbox();
    }
  });

  (async () => {
    const { data: { session } } = await supabase.auth.getSession();
    renderAuth(session?.user ?? null);
  })();

  supabase.auth.onAuthStateChange((_event, session) => {
    renderAuth(session?.user ?? null);
  });

  cargarProfesionales();
});
