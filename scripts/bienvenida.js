document.addEventListener("DOMContentLoaded", function () {
  //comprobación de que el DOM ha cargado correctamente
  window.bienvenida().then(function (result) {
    //cuando se ejecuta la funcion bienvenida pasa la función olduser donde guardamos el usuario
    window.olduser().then(function (result) {
      // funcion donde guardamos el usuario
      window.user(); //finalmente accedemos a la funcion user donde se comprobará el funcionamiento del input,el focusout y que el email se ingrese correctamente
    });
  });
});

function bienvenida() {
  return new Promise(function (resolve, reject) {
    let ocurre = false; //si ocurre = false
    setTimeout(function () {
      if (!ocurre) {
        window.updatebienvenida().then(function (result) {
          //por el contrario si no pulsamos ninguna tecla después de 5 segundos ejecutará la funcion updatebienvenid
          resolve(true);
        });
      }
    }, 5000);
    document.addEventListener("keydown", (event) => {
      //al pulsar las siguientes teclas
      if (event.ctrlKey && event.keyCode === 121) {
        //hará lo siguiente:
        event.preventDefault();
        event.stopPropagation();
        ocurre = true; //si ocurre = true
        window.updatebienvenida().then(function (result) {
          //ejecutará la funcion updatebienvenida donde se crea el formulario.
          resolve(true);
        });
      }
    });
  });
}

function updatebienvenida() {
  //funcion de creacion del formulario
  return new Promise(function (resolve, reject) {
    console.log("pimtamos form");
    let bienvenida = document.getElementById("welcome");
    bienvenida.innerHTML =
      '<form><label for="user">Usuario</label><input type="text" id="user"><p id="error"></p></form>'; //creamos el fomulario y sus elementos
    resolve(true);
  });
}

function olduser() {
  return new Promise(function (resolve, reject) {
    console.log("Analisis old User");
    let old_users = Cookies.get("actual_usuario"); //mostramos la cookie que hemos creado con el usuario introducido
    let old_users_list = Cookies.get("antiguos_usuario"); //mostramos la cookie del listado de usuarios que ya tenemos
    if (typeof old_users !== typeof undefined && isJson(old_users)) {
      // si no esta undefined y la funcion isJson comprueba que es un string
      old_users = JSON.parse(old_users); //convierte en json el usuario introducido
      if (
        typeof old_users_list !== typeof undefined &&
        isJson(old_users_list)
      ) {
        // si no esta undefined y la funcion isJson comprueba que es un string
        old_users_list = JSON.parse(old_users_list); //convierte el listado en json
        old_users_list = { ...old_users_list, ...old_users }; // y junta el listado de usuarios con el nuevo usuario
      } else {
        old_users_list = { ...old_users }; //sino solo añade el usuario introducido
      }
      console.log(old_users_list);
      let json = JSON.stringify(old_users_list); //convertidmos la lista de usuarios en string
      Cookies.set("antiguos_usuario", json, { expires: 365, secure: true }); //y la colocamos en la cookie antiguos_usuario para guardarla, expirará en 365 dias
      Cookies.remove("actual_usuario"); //borramos la cookie actual_usuario ya que ya la tenemos guardada en la anterior lista.
      resolve(true);
    } else {
      resolve(true);
    }
  });
}

function user() {
  let usuario = document.getElementById("user");
  usuario.addEventListener("blur", function (event) {
    //cuando pulsamos fuera del input realizara la siguiente funcion (se puede usar blur o focusout)
    event.preventDefault();
    event.stopPropagation();
    var regExpUser = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(
      event.target.value
    ); //regexp de validacion de correo
    if (regExpUser) {
      const username = document.getElementById("user").value; //conseguimos el valor del input
      let fecha = window.getDate(); //formato de la fecha
      let hora = window.getHour(); //formato de la hora
      let userdata = {};

      userdata[username] = {
        //creamos el json para guardar el usuario, la fecha y la hora
        fecha: fecha, //la fecha se recibe desde la funcion getDate() en shared.js
        hora: hora, //la hora se recibe desde la funcion getHour() en shared.js
        recargar: true,
        preguntas: {}, //preguntas del usuario
      };
      let json = JSON.stringify(userdata); //convertimos el json en un string para guardarlo en la cookie
      Cookies.set("actual_usuario", json, { expires: 365, secure: true }); //guardar usuario
      location.href = "./pantalla2.html"; //redireccionamos a pantalla 2
    } else {
      const resultado = document.getElementById("error");
      resultado.innerHTML = "Introduce de nuevo el usuario"; //damos el mensaje de error al usuario
      usuario.select();
    }
  });
}
