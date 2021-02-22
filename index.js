const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

let comics = [];
let personajes = [];

const API_KEY = 'b1ee9360739b9c7554ec7be096d4d06f'
const BASE_URL = 'https://gateway.marvel.com/v1/public'

let offset = 0
let paginaActual = 0
let ultimaBusqueda = ""

const formulario = $(".formulario")
const seccionPrincipal = $(".seccion-principal");
const resultadosTitulo = $(".resultados-titulo-contenedor");
const cantidadDeResultados = $(".cantidad-resultados")
const contenedorDeCards = $(".resultados-cards-contenedor");
const loader = $(".loader-contenedor");


/**  RUTAS */

const getComics = `${BASE_URL}/comics?apikey=${API_KEY}`;
const getPersonajes = `${BASE_URL}/characters?apikey=${API_KEY}`;


/**  FUNCIONES GENERALES  */

const construirURL = (endpoint, queryParams) => {
  return `${endpoint}${queryParams}`
}

const actualizarQueryParams = (query) => {
  let queryParams = `&offset=${offset}`;
  queryParams += query;
  return queryParams
}

const borrarContenidoHTML = (elemento) => {
  elemento.innerHTML = ``;
}

const ocultar = (elemento) => {
  elemento.classList.add("is-hidden")
}

const mostrar = (elemento) => {
  elemento.classList.remove("is-hidden")
}

const resetearValoresDeBusqueda = () => {
  const busqueda = $("#input-search");
  busqueda.value = ``;
  const tipo = $("#tipo");
  tipo.value = "comics";
  const orden = $("#orden");
  orden.value = "a-z";

}

/**  FUNCIONES PRINCIPALES  */ 


