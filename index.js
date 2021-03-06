const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const API_KEY = "b1ee9360739b9c7554ec7be096d4d06f";
const BASE_URL = "https://gateway.marvel.com/v1/public";

let paginaActual = 0;
let offset = 0;
let ultimaBusqueda = "";
let comicEncontrado = {};

const formulario = $(".formulario");
const seccionPrincipal = $(".seccion-principal");
const resultadosTitulo = $(".resultados-titulo-contenedor");
const cantidadDeResultados = $(".cantidad-resultados");
const contenedorDeCards = $(".resultados-cards-contenedor");
const loader = $(".loader-contenedor");
const selectMasNuevos = $(".nuevos");
const selectMasViejos = $(".viejos");
const selectTipo = $("#tipo");
const selectOrden = $("#orden");
const paginaActualHTML = $(".pagina-actual")
const paginasTotalesHTML = $(".paginas-totales")
const paginaActualContenedor = $(".pagina-actual-contenedor")

/**   BOTONES DE PAGINACION  */

const pagAnterior = $(".pagina-anterior");
const pagSiguiente = $(".pagina-siguiente");
const pagPrimera = $(".pagina-primera");
const pagUltima = $(".pagina-ultima");
const botonesPaginacion = $$(".paginacion-btn");

/**  RUTAS */

const getComics = `${BASE_URL}/comics?apikey=${API_KEY}`;
const getPersonajes = `${BASE_URL}/characters?apikey=${API_KEY}`;

/**  FUNCIONES GENERALES  */

const construirURL = (endpoint, queryParams) => {
  return `${endpoint}${queryParams}`;
};

const actualizarQueryParams = (query) => {
  let queryParams = `&offset=${offset}`;
  queryParams += query;
  return queryParams;
};

const actualizarOffset = () => {
  offset = paginaActual * 20;
};

const actualizarNroDePagina = (masOmenos) => {
  paginaActual = paginaActual + masOmenos;
  actualizarOffset();
};

const borrarContenidoHTML = (elemento) => {
  // preferimos comillas simples o dobles para strings vacios, 
  // o strings que no tienen variables dentro 
  elemento.innerHTML = ``;
};

const ocultar = (elemento) => {
  elemento.classList.add("is-hidden");
};

const mostrar = (elemento) => {
  elemento.classList.remove("is-hidden");
};

const resetearValoresDeBusqueda = () => {
  const busqueda = $("#input-search");
  busqueda.value = ``;
  const tipo = $("#tipo");
  tipo.value = "comics";
  const orden = $("#orden");
  orden.value = "a-z";
};

