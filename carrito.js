document.addEventListener('DOMContentLoaded', () => {
            
    // 1. GENERACIÓN DINÁMICA DE 45 PRODUCTOS
    const contenedorGrid = document.getElementById('contenedor-grid');
    const categoriasPredefinidas = ['sillas', 'sofas', 'mesas'];
    const preciosPredefinidas = [1500, 3200, 4500, 1200, 2800, 5900, 3800, 2100, 8499];
    const nombresPredefinidos = ['Poltrona Velvet', 'Sofá Oxford Gris', 'Sillón Classic Blue', 'Silla Escandinava', 'Sillón Minimalist', 'Sofá Chester Petite', 'Mesa Vintage Wood', 'Mesa Nórdica Premium', 'Sillón de Lectura Loft'];

    for (let i = 1; i <= 45; i++) {
        const indexImg = ((i - 1) % 6) + 1; 
        const categoria = categoriasPredefinidas[(i - 1) % categoriasPredefinidas.length];
        const precio = preciosPredefinidas[(i - 1) % preciosPredefinidas.length];
        const nombre = `${nombresPredefinidos[(i - 1) % nombresPredefinidos.length]} N°${i}`;
        
        let tagOferta = '';
        if(i % 5 === 0) tagOferta = `<span style="position: absolute; top: 15px; left: 15px; background-color: #FF3C2A; color: #fff; padding: 3px 10px; font-size: 11px; border-radius: 5px; font-weight: 600; text-transform: uppercase;">Más Vendido</span>`;
        else if(i % 3 === 0) tagOferta = `<span style="position: absolute; top: 15px; left: 15px; background-color: #28a745; color: #fff; padding: 3px 10px; font-size: 11px; border-radius: 5px; font-weight: 600; text-transform: uppercase;">Oferta</span>`;

        const prodHTML = `
            <div class="ofert-1 item-producto" data-categoria="${categoria}" data-precio="${precio}" style="position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid #eee; padding: 15px; border-radius: 8px; background: #fff; box-shadow:0 2px 8px rgba(0,0,0,0.02)">
                ${tagOferta}
                <img src="images/${indexImg}.png" alt="${nombre}" style="width: 100%; height: auto; object-fit: cover;">
                <div class="product-txt">
                    <h3 style="font-size: 18px; margin-top: 10px; margin-bottom:5px; font-weight: bold; color: #181818;">${nombre}</h3>
                    <p style="color: #71717a; font-size: 14px; margin-bottom: 5px; margin-top:0;">Colección exclusiva de catálogo</p>
                    <p style="color: #28a745; font-size: 13px; margin-bottom: 10px; font-weight: 500; margin-top:0;">Original de Línea</p>
                    <p class="precio" style="font-size: 20px; margin-bottom: 15px; font-weight: bold; color: #181818; margin-top:0;">$${precio} MXN</p>
                    <a href="#" class="agregar-carrito btn-3" data-id="${i}">Agregar al carrito</a>
                </div>
            </div>
        `;
        contenedorGrid.insertAdjacentHTML('beforeend', prodHTML);
    }

    // Selectores
    const productos = Array.from(document.querySelectorAll('.item-producto'));
    const enlacesCat = document.querySelectorAll('.filtro-cat');
    const enlacesPrecio = document.querySelectorAll('.filtro-precio');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const contador = document.getElementById('contador-productos');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const contenedorNumeros = document.getElementById('numeros-paginacion');
    const resultadosHeader = document.getElementById('resultados-header');

    let categoriaActiva = 'all';
    let precioActivo = 'all';
    let paginaActual = 1;
    const productosPorPagina = 9; 
    let totalPaginas = 1;

    // 2. LÓGICA DE FILTRADO Y PAGINACIÓN OPTIMIZADA
    function filtrarYVer(scroll = false) {
        const productosFiltrados = productos.filter(prod => {
            const cat = prod.getAttribute('data-categoria');
            const precio = parseFloat(prod.getAttribute('data-precio'));

            const cumpleCat = (categoriaActiva === 'all' || cat === categoriaActiva);
            
            let cumplePrecio = true;
            if (precioActivo === 'bajo') cumplePrecio = (precio <= 150);
            else if (precioActivo === 'medio') cumplePrecio = (precio > 150 && precio <= 300);
            else if (precioActivo === 'alto') cumplePrecio = (precio > 300);

            return cumpleCat && cumplePrecio;
        });

        const totalProductos = productosFiltrados.length;
        totalPaginas = Math.ceil(totalProductos / productosPorPagina) || 1;
        
        if (paginaActual > totalPaginas) paginaActual = totalPaginas;

        const inicio = (paginaActual - 1) * productosPorPagina;
        const fin = inicio + productosPorPagina;

        if (totalProductos > 0) {
            contador.textContent = `Mostrando ${inicio + 1}-${Math.min(fin, totalProductos)} de ${totalProductos} producto(s)`;
        } else {
            contador.textContent = "No se encontraron productos";
        }

        productos.forEach(p => p.style.display = 'none');
        productosFiltrados.slice(inicio, fin).forEach(p => p.style.display = 'flex');

        actualizarPaginador();

        if (scroll && resultadosHeader) {
            resultadosHeader.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function actualizarPaginador() {
        contenedorNumeros.innerHTML = '';

        for (let i = 1; i <= totalPaginas; i++) {
            const activeStyle = (i === paginaActual) 
                ? 'background-color: #FF3C2A; color: #fff; border-color: #FF3C2A; font-weight: 600;' 
                : 'background-color: #fff; color: #181818; border-color: #ccc;';

            const numLink = `
                <a href="#" class="btn-pag num-pag" data-pagina="${i}" style="padding: 10px 15px; border: 1px solid; border-radius: 5px; font-size: 14px; text-decoration: none; ${activeStyle}">${i}</a>
            `;
            contenedorNumeros.insertAdjacentHTML('beforeend', numLink);
        }

        document.querySelectorAll('.num-pag').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                paginaActual = parseInt(btn.getAttribute('data-pagina'));
                filtrarYVer(true);
            });
        });
    }

    btnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        if (paginaActual > 1) { paginaActual--; filtrarYVer(true); }
    });

    btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        if (paginaActual < totalPaginas) { paginaActual++; filtrarYVer(true); }
    });

    enlacesCat.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            enlacesCat.forEach(el => { el.style.color = '#4b4b4b'; el.style.fontWeight = 'normal'; });
            enlace.style.color = '#FF3C2A';
            enlace.style.fontWeight = 'bold';
            categoriaActiva = enlace.getAttribute('data-cat');
            paginaActual = 1;
            filtrarYVer(true);
        });
    });

    enlacesPrecio.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            enlacesPrecio.forEach(el => { el.style.color = '#4b4b4b'; el.style.fontWeight = 'normal'; });
            enlace.style.color = '#FF3C2A';
            enlace.style.fontWeight = 'bold';
            precioActivo = enlace.getAttribute('data-rango');
            paginaActual = 1;
            filtrarYVer(true);
        });
    });

    btnLimpiar.addEventListener('click', () => {
        categoriaActiva = 'all'; precioActivo = 'all'; paginaActual = 1;
        enlacesCat.forEach(el => { el.style.color = '#4b4b4b'; el.style.fontWeight = 'normal'; });
        enlacesPrecio.forEach(el => { el.style.color = '#4b4b4b'; el.style.fontWeight = 'normal'; });
        
        const catAll = document.querySelector('[data-cat="all"]');
        const rangoAll = document.querySelector('[data-rango="all"]');
        if(catAll) { catAll.style.color = '#FF3C2A'; catAll.style.fontWeight = 'bold'; }
        if(rangoAll) { rangoAll.style.color = '#FF3C2A'; rangoAll.style.fontWeight = 'bold'; }
        
        filtrarYVer(true);
    });

    // 3. LÓGICA DEL CARRITO DE COMPRAS
    const carritoMenu = document.getElementById('carrito');
    const imgCarrito = document.getElementById('img-carrito');
    const listaCarrito = document.querySelector('#lista-carrito tbody');
    const btnVaciarCarrito = document.getElementById('vaciar-carrito');
    const btnProcesarCompra = document.getElementById('procesar-compra');

    // FUNCIONES DE PERSISTENCIA
    function guardarCarrito() {
        localStorage.setItem('carrito', listaCarrito.innerHTML);
    }
    function cargarCarrito() {
        const guardado = localStorage.getItem('carrito');
        if (guardado) {
            listaCarrito.innerHTML = guardado;
            // Re-asignar eventos a los botones X cargados
            reAsignarEventosBorrar();
        }
    }
    function reAsignarEventosBorrar() {
        listaCarrito.querySelectorAll('.borrar-producto').forEach(btn => {
            btn.addEventListener('mouseover', (e) => e.target.style.color = '#FF3C2A');
            btn.addEventListener('mouseout', (e) => e.target.style.color = '#a1a1aa');
        });
    }

    imgCarrito.addEventListener('click', (e) => {
        e.stopPropagation();
        carritoMenu.style.display = (carritoMenu.style.display === 'block') ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
        if (!carritoMenu.contains(e.target) && e.target !== imgCarrito && !e.target.classList.contains('agregar-carrito')) {
            carritoMenu.style.display = 'none';
        }
    });

    contenedorGrid.addEventListener('click', (e) => {
        if(e.target.classList.contains('agregar-carrito')) {
            e.preventDefault();
            
            const cardProducto = e.target.closest('.item-producto');
            const infoProducto = {
                imagen: cardProducto.querySelector('img').src,
                titulo: cardProducto.querySelector('h3').textContent,
                precio: cardProducto.querySelector('.precio').textContent,
                precioNumerico: parseFloat(cardProducto.getAttribute('data-precio')),
                id: e.target.getAttribute('data-id')
            }
            insertarCarrito(infoProducto);
            calcularTotal();
            guardarCarrito(); // Guardamos tras agregar
        }
    });

    function insertarCarrito(prod) {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #f4f4f5';
        row.setAttribute('data-precio', prod.precioNumerico);
        row.innerHTML = `
            <td style="padding: 8px 5px;"><img src="${prod.imagen}" width="45" style="border-radius:4px; display:block;"></td>
            <td style="font-size: 13px; padding: 8px 5px; color:#18181b; font-weight:500;">${prod.titulo}</td>
            <td style="font-size: 13px; padding: 8px 5px; font-weight:bold; color:#18181b;">${prod.precio}</td>
            <td style="padding: 8px 5px; text-align:center;"><a href="#" class="borrar-producto" data-id="${prod.id}" style="color: #a1a1aa; text-decoration: none; font-weight: bold; font-size:18px; transition:color 0.2s;">&times;</a></td>
        `;
        
        row.querySelector('.borrar-producto').addEventListener('mouseover', (e) => e.target.style.color = '#FF3C2A');
        row.querySelector('.borrar-producto').addEventListener('mouseout', (e) => e.target.style.color = '#a1a1aa');
        
        listaCarrito.appendChild(row);
    }

    function calcularTotal() {
        const filas = listaCarrito.querySelectorAll('tr');
        let total = 0;
        filas.forEach(fila => {
            const precio = parseFloat(fila.getAttribute('data-precio')) || 0;
            total += precio;
        });
        document.getElementById('total-carrito').textContent = `$${total} MXN`;
    }

    carritoMenu.addEventListener('click', (e) => {
        if(e.target.classList.contains('borrar-producto')) {
            e.preventDefault();
            e.stopPropagation(); 
            e.target.closest('tr').remove();
            calcularTotal();
            guardarCarrito(); // Guardamos tras borrar
        }
    });

    btnVaciarCarrito.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        listaCarrito.innerHTML = '';
        calcularTotal();
        guardarCarrito(); // Guardamos tras vaciar
    });

    btnProcesarCompra.addEventListener('click', (e) => {
        e.preventDefault();
        if(listaCarrito.children.length === 0) {
            alert('El carrito está vacío. ¡Agrega productos del catálogo primero!');
        } else {
            alert('¡Gracias por tu preferencia! Redirigiendo a pasarela de pago segura...');
            listaCarrito.innerHTML = '';
            calcularTotal();
            guardarCarrito(); // Guardamos tras limpiar
            carritoMenu.style.display = 'none';
        }
    });

    // Inicializar la vista de productos y cargar el carrito al cargar la página
    filtrarYVer();
    cargarCarrito();
    calcularTotal();
});

