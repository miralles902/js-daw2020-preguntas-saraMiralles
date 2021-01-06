document.addEventListener("DOMContentLoaded", function () {
  //comprobación de que el DOM ha cargado correctamente
  window.usersdata(); // ejecutamos la funcion usersdata()
});

function usersdata() {
  let userdata = Cookies.get("actual_usuario"); // conseguimos el usuario que acabamos de introducir
  if (typeof userdata !== typeof undefined && isJson(userdata)) {
    //si userdata es un json y no esta no definido
    let view = document.getElementById("entrada");
    let boton = document.getElementById("boton");
    userdata = JSON.parse(userdata); //convertimos userdata en json
    let nickname = Object.keys(userdata)[0];
    let entrada = `hola <b>` + nickname + `</b><br>`;
    let date = userdata[nickname].fecha;
    let hour = userdata[nickname].hora;
    let olduser = Cookies.get("antiguos_usuario"); //conseguimos el listado de usuarios
    let check = false;
    if (typeof olduser !== typeof undefined && isJson(olduser)) {
      //si el usuario introducido anteriormente no esta no definido y esta en formato json
      olduser = JSON.parse(olduser); //lo convertimos en json
      if (typeof olduser[nickname] != typeof undefined) {
        //si el nombre no esta no definido en el usuario anterior
        let userdata = {};
        userdata[nickname] = {
          //se crea el json del usuario
          fecha: date,
          hora: hour,
          preguntas: { ...olduser[nickname].preguntas }, //se le asignan preguntas
        };
        let json = JSON.stringify(userdata); //se convierte el json en string
        Cookies.remove("actual_usuario"); //se elimina el usuario actual
        Cookies.set("actual_usuario", json, { expires: 365 }); //se guarda el usuario actual
        check = true;
      }
    }
    if (check) {
      //si es verdadero se muestran los datos de la anterior sesion
      entrada =
        entrada +
        `Se ha detectado que anteriormente has accedido:<br> 
                La ultima vez que entraste fue el dia: <b>` +
        olduser[nickname].fecha +
        `</b><br>
                a las: <b>` +
        olduser[nickname].hora +
        `</b><br>`;
    } else {
      //si es falso se muestran los nuevos datos del usuario
      entrada =
        entrada +
        `Se ha detectado que es la primera vez que accedes:<br>
                Fecha Actual de conexion: <b>` +
        userdata[nickname].fecha +
        `</b><br>
                Hora Actual de conexion: <b>` +
        userdata[nickname].hora +
        `</b><br>`;
    }
    view.innerHTML = entrada; //pasamos entrada al html para que se visualice
    boton.innerHTML =
      '<input type="submit" value="Preguntas" id="cargarpreg" />'; //boton de la pagina de preguntas
    document
      .getElementById("cargarpreg")
      .addEventListener("click", function () {
        //si pulsamos el boton nos redirigirá a la pagina de preguntas
        location.href = "./preguntas.html"; //redireccionamos a preguntas
      });
  } else {
    alert("no existe ningun usuario actual seras redirigido al inicio."); //si no hay ningun usuario nos redirigirá al inicio
    location.href = "./index.html";
  }
}