const buscarComicPorId = (id) => {
  // no dejes nunca console log en una entrega!
  // esto es muy importante, en un challenge tecnico esto no se perdona
  console.log("Buscando comic por id...");
  console.log(id);

  fetch(`${BASE_URL}/comics/${id}?apikey=${API_KEY}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      comicEncontrado = data.data.results[0];
      console.log(comicEncontrado);

      crearTarjetaDetalleDeComic(comicEncontrado);
    })
    .catch((err) => {
      console.log(err);
      seccionPrincipal.textContent = "No pudimos encontrar tu busqueda";
    });
};

const formatearFecha = (fecha) => {
  let fechaSeparadaDeHora = fecha.split("T");

  // proba como desafio hacer esto con Date()
  fecha = fechaSeparadaDeHora[0];
  fecha = fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, "$3/$2/$1");
  return fecha;
};

const ocultarPaginacion = () => {
  console.log("ocultandoPaginacion")
  ocultar(pagAnterior)
  ocultar(pagSiguiente)
  ocultar(pagPrimera)
  ocultar(pagUltima) 
  ocultar(paginaActualContenedor)
};

const mostarPaginacion = () => {
  console.log("mostrandoPaginacion")
  mostrar(pagAnterior)
  mostrar(pagSiguiente)
  mostrar(pagPrimera)
  mostrar(pagUltima) 
  mostrar(paginaActualContenedor)  
};


/**  FUNCIONES PRINCIPALES  */

const crearTarjetasDeComics = (data, container) => {
  console.log("Listando tarjetas de comics...");

  ocultar(loader);
  let comics = data.data.results;
  console.log(comics);

  comics.map((comic) => {
    resultadosTitulo.classList.toggle("is-hidden");
    cantidadDeResultados.textContent = ` ${data.data.total}`;
    let imgComic = comic.thumbnail.path;

    if (
      imgComic ===
      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available"
    ) {
      // aca agrega un punto antes de /images para que se vea en el sitio deployado
      imgComic = "/images/img-not-found";
    }

    container.innerHTML += `
    <article class="card-comic-simple-contenedor">        
      <div class="comic-img-contenedor ">              
        <img src="${imgComic}.${comic.thumbnail.extension}" />        
      </div>     
      <div class="comic-titulo-contenedor">
         <h3 class="comic-titulo">${comic.title}</h3>
      </div>
   </article>
             
        `;
  });

  // ABRIR CARD DETALLE DE COMIC CON ONCLICK

  const todasLasCardsDeComics = $$(".card-comic-simple-contenedor");

  todasLasCardsDeComics.forEach((comicCard, cardIndice) => {
    comicCard.onclick = () => {
      let comicCardElegidaId = comics[cardIndice].id;
      console.log(comicCardElegidaId);

      borrarContenidoHTML(contenedorDeCards);
      ocultar(resultadosTitulo);
      ocultar(cantidadDeResultados);

      buscarComicPorId(comicCardElegidaId);
    }; 
  }); 
};

const crearTarjetaDetalleDeComic = (comicCardElegida) => {
  console.log("Creando tarjeta detalle de comic:");
  console.log(comicCardElegida);
  ocultarPaginacion();

  let imgComic = comicCardElegida.thumbnail.path;
  let descripcion = comicCardElegida.description;

  if (descripcion === null || descripcion === "") {
    descripcion = "Lo sentimos, no hay información disponible";
  }

  if (
    imgComic ===
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available"
  ) {
    imgComic = "/images/img-not-found";
  }

  contenedorDeCards.innerHTML = `
 
             <div class= "card-detalle-contenedor">
               <div class= "card-comic-detalle-contenedor">
                   <div class= "comic-img-contenedor">
                       <img class= "comic-img" src="${imgComic}.${
    comicCardElegida.thumbnail.extension
  }">
                   </div>
                   <div class= "comic-contenido-contenedor">
                       <h1 class= "comic-contenido-titulo">${
                         comicCardElegida.title
                       }</h2>
                       <h3>Publicado:</h3>
                       <p>${formatearFecha(comicCardElegida.dates[1].date)}</p>
                       <h3>Guionistas:</h3> 
                       <p class= "guionistas-nombres"></p>
               
                       <h3>Descripción: </h3>
                       <p>${descripcion}</p>
                   </div>
               </div>
 
               <div class= "personajes-contenedor">
                   <h3>Personajes</h3>
                   <h4><span class="cantidad-personajes">${
                     comicCardElegida.characters.available
                   }</span> ENCONTRADOS</h4>
                   <div class= "personajes-cards-contenedor"></div>                                            
               </div>
           </div>      
           `;

  // rellenar creadores
  const creadores = comicCardElegida.creators.items;
  const creadoresQty = comicCardElegida.creators.available;
  const guionistasNombres = $(".guionistas-nombres");

  if (creadoresQty === 0) {
    guionistasNombres.innerHTML = "Lo sentimos, no hay información disponible";
  } else {
    creadores.forEach((creador) => {
      guionistasNombres.innerHTML += `
              ${creador.name} •  
              `;
    });
  }

  // rellenar tarjetas de personajes dentro de la card comic detalle
  const urlPersonajesDelComic = comicCardElegida.characters.collectionURI;

  fetch(`${urlPersonajesDelComic}?apikey=${API_KEY}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      const personajesContenedor = $(".personajes-cards-contenedor");
      crearTarjetasDePersonajes(data, personajesContenedor);
      ocultar(resultadosTitulo);
      ocultar(cantidadDeResultados);
    })
    .catch((err) => {
      console.log(err);
      seccionPrincipal.textContent = "No pudimos encontrar tu busqueda";
    });
};

