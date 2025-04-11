// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du menu hamburger pour mobile
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');

    if (burger) {
        burger.addEventListener('click', function() {
            // Toggle nav
            nav.classList.toggle('nav-active');
            // Animation du burger
            this.classList.toggle('toggle');
        });
    }

    // Animation au scroll pour les éléments avec data-aos
    const elementsToAnimate = document.querySelectorAll('[data-aos]');

    if (elementsToAnimate.length > 0) {
        function checkVisibility() {
            elementsToAnimate.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight * 0.85;

                if (elementPosition < screenPosition) {
                    element.classList.add('animated');
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        }

        // Initialiser le style des éléments à animer
        elementsToAnimate.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        // Vérifier la visibilité initiale
        window.addEventListener('load', checkVisibility);

        // Vérifier lors du défilement
        window.addEventListener('scroll', checkVisibility);
    }

    // Ajout d'une animation simple pour la page d'accueil
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.opacity = '0';
        heroSection.style.transition = 'opacity 1s ease';

        setTimeout(() => {
            heroSection.style.opacity = '1';
        }, 200);
    }

    // Gestion des liens de pagination
    const paginationLinks = document.querySelectorAll('.page-link');
    if (paginationLinks.length > 0) {
        paginationLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                // Retirer la classe active de tous les liens
                paginationLinks.forEach(l => {
                    l.classList.remove('active');
                });

                // Ajouter la classe active au lien cliqué
                if (!this.classList.contains('next')) {
                    this.classList.add('active');
                }

                // Simuler un chargement de page (à remplacer par votre logique réelle)
                console.log('Page demandée : ' + this.textContent);
            });
        });
    }
});