/*
===============================================================
ALUVA 
JavaScript externo
===============================================================
Este archivo agrega interactividad mediante manipulación del DOM
y eventos, siguiendo los contenidos trabajados en la Unidad 3.

Resumen de lo que hace este archivo (de arriba hacia abajo):
  1) Filtro de productos por categoría (Todos / Vestuario / Alta visibilidad / Accesorios).
  2) Modo de alto contraste para toda la página.
  3) Validación en vivo del formulario de contacto (nombre, correo, mensaje).

No usamos ninguna librería para esto: todo es JavaScript "puro"
(a veces llamado Vanilla JS), usando únicamente APIs del navegador
como document.querySelector, addEventListener y classList.
===============================================================
*/

/*
  'DOMContentLoaded' es un evento que el navegador dispara apenas
  termina de leer y armar todo el HTML de la página (el DOM), sin
  esperar a que carguen imágenes u otros recursos pesados.
  Envolvemos TODO nuestro código dentro de este evento para asegurarnos
  de que elementos como #btnContraste o #formContacto YA existan en la
  página antes de que intentemos buscarlos con getElementById/querySelector.
  Si no hiciéramos esto, el script podría ejecutarse antes de que el
  HTML exista todavía y "no encontraría" los elementos.
*/
document.addEventListener('DOMContentLoaded', function () {

  // ===================================================================
  // 1) FILTRO DE PRODUCTOS
  // Evento: click sobre cada botón de filtro.
  // Técnica: comparar atributos data-* y mostrar/ocultar con classList.
  // ===================================================================

  // querySelectorAll devuelve una "lista" con TODOS los elementos que
  // cumplen ese selector CSS. Aquí guardamos:
  var botonesFiltro = document.querySelectorAll('.btn-filter');   // los 4 botones (Todos, Vestuario, etc.)
  var productos = document.querySelectorAll('.product-item');     // las 9 tarjetas de producto
  var resultadoFiltro = document.getElementById('resultadoFiltro'); // el párrafo "Mostrando X productos."

  // Recorremos cada botón de filtro y le agregamos un "escuchador" de clicks.
  // Esto se ejecuta una sola vez al cargar la página, pero la función que
  // pasamos como segundo argumento se guarda y se vuelve a ejecutar CADA VEZ
  // que el usuario hace click en ese botón en particular.
  botonesFiltro.forEach(function (boton) {
    boton.addEventListener('click', function () {

      // getAttribute('data-filter') lee el valor que pusimos en el HTML,
      // por ejemplo data-filter="vestuario" -> categoria = "vestuario".
      var categoria = boton.getAttribute('data-filter');

      // Contador de cuántos productos van a quedar visibles con este filtro,
      // para poder armar el mensaje "Mostrando N productos." al final.
      var visibles = 0;

      // Antes de marcar el botón que se acaba de tocar, le quitamos la clase
      // "active" (y el aria-pressed) a TODOS los botones, para que solo uno
      // quede resaltado como filtro activo a la vez.
      botonesFiltro.forEach(function (item) {
        item.classList.remove('active');
        item.setAttribute('aria-pressed', 'false');
      });

      // Ahora sí, marcamos como activo únicamente el botón que el usuario tocó.
      boton.classList.add('active');
      boton.setAttribute('aria-pressed', 'true');

      // Recorremos las 9 tarjetas de producto una por una.
      productos.forEach(function (producto) {
        // "coincide" es true si:
        //   - el filtro elegido es "todos" (se muestran todos sin comparar nada), O
        //   - la categoría del producto (data-category en el HTML) es igual a la
        //     categoría del botón que se apretó.
        var coincide = categoria === 'todos' || producto.getAttribute('data-category') === categoria;

        // classList.toggle('d-none', !coincide) es una forma corta de decir:
        //   si coincide es true  -> quita la clase d-none (se ve)
        //   si coincide es false -> agrega la clase d-none (Bootstrap la oculta con display:none)
        producto.classList.toggle('d-none', !coincide);

        // Si el producto quedó visible, sumamos 1 al contador.
        if (coincide) visibles++;
      });

      // Actualizamos el texto del contador. El operador ternario
      // (condición ? valorSiTrue : valorSiFalse) elige entre singular y plural
      // según si hay exactamente 1 producto visible o no.
      resultadoFiltro.textContent = 'Mostrando ' + visibles + (visibles === 1 ? ' producto.' : ' productos.');
    });
  });


  // ===================================================================
  // 2) MODO ALTO CONTRASTE
  // Evento: click sobre el botón "Alto contraste" del menú.
  // Técnica: classList.toggle() sobre el <body> + CSS ya preparado
  //          (ver el bloque body.alto-contraste en style.css).
  // ===================================================================

  var btnContraste = document.getElementById('btnContraste');

  // Este "if" es una protección: si por algún motivo el botón no existe en
  // el HTML (por ejemplo si alguien lo borra sin querer), el script no
  // intenta agregarle un evento a "nada" y no se rompe el resto del archivo.
  if (btnContraste) {
    btnContraste.addEventListener('click', function () {
      // classList.toggle('alto-contraste') hace dos cosas en una sola línea:
      //   - si el <body> NO tenía esa clase, se la agrega y devuelve true.
      //   - si el <body> YA tenía esa clase, se la quita y devuelve false.
      // Guardamos ese resultado (true/false) en "activo" para reutilizarlo
      // abajo y no tener que volver a preguntar el estado del body.
      var activo = document.body.classList.toggle('alto-contraste');

      // Actualizamos aria-pressed para que un lector de pantalla sepa si el
      // botón está "presionado" (activo) o no, igual que un interruptor.
      btnContraste.setAttribute('aria-pressed', activo ? 'true' : 'false');

      // Cambiamos el texto visible del botón para que el usuario entienda
      // qué va a pasar si vuelve a hacer click.
      btnContraste.textContent = activo ? 'Contraste normal' : 'Alto contraste';
    });
  }


  // ===================================================================
  // 3) VALIDACIÓN DE FORMULARIO
  // Eventos: blur (cuando el usuario sale de un campo) y submit (al enviar).
  // Técnica: funciones de validación reutilizables + clases is-valid/is-invalid
  //          de Bootstrap, que activan los estilos verdes/rojos y muestran
  //          el mensaje de error correspondiente (definido en el HTML).
  // ===================================================================

  var formulario = document.getElementById('formContacto');
  var nombre = document.getElementById('nombre');
  var correo = document.getElementById('correo');
  var mensaje = document.getElementById('mensaje');
  var mensajeFormulario = document.getElementById('mensajeFormulario');

  // --- Validación del campo Nombre ---
  // Se considera válido si, después de quitar espacios al inicio/final
  // (trim), quedan al menos 2 caracteres.
  function validarNombre() {
    var valido = nombre.value.trim().length >= 2;
    // Si NO es válido, se agrega la clase is-invalid (borde rojo + muestra el mensaje de error).
    // Si SÍ es válido, se agrega la clase is-valid (borde verde).
    nombre.classList.toggle('is-invalid', !valido);
    nombre.classList.toggle('is-valid', valido);
    return valido; // se devuelve el resultado para poder usarlo en el submit.
  }

  // --- Validación del campo Correo ---
  function validarCorreo() {
    // Expresión regular simple para reconocer un formato "algo@algo.algo":
    //   ^[^\s@]+   -> uno o más caracteres que NO sean espacio ni "@" (antes de la arroba)
    //   @          -> una arroba literal
    //   [^\s@]+    -> uno o más caracteres que NO sean espacio ni "@" (el dominio)
    //   \.         -> un punto literal
    //   [^\s@]+$   -> uno o más caracteres que NO sean espacio ni "@" hasta el final (la terminación, ej: "cl", "com")
    // No es una validación 100% perfecta de correos (ningún regex simple lo es),
    // pero es suficiente para detectar los errores más comunes de tipeo.
    var expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var valido = expresionCorreo.test(correo.value.trim());
    correo.classList.toggle('is-invalid', !valido);
    correo.classList.toggle('is-valid', valido);
    return valido;
  }

  // --- Validación del campo Mensaje ---
  // Se pide un mínimo de 10 caracteres para evitar mensajes vacíos o demasiado cortos.
  function validarMensaje() {
    var valido = mensaje.value.trim().length >= 10;
    mensaje.classList.toggle('is-invalid', !valido);
    mensaje.classList.toggle('is-valid', valido);
    return valido;
  }

  // Protección igual que con el botón de contraste: si el formulario no
  // existe en esta página, no intentamos engancharle eventos.
  if (formulario) {

    // Evento "blur": se dispara cuando el usuario hace click/tab FUERA del
    // campo (deja de estar enfocado). Así el usuario ve si se equivocó
    // apenas termina de escribir un campo, sin esperar a enviar todo el formulario.
    nombre.addEventListener('blur', validarNombre);
    correo.addEventListener('blur', validarCorreo);
    mensaje.addEventListener('blur', validarMensaje);

    // Evento "submit": se dispara cuando el usuario aprieta "Enviar solicitud".
    formulario.addEventListener('submit', function (evento) {
      // preventDefault() evita el comportamiento normal de un formulario HTML,
      // que sería recargar la página y enviar los datos a una URL. Como este
      // es un sitio de práctica sin servidor real, controlamos todo nosotros
      // con JavaScript en vez de dejar que el navegador recargue la página.
        evento.preventDefault();

        document.addEventListener('DOMContentLoaded', function () {
            const formulario = document.getElementById('formularioContacto');

            if (formulario) {
                formulario.addEventListener('submit', function (event) {
                    // Detiene el envío por defecto para validar
                    event.preventDefault();

                    // Aquí se dejan las alertas o textos de validación dinámicos
                    alert("¡Formulario verificado con éxito!");
                    formulario.reset();
                });
            }
        });

        // Se validan los TRES campos de una sola vez. Gracias al "&&" (Y lógico),
      // formularioValido solo va a ser true si los tres, uno por uno, son válidos.
      // Ojo: aunque el primero sea inválido, igual se ejecutan los otros dos,
      // porque cada función también actualiza los estilos (is-valid/is-invalid)
      // de su propio campo, y queremos que el usuario vea el error en todos
        // los campos a la vez, no solo en el primero que falló.
        // Se agrega la validación correspondiente al botón de WhatsApp agregado recientemente.
      var formularioValido = validarNombre() && validarCorreo() && validarMensaje();

      if (formularioValido) {
        // Si todo está bien: mostramos el mensaje de éxito (quitándole la
        // clase d-none que lo tenía oculto), limpiamos el formulario con
        // reset() y quitamos los bordes verdes para que quede "fresco"
        // por si el usuario quiere volver a completarlo.
        mensajeFormulario.textContent = 'Solicitud validada correctamente. En una implementación real, estos datos se enviarían al servidor.';
        mensajeFormulario.classList.remove('d-none');
        formulario.reset();
        nombre.classList.remove('is-valid');
        correo.classList.remove('is-valid');
        mensaje.classList.remove('is-valid');
      } else {
        // Si algo falló, nos aseguramos de que el mensaje de éxito esté
        // oculto (por si se había mostrado antes) y dejamos que los bordes
        // rojos y los mensajes de error (ya actualizados arriba) le indiquen
        // al usuario qué tiene que corregir.
        mensajeFormulario.classList.add('d-none');

        /*
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⠴⠖⠒⠚⠛⠛⠒⠚⠃⠻⠶⠶⣶⣶⣤⣤⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⠤⠖⡛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠻⢿⣿⣶⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠹⣄⣠⡴⠋⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⢿⣿⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⡿⠃⠀⠀⠀⠊⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⣷⡄⠀⠀⠀⠀⠙⢿⣿⣿⣦⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⢠⠋⠀⠀⠀⢀⠞⠀⢳⠀⠀⠀⠀⠀⠀⠙⢿⣿⣷⣄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣰⡯⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡴⠃⠐⠁⠀⠀⠀⠀⠋⣠⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣆⠀⠀⠀
⠀⠀⠀⠀⢰⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡠⠊⠀⡄⠀⠀⠀⠀⠀⣠⠞⠁⢻⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⣿⡆⠀⠀
⠀⠀⠀⢀⡏⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣾⠇⠀⠠⢂⣠⠞⠁⠀⠀⠈⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⡀⠀
⠀⠀⠀⡾⢀⡀⠀⢰⠋⠁⠀⠀⣀⣀⣀⣤⣴⣶⠾⠟⢋⣿⢀⣠⠴⠛⠁⠀⠀⠀⠀⠀⠸⣿⡄⠀⠀⠀⠀⠀⠀⠀⡀⠘⣿⣿⣧⠀
⠀⢴⣾⡟⢛⣇⣠⣯⣀⣤⣴⣿⠟⠛⠋⠉⠁⠀⠀⠀⠚⣋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣆⢀⠀⠀⠀⠀⠀⡜⠀⠀⣿⣿⣿⠀
⠀⠸⡏⠉⠉⣿⣿⢁⣾⣿⣿⣿⣷⠀⠀⠀⠀⠀⠐⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣶⣦⡀⠈⢿⡆⠀⠀⠀⡼⠁⠀⣠⣿⣿⣿⠆
⠀⠀⢳⠀⣠⡿⠁⠸⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⡿⠀⠀⣧⠀⠀⢠⣁⣠⡬⠵⠿⠿⠿⡦
⠀⠀⢈⣿⠟⡵⠀⠀⠈⠙⠛⠋⠁⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠿⣿⣿⡿⠃⠀⠀⣿⠀⠀⡾⠉⠀⠀⠀⠀⢐⡼⠁
⠀⣴⡿⠋⡜⠁⠀⠀⠀⠀⠀⠀⢰⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡄⠀⠀⠀⠀⠀⠀⠀⠀⣸⡇⠀⢰⡇⠀⠀⠀⠀⣠⡾⠁⠀    SI LLEGO ACA GRACIAS POR VER NUESTRO TRABAJO :)
⠸⣿⡀⠘⡀⠀⠀⠀⠀⠀⠀⠀⠘⣷⣀⣀⣤⣾⣦⡀⠀⠀⠀⠀⣀⣴⠇⠀⠀⠀⠀⠀⠀⠀⢠⣿⠃⠀⣼⠁⠀⠀⢀⣴⣿⠁⠀⠀
⠀⢻⣧⡀⠣⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠁⠀⠈⠛⠛⠛⠛⠛⠛⠁⠀⠀⠀⠀⠀⠀⠀⢠⢫⡟⠀⠀⡟⠀⢀⣴⣿⣿⡟⠀⠀⠀
⠀⠀⠙⢿⣄⣠⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⢎⡿⠀⢠⠀⢿⣾⣿⣿⣿⣿⡇⠀⠀⠀
⠀⠀⠀⠀⠙⢿⣿⣷⣂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠋⣸⠁⠀⠇⡀⢸⣿⣿⣿⣿⣿⡇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠹⣍⠛⢻⡷⣶⣦⣤⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⣤⡾⠿⢿⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠙⣦⡼⠁⠀⠀⠀⠉⢉⣩⡏⠀⠀⠀⠀⠒⣖⠒⠛⠛⠛⠋⠉⠀⠀⠀⠘⡇⢀⣼⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⠀⠀⣠⣶⡟⠉⠛⠒⠶⠶⠦⠶⢿⣻⣦⣄⡀⠀⠀⠀⠀⠀⠀⠷⠻⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⢿⣿⡀⠀⠀⢀⣠⣤⣶⠿⣛⣁⠍⣻⣦⣀⠀⠀⠀⠀⠀⠀⠙⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡿⢷⡿⠁⠐⣿⣷⣶⣾⣿⠿⠀⠁⠀⠁⠀⣼⠟⣡⡿⣧⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⡾⠁⣼⠇⠀⠀⠘⣷⡾⠋⠁⠀⠀⠀⠀⢀⠰⣿⡟⠉⠀⠈⣧⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⠃⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢰⡇⢀⡿⠀⠀⠀⠀⠉⠀⠀⠀⠀⠀⠀⠀⠘⣰⡏⠀⠀⠀⠀⠸⡆⠀⠀⠀⠀⠀⠀⠈⠻⠟⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢸⣧⣼⣧⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣼⣇⣀⣀⣀⣀⣠⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
*/
      }
    });
  }
});
