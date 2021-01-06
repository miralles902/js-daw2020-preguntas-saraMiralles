document.addEventListener("DOMContentLoaded", function () {//comprobación de que el DOM ha cargado correctamente
  window.preguntas(); //funcion para conseguir los datos del usuario (preguntas, email,fecha..) y su posicion y carga de respuestas, si no existe ningun usuario te redirige a index.html
  window.addpreguntas(); //funcion que añade las preguntas del formulario
  window.atras(); //funcion que se ejecuta al pulsar el boton atras
});

async function preguntas() {
  window.cargando();
  let userdataJson = Cookies.get("actual_usuario"); //conseguimos la cookie del usuario
  if (typeof userdataJson !== typeof undefined && isJson(userdataJson)) {
    // si no esta undefined y la funcion isJson comprueba que es un string
    let userdata = JSON.parse(userdataJson); //transformamos a json
    let nickname = Object.keys(userdata)[0]; //conseguimos la primer posicion del objeto
    let preguntas = userdata[nickname].preguntas;
    console.log(nickname, userdata, preguntas);
    let ocurre = false;
    if (typeof preguntas !== typeof undefined) { //si no esta undefined
      await window.cargarRespuestas(4000, preguntas).then(function (result) {  //cargamos las respuestas
        ocurre = true;
        window.fincarga();
      });
    }
    window.FinalizarCarga(5000, ocurre).then(function (result) {
      console.log("La pagina ha cargado correctamente", result); //mensaje en consola que nos muestra el estado de la carga de la pagina
    });
  } else {
    alert("no existe ningun usuario actual seras redirigido al inicio."); //si no existe ningun usuario  muestra un alert y
    location.href = "index.html"; //redirige a la primera pagina
  }
}

function cargando() { //mensaje de carga
  const cargando = document.getElementById("cargando"); //conseguir la tabla
  cargando.innerHTML = "Cargando las Preguntas..."; //mensaje de carga de preguntas
}

function aviso() { //aviso de que no ha cargado correctamente
  return new Promise((resolve, reject) => {
    const cargando = document.getElementById("cargando"); //conseguir la tabla
    cargando.innerHTML = "El tiempo no va bien..."; //en caso de no funcionar correctamente muestra el siguiente error
    resolve(true);
  });
}

function FinalizarCarga(tiempo, ocurre) {
  return new Promise((resolve, reject) => {
    if (!ocurre) {
      setTimeout(() => {
        window.fincarga(); //funcion que muestra el mensaje de cargando o las respuestas
        resolve(false);
      }, tiempo);
      setTimeout(() => {
        window.aviso().then(function (result) {
          reject("El tiempo no va bien"); //si el tiempo no va correctamente
        });
      }, tiempo * 2);
    } else {
      resolve(true);
    }
  });
}

function fincarga() {
  window.hide(document.getElementById("cargando")); //escondemos el mensaje de cargando y hacemos uso de la funcion hide de shared.js
  window.show(document.getElementById("respuestas")); //mostramos las respuestas y hacemos uso de la funcion show de shared.js
}
function cargarRespuestas(temps, preguntas) { //carga de respuestas
  return new Promise((resolve, reject) => {
    let rows = ""; //filas
    for (const fila in preguntas) { //bucle donde creamos cada fila
      let datos = preguntas[fila];
      let respuesta = datos.respuesta == true ? "Verdadero" : "Falso"; //comprobamos si es verdadero o falso
      rows +=
        "<tr><td>" +
        datos.nombre +
        "</td><td>" +
        respuesta +
        "</td><td>" +
        datos.puntuacion +
        "</td><td>Ok</td></tr>"; //formato de las preguntas
    }
    let resultado = document.getElementById("regpre"); //conseguimos el tbody
    resultado.innerHTML += rows; //imprimimos
    resolve(true);
  });
}

