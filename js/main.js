document.addEventListener('DOMContentLoaded', function () {
    const hamburgerButton = document.getElementById('hamburger-button');
    const menuList = document.getElementById('menu-list');

    if (hamburgerButton && menuList) {
        hamburgerButton.addEventListener('click', function () {
            const isActive = menuList.classList.contains('is-active');

            // Alternar clases para animación y visibilidad
            this.classList.toggle('is-active');
            menuList.classList.toggle('is-active');

            // Actualizar atributos ARIA
            if (isActive) { // Si ANTES estaba activo, ahora se cierra
                this.setAttribute('aria-expanded', 'false');
                this.setAttribute('aria-label', 'Abrir menú');
            } else { // Si ANTES estaba inactivo, ahora se abre
                this.setAttribute('aria-expanded', 'true');
                this.setAttribute('aria-label', 'Cerrar menú');
            }
        });

        // Opcional: Cerrar el menú si se hace clic en un enlace (móvil)
        menuList.querySelectorAll('a.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768 && menuList.classList.contains('is-active')) {
                    hamburgerButton.classList.remove('is-active');
                    menuList.classList.remove('is-active');
                    hamburgerButton.setAttribute('aria-expanded', 'false');
                    hamburgerButton.setAttribute('aria-label', 'Abrir menú');
                }
            });
        });
    } else {
        // Esto te ayudará a saber si los elementos no se encontraron
        // console.error("No se encontró el botón de hamburguesa o la lista del menú.");
    }
});