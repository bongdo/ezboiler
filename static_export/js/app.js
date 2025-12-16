document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuButton = document.querySelector('button.lg\\:hidden');
    const mobileMenu = document.querySelector('.lg\\:hidden.overflow-hidden');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileMenu.style.maxHeight !== '0px' && mobileMenu.style.maxHeight !== '';
            
            if (isOpen) {
                mobileMenu.style.maxHeight = '0px';
                mobileMenu.style.opacity = '0';
            } else {
                mobileMenu.style.maxHeight = '500px'; // Approximate height
                mobileMenu.style.opacity = '1';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !menuButton.contains(e.target)) {
                mobileMenu.style.maxHeight = '0px';
                mobileMenu.style.opacity = '0';
            }
        });
    }

    // SPA Routing
    const views = {
        'home': document.getElementById('view-home'),
        'catalog': document.getElementById('view-home'), // Catalog content is on home page in this static export
        'flushing': document.getElementById('view-flushing'),
        'cart': document.getElementById('view-cart')
    };

    function showView(viewName) {
        // Hide all views
        Object.values(views).forEach(el => {
            if (el) el.classList.add('hidden');
        });

        // Show specific view
        const view = views[viewName] || views['home'];
        if (view) view.classList.remove('hidden');

        // Scroll to top
        window.scrollTo(0, 0);
        
        // Close mobile menu if open
        if (mobileMenu) {
             mobileMenu.style.maxHeight = '0px';
             mobileMenu.style.opacity = '0';
        }
    }

    function handleNavigation(e) {
        // Find closest anchor tag
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Skip external links
        if (href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) return;

        // Map hrefs to view names
        let viewName = null;
        if (href.includes('catalog') || href === '/catalog') viewName = 'catalog';
        else if (href.includes('flushing') || href === '/flushing') viewName = 'flushing';
        else if (href.includes('cart') || href === '/cart') viewName = 'cart';
        else if (href.includes('index.html') || href === '/' || href === '') viewName = 'home';
        
        if (viewName) {
            e.preventDefault();
            showView(viewName);
            history.pushState(null, null, '#' + viewName);
        }
    }

    document.addEventListener('click', handleNavigation);

    // Initial Load
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && views[initialHash]) {
        showView(initialHash);
    } else {
        showView('home');
    }

    // History Navigation
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.replace('#', '');
        if (hash && views[hash]) {
            showView(hash);
        } else {
            showView('home');
        }
    });

    // Brand Filter Handling (Mock functionality for Catalog)
    // If we are on catalog view, we might want to handle filters
    // largely this is about showing the catalog view mainly.
});