const crearTarjetasDeComics = (data, container) => {
  console.log("Listando tarjetas de comics...")

  ocultar(loader)
  comics = data.data.results

  comics.map((comic) => {
    resultadosTitulo.classList.toggle("is-hidden");
    cantidadDeResultados.textContent = ` ${data.data.total}`;
    let imgComic = comic.thumbnail.path;
   
    if(imgComic === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available") {
      imgComic = "/images/img-not-found"
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
}
                              
const crearTarjetaDetalleDeComic = (comicCardElegida) => {

  console.log("Creando tarjeta detalle de comic:")
  console.log(comicCardElegida)

  let imgComic = comicCardElegida.thumbnail.path;
   
  if(imgComic === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available") {
    imgComic = "/images/img-not-found"
  }

  contenedorDeCards.innerHTML = `
 
             <div class= "card-detalle-contenedor">
               <div class= "card-comic-detalle-contenedor">
                   <div class= "comic-img-contenedor">
                       <img class= "comic-img" src="${imgComic}.${comicCardElegida.thumbnail.extension}">
                   </div>
                   <div class= "comic-contenido-contenedor">
                       <h1 class= "comic-contenido-titulo">${comicCardElegida.title}</h2>
                       <h3>Publicado:</h3>
                       <p>${Date(comicCardElegida.dates[1].date)}</p>
                       <h3>Guionistas:</h3> 
                       <p class= "guionistas-nombres"></p>
               
                       <h3>Descripción: </h3>
                       <p>${comicCardElegida.title}</p>
                   </div>
               </div>
 
               <div class= "personajes-contenedor">
                   <h3>Personajes</h3>
                   <h4><span class="cantidad-personajes">${comicCardElegida.characters.available}</span> ENCONTRADOS</h4>
                   <div class= "personajes-cards-contenedor"></div>                                            
               </div>
           </div>      
           `;


  // rellenar creadores
  const creadores = comicCardElegida.creators.items
  const guionistasNombres = $(".guionistas-nombres")

  creadores.forEach(creador => {
    guionistasNombres.innerHTML += `
              ${creador.name} - 
              `
  }) //cierra foreach de creadores


  // rellenar tarjetas de personajes dentro de la card comic detalle
  const urlPersonajesDelComic = comicCardElegida.characters.collectionURI

  fetch(`${urlPersonajesDelComic}?apikey=${API_KEY}`)
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      console.log(data)   
      const personajesContenedor = $(".personajes-cards-contenedor")
      crearTarjetasDePersonajes(data, personajesContenedor)
    }) 
}



const crearTarjetasDePersonajes = (data, container) => {
  console.log("Creando tarjetas de personajes...")

  ocultar(loader)
  personajes = data.data.results
  console.log(personajes)

  
  personajes.map((personaje) => {
    console.log("dentro del map de personajes")
    console.log(personaje)
    resultadosTitulo.classList.toggle("is-hidden");
    cantidadDeResultados.textContent = ` ${data.data.total}`;
    
    let imgPersonaje = personaje.thumbnail.path;

    if(imgPersonaje === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available") {
      imgPersonaje = "/images/img-not-found"
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

  

}

const crearTarjetaDetalleDePersonaje = (personajeCardElegida) => {
  console.log("Creando tarjeta detalle de personaje...")
  console.log(personajeCardElegida)

  let imgPersonaje = personajeCardElegida.thumbnail.path;

    if(imgPersonaje === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available") {
      imgPersonaje = "/images/img-not-found"
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
              <p>${personajeCardElegida.description}</p>
            </div>
        </div>

        <div class="comics-contenedor">
            <h3>Comics</h3>
            <h4><span class="cantidad-comics">${personajeCardElegida.series.available}</span> ENCONTRADOS</h4>
            <div class="comics-cards-contenedor"></div>
        </div>
      </div>
  `

  // rellenar tarjetas de comics en los que aparece este personaje
}


const listarCards = (url) => {
  console.log("Listando cards...")

  borrarContenidoHTML(contenedorDeCards);
  mostrar(resultadosTitulo);
  mostrar(cantidadDeResultados);
  const tipo = $("#tipo").value;
  ultimaBusqueda = url;

  fetch(`${url}`)
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      console.log(data)

      if(tipo === "comics") {
        crearTarjetasDeComics(data, contenedorDeCards)
      }else {
        crearTarjetasDePersonajes(data, contenedorDeCards)
      } 

      
      // ABRIR CARD DETALLE DE COMIC CON ONCLICK

      const todasLasCardsDeComics = $$(".card-comic-simple-contenedor")

      todasLasCardsDeComics.forEach((comicCard, cardIndice) => {
          comicCard.onclick = () => {
              const comicCardElegida = comics[cardIndice]

              borrarContenidoHTML(contenedorDeCards);
              ocultar(resultadosTitulo);
              ocultar(cantidadDeResultados);

              crearTarjetaDetalleDeComic(comicCardElegida);

          }; // cierra el onclick
      }); // cierra el foreach


       // ABRIR CARD DETALLE DE PERSONAJE CON ONCLICK
      
       const todasLasCardsDePersonajes = $$(".card-personaje-simple-contenedor")

       todasLasCardsDePersonajes.forEach((personajeCard, personajeIndice) => {
            personajeCard.onclick = () => {
                const personajeCardElegida = personajes[personajeIndice]

                borrarContenidoHTML(contenedorDeCards);
                ocultar(resultadosTitulo);
                ocultar(cantidadDeResultados);

                crearTarjetaDetalleDePersonaje(personajeCardElegida);

          }; // cierra el onclick
       }); // cierra el foreach


    }) // cierra el then
    .catch((err) => {
      console.log(err)
      seccionPrincipal.textContent = "No pudimos encontrar tu busqueda"
    })

};


/***☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*
 *                PAGINACION
 **☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*/

const pagAnterior = $(".pagina-anterior")
const pagSiguiente = $(".pagina-siguiente")
const pagPrimera = $(".pagina-primera")
const pagUltima = $(".pagina-ultima")
const botonesPaginacion = $$(".paginacion-btn")

botonesPaginacion.forEach((btnPaginacion) => {
  btnPaginacion.onclick = () => {
    if (btnPaginacion.classList.contains('pagina-primera')) {
      mostrarTarjetasDeComics(getComics);
    } else if (btnPaginacion.classList.contains('pagina-anterior')) {
      mostrarTarjetasDeComics(getComics);
    } else if (btnPaginacion.classList.contains('pagina-siguiente')) {
      mostrarTarjetasDeComics(getComics);
    } else if (btnPaginacion.classList.contains('pagina-ultima')) {
      mostrarTarjetasDeComics(getComics);
    } else {
      mostrarTarjetasDeComics(getComics);
    }
  }
})

const actualizarBusqueda = () => {

  console.log("Chequeando parametros de busqueda...")

  const busqueda = $("#input-search").value;
  const tipo = $("#tipo").value;
  const orden = $("#orden").value;
  let busquedaValue = ``;
  let queryParams = ``;

  if (tipo === 'comics') {
    console.log("buscaste comics")
    console.log(`Titulo: ${busqueda}`)
    console.log(`Tipo: ${tipo}`)
    console.log(`Orden: ${orden}`)
    

    if (busqueda.length) {
      busquedaValue = `&titleStartsWith=${busqueda}`
    }
    if (orden === 'a-z') {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=title`)
    }
    if (orden === 'z-a') {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=-title`)
    }
    if (orden === 'mas-nuevos') {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=modified`)
    }
    if (orden === 'mas-viejos') {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=-modified`)
    }

    listarCards(construirURL(getComics, queryParams))

  } else {
    console.log("buscaste personajes")
    console.log(`Titulo: ${busqueda}`)
    console.log(`Tipo: ${tipo}`)
    console.log(`Orden: ${orden}`)

    if (busqueda.length) {
      queryParams = actualizarQueryParams(`&nameStartWith=${busqueda.value}`)
    }
    if (orden.value === 'a-z') {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=name`)
    }
    if (orden.value === 'z-a') {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=-name`)
    }

    listarCards(construirURL(getPersonajes, queryParams))
  }


}
/***☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*
 *     FORMULARIO - BUSQUEDA POR PARAMETROS
 **☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*/

formulario.onsubmit = (e) => {
  console.log("enviaste el formulario")
  e.preventDefault();
  mostrar(loader);

  actualizarBusqueda()

}


/***☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*
 *    BOTONES HOME Y BACK
 **☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*/

const botonInicio = $(".boton-inicio");
const botonVolver = $(".boton-volver");

botonInicio.onclick = () => {
  resetearValoresDeBusqueda();
  console.log("clickeaste home")
  inicializar();
}

botonVolver.onclick = () => {
  console.log("clickeaste back")
  console.log(ultimaBusqueda)
  mostrar(loader)
  if(ultimaBusqueda.length){
    listarCards(ultimaBusqueda);
  }else inicializar()
  
}


/***☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*
 *                INICIALIZAR
 **☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*――*☆*/

const inicializar = () => {
  console.log("Inicializando...")
  mostrar(loader)
  actualizarBusqueda()
}


inicializar();






