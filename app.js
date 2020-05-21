// 1. Grab necessary HTML elements
// Grab form
const todoForm = document.querySelector('.todo-form');
// Grab the ul list
const list = document.querySelector('.list');

// 2. This array will hold the todo items
let todos = [];

// 3. APP FUNCTIONS
// HandleSubmit - this will listen to the submit button on the form
function handleSubmit(e) {
    e.preventDefault()
    const name = e.currentTarget.item.value;
    const item = {
        name,
        id: Date.now(),
        complete: false
    }
    // Push item into state
    todos.push(item);
    // Clear input after adding item
    e.target.reset();
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

// This function displays the todos on the page
function displayTodos() {
    list.innerHTML = todos.map(todo => `
        <li>
            <input type="checkbox" value="${todo.id}" ${todo.complete ? 'checked' : ""}>
            <span>${todo.name}</span>
            <button
                aria-label="Remove ${todo.name}"
                value="${todo.id}"
            >&times;</button>
        </li>`
    ).join('');
}

// This function marks the todo complete
function markComplete(id) {
    const itemRef = todos.find(item => item.id == id);
    console.log(todos);
    itemRef.complete = !itemRef.complete;
    list.dispatchEvent(new CustomEvent('itemsUpdated'))
}

function deleteItem(id) {
    todos = todos.filter(todo => todo.id !== id);
    list.dispatchEvent(new CustomEvent('itemsUpdated'))
}

function saveToLS() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function restoreFromLocalStorage() {
    const localStorageTodos = JSON.parse(localStorage.getItem('todos'))
    if(localStorageTodos.length) {
        todos = localStorageTodos;
        list.dispatchEvent(new CustomEvent('itemsUpdated'))
    }
}



// 4. EVENT LISTENERS
todoForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayTodos);
list.addEventListener('itemsUpdated', saveToLS)
list.addEventListener('click', function(e) {
    const id = parseInt(e.target.value)
    if(e.target.matches('button')) {
        deleteItem(id);
    }
    if(e.target.matches('input[type="checkbox"]')) {
        markComplete(id)
    }
})


// 5. PULL FROM LOCAL STORAGE
restoreFromLocalStorage()