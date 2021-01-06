function isJson(str) {
  //comprobacion de string
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function getDate() {
  //funcion para conseguir la fecha y darle formato.
  let d = new Date(), //fecha y hora del sistema
    month = "" + (d.getMonth() + 1), //mes
    day = "" + d.getDate(), //dia
    year = d.getFullYear(); //año
  if (month.length < 2) { 
    month = "0" + month;
  }
  if (day.length < 2) { 
    day = "0" + day;
  }
  return [day, month, year].join("-"); // devolvemos formato
}

function getHour() {
  //funcion para conseguir la hora y darle formato.
  let d = new Date(), //fecha y hora del sistema
    hours = d.getHours(),
    minutes = d.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am"; //formato
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm; //formato
  return strTime; //devolvemos la hora
}

function show(elem) {
  //mostrar elemento
  elem.style.display = "block";
}

function hide(elem) {
  //esconder elemento
  elem.style.display = "none";
}