const crearTarjetasDePersonajes = (data, container) => {
  console.log("Creando tarjetas de personajes...");

  ocultar(loader);
  let personajes = data.data.results;
  console.log(personajes);

  personajes.map((personaje) => {
    resultadosTitulo.classList.toggle("is-hidden");
    cantidadDeResultados.textContent = ` ${data.data.total}`;

    let imgPersonaje = personaje.thumbnail.path;

    if (
      imgPersonaje ===
      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available"
    ) {
      imgPersonaje = "/images/img-not-found";
    }

    container.innerHTML += `
    
    <article class= "card-personaje-simple-contenedor">
        <div class="personaje-img-contenedor">              
            <img src="${imgPersonaje}.${personaje.thumbnail.extension}"/>        
        </div>   
        <div class="personaje-nombre-contenedor">
            <h3 class="personaje-nombre">${personaje.name}</h3>
        </div>
    </article>
             
        `;
  });

  // ABRIR CARD DETALLE DE PERSONAJE CON ONCLICK

  const todasLasCardsDePersonajes = $$(".card-personaje-simple-contenedor");

  todasLasCardsDePersonajes.forEach((personajeCard, personajeIndice) => {
    personajeCard.onclick = () => {
      const personajeCardElegida = personajes[personajeIndice];

      borrarContenidoHTML(contenedorDeCards);
      ocultar(resultadosTitulo);
      ocultar(cantidadDeResultados);

      crearTarjetaDetalleDePersonaje(personajeCardElegida);
    }; 
  });
};

const crearTarjetaDetalleDePersonaje = (personajeCardElegida) => {
  console.log("Creando tarjeta detalle de personaje...");
  console.log(personajeCardElegida);
  ocultarPaginacion();

  let imgPersonaje = personajeCardElegida.thumbnail.path;
  let descripcion = personajeCardElegida.description;

  if (descripcion === null || descripcion === "") {
    descripcion = "Lo sentimos, no hay descripción disponible";
  }

  if (
    imgPersonaje ===
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available"
  ) {
    imgPersonaje = "/images/img-not-found";
  }

  contenedorDeCards.innerHTML = `
      <div class="card-detalle-contenedor">
        <div class="card-personaje-detalle-contenedor">
            <div class="personaje-img-contenedor">
                <img class="personaje-img" src="${imgPersonaje}.${personajeCardElegida.thumbnail.extension}">
            </div>
            <div class="personaje-contenido-contenedor">
              <h1 class="personaje-contenido-nombre">${personajeCardElegida.name}</h2>
              <h3>Descripción:</h3>
              <p>${descripcion}</p>
            </div>
        </div>

        <div class="comics-contenedor">
            <h3>Comics</h3>
            <h4><span class="cantidad-comics">${personajeCardElegida.series.available}</span> ENCONTRADOS</h4>
            <div class="comics-cards-contenedor"></div>
        </div>
      </div>
  `;

  // rellenar tarjetas de comics en los que aparece este personaje
  const urlComicsDelPersonaje = personajeCardElegida.series.collectionURI;

  fetch(`${urlComicsDelPersonaje}?apikey=${API_KEY}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      const comicsContenedor = $(".comics-cards-contenedor");
      crearTarjetasDeComics(data, comicsContenedor);
      ocultar(resultadosTitulo);
      ocultar(cantidadDeResultados);
    });
};

const listarCards = (url) => {
  console.log("Listando cards...");
  console.log(`Fetch a URL: ${url}`);
  console.log(`Estas en la pagina ${paginaActual}, oofset: ${offset}`);

  borrarContenidoHTML(contenedorDeCards);
  mostrar(resultadosTitulo);
  mostrar(cantidadDeResultados);
  mostarPaginacion()
  const tipo = $("#tipo").value;
  ultimaBusqueda = url;

  fetch(`${url}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);

      if (tipo === "comics") {
        crearTarjetasDeComics(data, contenedorDeCards);
      } else {
        crearTarjetasDePersonajes(data, contenedorDeCards);
      }

      /***☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*
       *                PAGINACION
       **☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*/

      const totalDeResultados = data.data.total;
      console.log(totalDeResultados);
      const resto = totalDeResultados % 20;
      console.log(resto);
      let ultimaPaginaDisponible = 0;

      if (resto === 0) {
        ultimaPaginaDisponible = totalDeResultados / 20 - 1;
      } else {
        ultimaPaginaDisponible = (totalDeResultados - resto) / 20;
      }

      console.log(`Última Pagina Disponible: ${ultimaPaginaDisponible}`);

      paginaActualHTML.innerHTML = `${paginaActual + 1}`;
      paginasTotalesHTML.innerHTML = `${ultimaPaginaDisponible+ 1}`;

      // habilitar o deshabilitar botones

      if (paginaActual === 0) {
        pagAnterior.disabled = true;
        pagPrimera.disabled = true;
      } else {
        pagAnterior.disabled = false;
        pagPrimera.disabled = false;
      }

      if (paginaActual === ultimaPaginaDisponible) {
        pagSiguiente.disabled = true;
        pagUltima.disabled = true;
      } else {
        pagSiguiente.disabled = false;
        pagUltima.disabled = false;
      }

      botonesPaginacion.forEach((btnPaginacion) => {
        btnPaginacion.onclick = () => {
          if (btnPaginacion.classList.contains("pagina-primera")) {
            paginaActual = 0;
            actualizarOffset();
            actualizarBusqueda();
          } else if (btnPaginacion.classList.contains("pagina-anterior")) {
            actualizarNroDePagina(-1);
            actualizarBusqueda();
          } else if (btnPaginacion.classList.contains("pagina-siguiente")) {
            actualizarNroDePagina(1);
            actualizarBusqueda();
          } else if (btnPaginacion.classList.contains("pagina-ultima")) {
            paginaActual = ultimaPaginaDisponible;
            actualizarOffset();
            actualizarBusqueda();
          } else {
            mostrarTarjetasDeComics(getComics);
          }
        };
      });
    }) 
    .catch((err) => {
      console.log(err);
      seccionPrincipal.textContent = "No pudimos encontrar tu busqueda";
    });
};

