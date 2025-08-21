const input = document.querySelector(".footer__input");
const btn = document.querySelector(".footer__btn");
const titles = document.querySelectorAll(".main__title");

const lists = [
    {
        id: 'list-1',
        container: document.querySelector('#list-1'),
    },
    {
        id: 'list-2',
        container: document.querySelector('#list-2'),
    },
    {
        id: 'list-3',
        container: document.querySelector('#list-3'),
    },
]
let currentList = lists[0];

titles.forEach((title, index) => {
    title.addEventListener('click', () => {
        titles.forEach(titleRemove => titleRemove.classList.remove('main__title-chosen'));

        title.classList.add('main__title-chosen');

        currentList = lists[index];
    })
});

function save() {
    const data = lists.map(list => ({
        id: list.id,
        tasks: Array.from(list.container.querySelectorAll('.main__task-text')).map(text => text.textContent),
    }));
    localStorage.setItem('lists', JSON.stringify(data));
}

function load() {
    const data = JSON.parse(localStorage.getItem('lists'));
    if (!data) {
        return;
    } else {
        data.forEach(savedList => {
            const list = lists.find(list => list.id === savedList.id);
            if (list) {
                list.container.innerHTML = "";
                savedList.tasks.forEach(task => {
                    createTask(list.container, task);
                })
            }
        })
    }
}

function createTask(container, textContent) {
    const task = document.createElement('div');
    task.classList.add('main__task');
    task.setAttribute('draggable', 'true');

    const img = document.createElement('img');
    img.src = '/img/un-complete.png';
    img.alt = 'un-complete';
    img.classList.add('main__task-un-complete');

    const text = document.createElement('p');
    text.textContent = textContent;
    text.classList.add('main__task-text');

    task.appendChild(img);
    task.appendChild(text);

    img.addEventListener('click', () => {

        task.classList.toggle('main__task-complete');
        text.classList.toggle('main__task-text-complete');

        if (img.classList.contains('main__task-img-complete')) {
            img.src = '/img/un-complete.png';
            img.classList.remove('main__task-img-complete');
        } else {
            img.src = '/img/complete.png';
            img.classList.add('main__task-img-complete');
        }

        save();
    });

    task.addEventListener('dragstart', () => {
        task.classList.add('dragging');
    })

    task.addEventListener('dragend', () => {
        task.classList.remove('dragging');
        save();
    })

    container.appendChild(task);
}


function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.main__task:not(.dragging)')];
    const Number = null;

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child};
        } else {
            return closest;
        }
    }, {offset: Number}).element;
}

lists.forEach(list => {
    list.container.addEventListener('dragover', (event) => {
        event.preventDefault();
        const dragging = document.querySelector(".dragging");
        if (!dragging) return;

        const afterElement = getDragAfterElement(list.container, event.clientY);

        if (afterElement == null) {
            list.container.appendChild(dragging);
        } else {
            list.container.insertBefore(dragging, afterElement);
        }
    });
});


function addTask() {
    const text = input.value.trim();
    if (!text) return;

    createTask(currentList.container, text);
    save();
    input.value = '';
}

btn.addEventListener('click', addTask);
input.addEventListener('keypress', event => {
    if (event.key === "Enter") {
        addTask();
    }
});

if (localStorage.getItem('lists')) {
    load();
}