function addpreguntas() { //añadir preguntas
  document.getElementById("enviar").addEventListener("click", function (event) { //funcion para el boton de guardar
    event.preventDefault(); //evitamos propagacion y eventos indeseados
    event.stopPropagation();
    document.getElementById("atras").disabled = true; //se desactiva el boton al pulsar guardar
    setTimeout(() => {
      document.getElementById("atras").disabled = false; // después de 5 segundos el boton se vuelve a activar
    }, 5000);

    const pregunta = document.getElementById("preg").value; //valor del campo pregunta
    const verdadero = document.getElementById("v").checked; //valor del campo verdadero
    const falso = document.getElementById("f").checked; //valor del campo falso
    const puntaje = parseInt(document.getElementById("punt").value); //valor del campo puntuacion, lo tranformamos en string
    let resultado = document.getElementById("regpre"); //campo tbody
    let count = resultado.rows.length + 1; //contamos la longitud
    let control = true; //para el checkbox
    let respuesta;

    if (verdadero == true) {
      respuesta = "Verdadero"; //si es verdadero nos enseñara el siguiente texto
    } else if (falso == true) {
      respuesta = "Falso"; //si es falso nos enseñara el siguiente texto
      control = false;
    }
    let resp = { //formato de las preguntas
      nombre: pregunta,
      respuesta: control,
      puntuacion: puntaje,
      estado: "Ok",
    };
    //Actualizar Usuario Actual cookies
    let userdataJson = Cookies.get("actual_usuario"); //conseguimos la cookie del usuario
    let userdata = JSON.parse(userdataJson); //lo transformamos en json
    let nickname = Object.keys(userdata)[0]; //conseguimos la primer posicion del objeto
    const namepreg = "preg" + count;
    userdata[nickname].preguntas[namepreg] = resp;
    let json = JSON.stringify(userdata); //tranformamos en un string
    Cookies.remove("actual_usuario"); //borramos
    Cookies.set("actual_usuario", json, { expires: 365, secure: true }); //creamos la cookie nuevamente
    //actualizar cookies usuarios Antiguos
    let antiguos_usuario = Cookies.get("antiguos_usuario");
    if (
      typeof antiguos_usuario !== typeof undefined &&
      isJson(antiguos_usuario)
    ) {
      // si no esta undefined y la funcion isJson comprueba que es un string
      let olduserdata = JSON.parse(antiguos_usuario); //convertimos a json
      if (typeof olduserdata[nickname] !== typeof undefined) {
        olduserdata[nickname].preguntas =
          userdata[nickname].preguntas[namepreg];
        let oldjson = JSON.stringify(olduserdata); //convertimos en string
        Cookies.remove("antiguos_usuario"); //borramos la cookie
        Cookies.set("antiguos_usuario", oldjson, { //volvemos a crear la cookie
          expires: 365,
          secure: true,
        });
      }
    }
    //funcion settimeout para la carga de preguntas al guardarlas
    window
      .creaHtml(pregunta, respuesta, puntaje, count)
      .then(function (result) {
        resultado.innerHTML += result.html;
        let last_td = document.getElementById(result.namepreg);
        if (last_td.innerText == "Cargando...") {
          setTimeout(function () {
            let last_td = document.getElementById(result.namepreg);
            last_td.innerText = "Ok";
          }, 5000); 
        }
      });
  });
}
//preguntas en la tabla html
function creaHtml(pregunta, respuesta, puntaje, count) {
  const namepreg = "preg" + count;
  let rows =
    "<tr><td>" +
    pregunta +
    "</td><td>" +
    respuesta +
    "</td><td>" +
    puntaje +
    '</td><td id="' +
    namepreg +
    '">Cargando...</td></tr>';
  return new Promise((resolve, reject) => {
    resolve({ html: rows, namepreg: namepreg });
  });
}

function atras() {
  //funcion que se ejecuta al pulsar el boton atras
  document.getElementById("atras").addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    location.href = "./pantalla2.html"; //redireccionamos a pantalla 2
  });
}
