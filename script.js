window.addEventListener('DOMContentLoaded', () => {
  
  const content = document.querySelector('.content');
  let tasks = [];
  
  function loadAllData() {
    const webStorage = localStorage.getItem('todo');
    tasks = (webStorage) ? JSON.parse(webStorage) : [];
    tasks.forEach(task => {
      const result = render(task);
      content.appendChild(result);
    });
  }
  
  loadAllData();
  
  const input = document.querySelector('.add-input');
  const button = document.querySelector('.add-button');
  button.addEventListener('click', function() {
    const value = input.value.trim();
    if (validate(value) == true) {
      tasks.push(value);
      saveToLocalStorage();
      const result = render(value);
      content.appendChild(result);
      clearValue();
    }
  });
  
  function validate(value) {
    if (!value) return sweetalert('error', 'Error', 'input masih kosong!');
    if (value.length < 3) return sweetalert('error', 'Error', 'terlalu pendek!');
    if (value.length > 400) return sweetalert('error', 'Error', 'terlalu panjang!');
    return true;
  }
  
  function sweetalert(icon, title, text, position = 'center') {
    return swal.fire ({
      icon: icon,
      position: position,
      title: title,
      text: text
    });
  }
  
  function saveToLocalStorage() {
    localStorage.setItem('todo', JSON.stringify(tasks));
  }
  
  function clearValue() {
    input.value = '';
  }
  
  function create(name, classname, show = false, value = '') {
    const element = document.createElement(name);
    element.className = !classname ? '' : classname;
    if (show == true) {
      const elementValue = document.createTextNode(value);
      element.appendChild(elementValue);
      return element;
    }
    return element;
  }
  
  function getClass() {
    return {
      box: 'bg-white p-3 rounded shadow d-flex justify-content-between align-items-center mb-2',
      text: 'fw-light my-auto',
      button: 'btn btn-outline-danger'
    }
  }
  
  function render(value) {
    const classname = getClass();
    const box = create('div', classname.box);
    const text = create('p', classname.text, true, value);
    const button = create('button', classname.button, true, 'hapus');
    button.addEventListener('click', deleteData);
    box.appendChild(text);
    box.appendChild(button);
    searchData(box, value);
    return box;
  }
  
  function deleteData(event) {
    const text = event.target.previousElementSibling.textContent;
    tasks.splice(tasks.indexOf(text), 1);
    saveToLocalStorage();
    document.location.href = 'index.html';
  }
  
  function searchData(box, param) {
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('keyup', function() {
      const value = this.value.toLowerCase();
      setClass(box, param, value);
    });
  }
  
  function setClass(box, param, value) {
    if (param.toLowerCase().indexOf(value) != -1) {
      box.classList.add('d-block');
      box.classList.remove('d-none');
    } else if (value == '') {
      box.classList.remove('d-block');
      box.classList.remove('d-none');
      box.classList.add('');
    } else {
      box.classList.add('d-none');
      box.classList.remove('d-block');
    }
  }
  
});