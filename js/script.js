//
// Lista de tareas
//

// eslint-disable no-underscore-dangle, no-plusplus //

//
// Modelo.
//

// API User ID - CAMBIARLO al User ID que tienen asignado.
const myId = 24;
// Lista de tareas (Array).
let tareas = [];

// Se obtiene el listado inicial de tareas a partir del API.
fetch(`https://js2-tareas-api.netlify.app/api/tareas?uid=${myId}`)
  .then((response) => response.json())
  .then((data) => {
    tareas = data;
    // Inicialización de la lista del DOM, a partir de las tareas existentes.
    for (let i = 0; i < tareas.length; i++) {
      appendTaskDOM(tareas[i]); // eslint-disable-line no-use-before-define
    }
  });

// addTask(): Agrega una tarea en la lista.
function addTask(nombreTarea, fechaTarea, completoTarea) {
  // Crea un objeto que representa la nueva tarea.
  const nuevaTarea = {
    name: nombreTarea,
    complete: completoTarea,
    date: fechaTarea,
  };

  // Agrega el objeto en el array.
  tareas.push(nuevaTarea);

  // Envía la nueva tarea al API.

  // Opciones para el fetch.
  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify(nuevaTarea),
  };
  // Ejecuta el fetch.
  fetch(`https://js2-tareas-api.netlify.app/api/tareas?uid=${myId}`, fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      // Agrega la tarea al DOM.
      appendTaskDOM(data); // eslint-disable-line no-use-before-define
    });
}

// taskStatus(): Actualiza el estado de una tarea.
function taskStatus(id, complete) {

  let ready = '';
  // Recorre la lista de tareas.
  for (let i = 0; i < tareas.length; i++) {
    // Cuando encuentra la tarea con el id correcto cambia su estado.
    if (tareas[i]._id === id) {
      tareas[i].complete = complete;
      ready = tareas[i]
      break;
    }
  }


  const fetchComplete = {
    method: 'PUT',
    body: JSON.stringify(ready)
  };

  fetch(`https://js2-tareas-api.netlify.app/api/tareas/${id}?uid=${myId}`, fetchComplete)
  .then((response) => response.json())
  .then((data) => {
    appendTaskDOM(data);
  });

}

// deleteTask(): Borra una tarea.
function deleteTask(id) {
  // Recorre la lista de tareas.
  for (let i = 0; i < tareas.length; i++) {
    // Cuando encuentra la tarea con el id correcto la borra.
    if (tareas[i]._id === id) {
      tareas.splice(i, 1);
      break;
    }
  };

  const fetchDelete = {
    method : 'DELETE'
  };

  fetch(`https://js2-tareas-api.netlify.app/api/tareas/${id}?uid=${myId}`, fetchDelete)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });
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
    console.log(itemId)
    const taskId = itemId.substring(6);
    taskStatus(taskId, complete);
  });
  // Evento para borrar tareas.
  buttonDelete.addEventListener('click', (event) => {
    const itemId = event.currentTarget.getAttribute('id');
    const taskId = itemId.substring(7);
    deleteTask(taskId);
    // Borra la tarea en el DOM.
    event.currentTarget.parentNode.remove();
  });
}

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