const actualizarBusqueda = () => {
  console.log("Chequeando parametros de busqueda...");

  const busqueda = $("#input-search").value;
  const tipo = $("#tipo").value;
  const orden = $("#orden").value;
  let busquedaValue = ``;
  let queryParams = ``;

  if (tipo === "comics") {
    console.log("buscaste comics");
    console.log(`Titulo: ${busqueda}`);
    console.log(`Tipo: ${tipo}`);
    console.log(`Orden: ${orden}`);

    if (busqueda.length) {
      busquedaValue = `&titleStartsWith=${busqueda}`;
    }
    if (orden === "a-z") {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=title`);
    }
    if (orden === "z-a") {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=-title`);
    }
    if (orden === "mas-nuevos") {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=modified`);
    }
    if (orden === "mas-viejos") {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=-modified`);
    }

    listarCards(construirURL(getComics, queryParams));
  } else {
    console.log("buscaste personajes");
    console.log(`Nombre: ${busqueda}`);
    console.log(`Tipo: ${tipo}`);
    console.log(`Orden: ${orden}`);

    if (busqueda.length) {
      busquedaValue = `&nameStartsWith=${busqueda}`;
    }
    if (orden === "a-z") {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=name`);
    }
    if (orden === "z-a") {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=-name`);
    }
    console.log(queryParams);
    console.log(busquedaValue);
    listarCards(construirURL(getPersonajes, queryParams));
  }
};
/***☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*
 *     FORMULARIO - BUSQUEDA POR PARAMETROS
 **☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*/

formulario.onsubmit = (e) => {
  console.log("enviaste el formulario");
  e.preventDefault();
  mostrar(loader);
  paginaActual = 0;
  actualizarOffset();
  actualizarBusqueda();
};

const ocultarOpcionesMasNuevosOViejos = () => {
  console.log("cambiaste el select tipo a: ");
  console.log(selectTipo.value);

  if (selectTipo.value === "personajes") {
    ocultar(selectMasNuevos);
    ocultar(selectMasViejos);
  } else {
    mostrar(selectMasNuevos);
    mostrar(selectMasViejos);
  }
};

selectTipo.addEventListener("change", ocultarOpcionesMasNuevosOViejos);

/***☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*
 *    BOTONES HOME Y BACK
 **☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*/

const botonInicio = $(".boton-inicio");
const botonVolver = $(".boton-volver");

botonInicio.onclick = () => {
  resetearValoresDeBusqueda();
  paginaActual = 0;
  actualizarOffset();
  console.log("clickeaste home");
  inicializar();
};

botonVolver.onclick = () => {
  console.log("clickeaste back");
  console.log(ultimaBusqueda);
  mostrar(loader);
  if (ultimaBusqueda.length) {
    listarCards(ultimaBusqueda);
  } else inicializar();
};

/***☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*
 *                INICIALIZAR
 **☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*/

const inicializar = () => {
  console.log("Inicializando...");
  mostrar(loader);
  actualizarBusqueda();
};

inicializar();
