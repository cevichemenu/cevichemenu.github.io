const API_URL = "https://script.google.com/macros/s/AKfycbzjEcf-sZHgRyglko_8FHl3TsC1Gjngnd11dkI31kd7eEUhZOLkjr9qFdLEyxtHz7gg/exec";

document.addEventListener("DOMContentLoaded", () => {
    cargarMenu();
});

async function cargarMenu() {
    const contenedor = document.getElementById("contenedor-menu");
    
    try {
        const respuesta = await fetch(API_URL);
        const datos = await respuesta.json();
        
        contenedor.innerHTML = ""; // Limpiar mensaje temporal
        
        datos.forEach((item, index) => {
            const esOferta = item.oferta && item.oferta.toUpperCase() === 'SI';
            
            const tarjetaHtml = `
            <article class="card fade-in ${esOferta ? 'oferta-especial' : ''}">
                ${esOferta ? '<div class="badge-oferta">PROMOCIÓN</div>' : ''}
                <div class="card-image-box">
                    <img src="${item.imagen || 'imag/tradia.webp'}" alt="Ceviche ${item.nombre}" class="card-image">
                    <div class="overlay"></div>
                </div>
                <div class="card-content">
                    <h2 class="card-title">${item.nombre}</h2>
                    <p class="card-desc">${item.descripcion}</p>
                    <span class="presentation-label">Presentación</span>
                    <div class="sizes-box">
                        <div class="size-pill">
                            <span class="size-name">Personal</span>
                            <span class="size-weight">$${item.precio_p}</span>
                        </div>
                        <div class="size-pill">
                            <span class="size-name">Mediano</span>
                            <span class="size-weight">$${item.precio_m}</span>
                        </div>
                        <div class="size-pill">
                            <span class="size-name">Familiar</span>
                            <span class="size-weight">$${item.precio_f}</span>
                        </div>
                    </div>
                </div>
            </article>`;
            
            contenedor.innerHTML += tarjetaHtml;
        });

        inicializarInteracciones();
    } catch (error) {
        console.error("Error al cargar el menú:", error);
        contenedor.innerHTML = "<p>Error al cargar el menú. Por favor intenta más tarde.</p>";
    }
}

function inicializarInteracciones() {
    // Intersection Observer for smooth reveal animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el, index) => {
        // Add a slight stagger effect based on element index
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Add touch interactions for the mobile pills to give a nice tactile feedback effect
    const sizePills = document.querySelectorAll('.size-pill');
    sizePills.forEach(pill => {
        pill.addEventListener('touchstart', () => {
            pill.style.transform = 'scale(0.98)';
        });
        pill.addEventListener('touchend', () => {
            pill.style.transform = 'scale(1)';
        });
    });
}
