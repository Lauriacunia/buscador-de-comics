const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)


const API_KEY = 'b1ee9360739b9c7554ec7be096d4d06f'
const BASE_URL = 'https://gateway.marvel.com/v1/public'

let offset = 0
let paginaActual = 0
let ultimaBusqueda = ""
let comicEncontrado = {}

const formulario = $(".formulario")
const seccionPrincipal = $(".seccion-principal");
const resultadosTitulo = $(".resultados-titulo-contenedor");
const cantidadDeResultados = $(".cantidad-resultados")
const contenedorDeCards = $(".resultados-cards-contenedor");
const loader = $(".loader-contenedor");
const selectMasNuevos = $(".nuevos");
const selectMasViejos = $(".viejos");
const selectOrden = $("#orden");
console.log(selectOrden)

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

const buscarComicPorId = (id) => {
  console.log("Buscando comic por id...")
  console.log(id)
  
   fetch(`${BASE_URL}/comics/${id}?apikey=${API_KEY}`)
   .then((res) => {
     return res.json()
   })
   .then((data) => {  
    console.log(data)
    comicEncontrado = data.data.results[0];
    console.log(comicEncontrado)

    crearTarjetaDetalleDeComic(comicEncontrado); 
    
   })
   .catch((err) => {
    console.log(err)
    seccionPrincipal.textContent = "No pudimos encontrar tu busqueda"
  })

}

const formatearFecha = (fecha) => {
  console.log(fecha)
  let fechaSeparadaDeHora = fecha.split("T")
  console.log(fechaSeparadaDeHora)
  fecha = fechaSeparadaDeHora[0];
  fecha = fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,'$3/$2/$1');
  return fecha
}

/**  FUNCIONES PRINCIPALES  */ 


const crearTarjetasDeComics = (data, container) => {
  console.log("Listando tarjetas de comics...")

  ocultar(loader)
  let comics = data.data.results
  console.log(comics)

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


  // ABRIR CARD DETALLE DE COMIC CON ONCLICK

  const todasLasCardsDeComics = $$(".card-comic-simple-contenedor")

  todasLasCardsDeComics.forEach((comicCard, cardIndice) => {
      comicCard.onclick = () => {

         let comicCardElegidaId = comics[cardIndice].id
         console.log(comicCardElegidaId)
      
          borrarContenidoHTML(contenedorDeCards);
          ocultar(resultadosTitulo);
          ocultar(cantidadDeResultados);

          buscarComicPorId(comicCardElegidaId)          

      }; // cierra el onclick
  }); // cierra el foreach

}
                              
const crearTarjetaDetalleDeComic = (comicCardElegida) => {

  console.log("Creando tarjeta detalle de comic:")
  console.log(comicCardElegida)

  let imgComic = comicCardElegida.thumbnail.path;
  let descripcion = comicCardElegida.description;

  if(descripcion === null || descripcion === "") {
    descripcion = "Lo sentimos, no hay información disponible"
  }
   
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
                       <p>${formatearFecha(comicCardElegida.dates[1].date)}</p>
                       <h3>Guionistas:</h3> 
                       <p class= "guionistas-nombres"></p>
               
                       <h3>Descripción: </h3>
                       <p>${descripcion}</p>
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
  const creadoresQty = comicCardElegida.creators.available
  console.log(creadores)
  const guionistasNombres = $(".guionistas-nombres")

  if(creadoresQty === 0) {
    guionistasNombres.innerHTML = "Lo sentimos, no hay información disponible"
  }else {
    creadores.forEach(creador => {
    guionistasNombres.innerHTML += `
              ${creador.name} •  
              `
    }) 
  }
    

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
      ocultar(resultadosTitulo);
      ocultar(cantidadDeResultados);
    }) 
    .catch((err) => {
      console.log(err)
      seccionPrincipal.textContent = "No pudimos encontrar tu busqueda"
    })

}



const crearTarjetasDePersonajes = (data, container) => {
  console.log("Creando tarjetas de personajes...")

  ocultar(loader)
  let personajes = data.data.results
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

}

const crearTarjetaDetalleDePersonaje = (personajeCardElegida) => {
  console.log("Creando tarjeta detalle de personaje...")
  console.log(personajeCardElegida)

  let imgPersonaje = personajeCardElegida.thumbnail.path;
  let descripcion = personajeCardElegida.description;

  if(descripcion === null  || descripcion === "") {
    descripcion = "Lo sentimos, no hay descripción disponible"
  }

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
              <p>${descripcion}</p>
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
  const urlComicsDelPersonaje = personajeCardElegida.series.collectionURI

  fetch(`${urlComicsDelPersonaje}?apikey=${API_KEY}`)
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      console.log(data)   
      const comicsContenedor = $(".comics-cards-contenedor")
      crearTarjetasDeComics(data, comicsContenedor)
      ocultar(resultadosTitulo);
      ocultar(cantidadDeResultados);
    }) 


}


const listarCards = (url) => {
  console.log("Listando cards...")
  console.log(url)

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
    console.log(`Nombre: ${busqueda}`)
    console.log(`Tipo: ${tipo}`)
    console.log(`Orden: ${orden}`)

    if (busqueda.length) {
      busquedaValue = `&nameStartsWith=${busqueda}`
    }
    if (orden === 'a-z') {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=name`)
    }
    if (orden === 'z-a') {
      queryParams = actualizarQueryParams(`${busquedaValue}&orderBy=-name`)
    }
    console.log(queryParams)
    console.log(busquedaValue)
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

const ocultarOpcionesMasNuevosOViejos = () => {
  console.log("cambiaste el select")
  
  if(selectOrden === "personajes") {
    ocultar(selectMasNuevos)
    ocultar(selectMasViejos)
  }else {
    mostrar(selectMasNuevos)
    mostrar(selectMasViejos)
  }

}


//selectOrden.addEventListener('change', ocultarOpcionesMasNuevosOViejos);

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





