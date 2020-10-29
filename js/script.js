//
// Lista de tareas
//

//
// Modelo.
//

// Contador de tareas (para asignar un id único a cada tarea).
let contadorTareas = 0;
// Lista de tareas (Array).
let tareas = [];
//Trata de obtener la lista de tareas de localStorage,
//si el resultado es distinto de 'null', usa las tareas almacenadas.

//SE ELIMINA PARA USAR EL FETCH
// const datosLocalStorage = localStorage.getItem('tareas');
// if (datosLocalStorage) {
//   tareas = JSON.parse(datosLocalStorage);
// }

fetch("https://js2-tareas-api.netlify.app/api/tareas?uid=24")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    //appendTaskDOM();
    tareas = data;
    // Inicialización de la lista del DOM, a partir de las tareas existentes.
    for (let i = 0; i < tareas.length; i++) {
      appendTaskDOM(tareas[i]);
    }
  });

//Se lee el contador de tareas del localStorage.
const contadorLocalStorage = localStorage.getItem('contador');
console.log(contadorLocalStorage);

console.log(tareas);

if (contadorLocalStorage) {
  contadorTareas = parseInt(contadorLocalStorage);
}

// addTask(): Agrega una tarea en la lista.
function addTask(nombreTarea, fechaTarea, completoTarea) {
  // Crea un objeto que representa la nueva tarea.
  const nuevaTarea = {
    _id: contadorTareas,
    name: nombreTarea,
    complete: completoTarea,
    date: fechaTarea,
  };

  // Agrega el objeto en el array.
  tareas.push(nuevaTarea);

  // Incrementa el contador de tareas.
  contadorTareas++;
  // Se guarda el contador de tareas en localStorage.
  localStorage.setItem('contador', contadorTareas);

  // Agrega la tarea al DOM.
  appendTaskDOM(nuevaTarea);

  // Guarda la lista de tareas en localStorage.
  localStorage.setItem('tareas', JSON.stringify(tareas));
}

// taskStatus(): Actualiza el estado de una tarea.
function taskStatus(id, complete) {
  // Recorre la lista de tareas.
  for (let i = 0; i < tareas.length; i++) {
    // Cuando encuentra la tarea con el id correcto cambia su estado.
    if (tareas[i]._id === id) {
      tareas[i].complete = complete;
      break;
    }
  }
  // Guarda la lista de tareas en localStorage.
  localStorage.setItem('tareas', JSON.stringify(tareas));
}

// deleteTask(): Borra una tarea.
function deleteTask(id) {
  // Recorre la lista de tareas.
  for(let i = 0; i < tareas.length; i++) {
    // Cuando encuentra la tarea con el id correcto la borra.
    if(tareas[i]._id === id) {
      tareas.splice(i, 1);
      break;
    }
  }
  // Guarda la lista de tareas en localStorage.
  localStorage.setItem('tareas', JSON.stringify(tareas));
}

//
// Vista.
//

// Lista de tareas (DOM).
const lista = document.getElementById('task-list');

function appendTaskDOM(tarea) {
  // Item de la lista
  const item = document.createElement('li');
  item.className = 'task-list__item';
  // Checkbox.
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('id', `tarea-${tarea._id}`);
  checkbox.checked = tarea.complete;
  // Label.
  const label = document.createElement('label');
  label.setAttribute('for', `tarea-${tarea._id}`);
  label.innerHTML = `${tarea.name} - ${tarea.date}`;
  // Botón de borrar.
  const buttonDelete = document.createElement('button');
  buttonDelete.className = 'task-list__delete';
  buttonDelete.setAttribute('id', `delete-${tarea._id}`);
  buttonDelete.innerHTML = 'Borrar';
  // Se agregan elementos.
  item.appendChild(checkbox);
  item.appendChild(label);
  item.appendChild(buttonDelete);
  lista.appendChild(item);
  // Evento para marcar tareas como completas.
  checkbox.addEventListener('click', (event) => {
    const complete = event.currentTarget.checked;
    const itemId = event.currentTarget.getAttribute('id');
    const taskId = parseInt(itemId.substring(6));
    taskStatus(taskId, complete);
  });
  // Evento para borrar tareas.
  buttonDelete.addEventListener('click', (event) => {
    const itemId = event.currentTarget.getAttribute('id');
    const taskId = parseInt(itemId.substring(7));
    deleteTask(taskId);
    // Borra la tarea en el DOM.
    event.currentTarget.parentNode.remove();
  });
}

// SE PASA AL FETCH
// Inicialización de la lista del DOM, a partir de las tareas existentes.
// for (let i = 0; i < tareas.length; i++) {
//   appendTaskDOM(tareas[i]);
// }

//
// Controlador.
//

// Formulario para añadir tareas.
const formulario = document.getElementById('new-task-form');

// Event handler para el evento 'submit' del formulario.
// Crea una nueva tarea.
formulario.addEventListener('submit', (event) => {
  // Se cancela el comportamiento default del formulario.
  event.preventDefault();

  // Agrega el nuevo ítem al modelo.
  addTask(formulario.elements[0].value, formulario.elements[1].value, false);

  // Reseteamos el form.
  formulario.elements[0].value = '';
  formulario.elements[1].value = '';
});
