//Analytics json
async function loadJSON() {
    const response = await fetch('../json/sales_february_2025.json');
    const data = await response.json();

    const group = {};
    data.sales.forEach((element) => {
        if (!group[element.date]) {
            group[element.date] = 0;
        }
        group[element.date] += element.amount;
    })

    const label = Object.keys(group).sort();
}

loadJSON();

//link global nav href
const navLinks = document.querySelectorAll('button[data-target]');
const pages = document.querySelectorAll('.page__container');

navLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-target');

        pages.forEach(page => {
            page.style.display = 'none';
        });

        const targetPage = document.getElementById(target);
        if (targetPage) {
            targetPage.style.display = 'block';
        }

        //People API
        if (target === 'people__container') {
            await loadPeople();
        }
    })
})

//Login form
const logoutBtn = document.querySelector(".logoutBtn");

document.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('userEmail');
    const savedPassword = localStorage.getItem('userPassword');

    if (savedEmail && savedPassword) {
        showSite();
    } else {
        hideSite();
    }

    document.addEventListener('submit', (event) => {
        if (event.target && event.target.classList.contains('login__container-form')) {
            event.preventDefault();

            const email = event.target.elements["email"].value.trim();
            const password = event.target.elements["password"].value.trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            if (password.length < 6) {
                alert("Password must be at least 6 characters!");
                return;
            }


            localStorage.setItem("userEmail", email);
            localStorage.setItem("userPassword", password);

            showSite();
        }

    });

    function showSite() {
        const login = document.querySelector('.login');
        const body = document.querySelector('body');
        if (login) {
            login.style.display = "none";
        }
        body.classList.remove('body__hidden');
        body.classList.add('body__show');

        document.querySelector("header").style.display = "block";
        document.querySelector("main").style.display = "block";
        document.querySelector("footer").style.display = "block";

    }

    function hideSite() {
        const body = document.querySelector('body');

        body.classList.remove('body__show');
        body.classList.add('body__hidden');

        document.querySelector('.login').style.display = "block";
        document.querySelector("header").style.display = "none";
        document.querySelector("main").style.display = "none";
        document.querySelector("footer").style.display = "none";

    }

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userPassword");
        hideSite();


    });
})


//Switcher background
const switcher = document.querySelector('.switcher');
const header = document.querySelector('.global__nav');
const body = document.querySelector('body');
const navItems = document.querySelectorAll('.global__nav-list-item');
const listName = document.querySelectorAll('.main__title');

let isDefault = true;

function applyTheme() {
    const cards = document.querySelectorAll('.people__card');

    if (isDefault) {
        header.style.backgroundColor = "white";
        body.style.backgroundColor = "var(--index-login-part-alternative-global-background-color)";
        body.style.color = "black";
        logoutBtn.style.color = "black";
        switcher.style.backgroundColor = "black";
        switcher.style.color = "white";
        cards.forEach(card => {
            card.style.border = "1px solid var(--people-border-color-dark)";
        })
        listName.forEach((item) => {
            item.style.color = "black";
        })

        filterBtns.forEach(btn => {
            btn.style.color = "black";
        })
        navItems.forEach(navItem => {
            navItem.style.color = "black";
        })

    } else {
        header.style.backgroundColor = "rgba(145,142,142,0.3)";
        body.style.backgroundColor = "black";
        body.style.color = "white";
        switcher.style.backgroundColor = "white";
        logoutBtn.style.color = "white";
        switcher.style.color = "black";

        cards.forEach(card => {
            card.style.border = "1px solid white";
        })
        listName.forEach((item) => {
            item.style.color = "white";
        })
        filterBtns.forEach(btn => {
            btn.style.color = "white";
        })
        navItems.forEach(navItem => {
            navItem.style.color = "white";
        })
    }
}

switcher.addEventListener('click', () => {
    isDefault = !isDefault;
    applyTheme();
})


//To Do List
const input = document.querySelector(".footer__input");
const btn = document.querySelector(".footer__btn");
const titles = document.querySelectorAll(".main__title");
const clearBtn = document.querySelector(".footer__clear-btn");
const filterBtns = document.querySelectorAll(".filter-btn");

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

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        lists.forEach(list => {
            const tasks = list.container.querySelectorAll('.main__task');
            tasks.forEach(task => {
                const isCompleted = task.classList.contains('main__task-complete');
                if (filter === 'all') {
                    task.style.display = 'flex';
                } else if (filter === 'completed') {
                    task.style.display = isCompleted ? 'flex' : 'none';
                } else if (filter === 'uncompleted') {
                    task.style.display = !isCompleted ? 'flex' : 'none';
                }
            });
        });
    });
});

function createTask(container, textContent) {
    const task = document.createElement('div');
    task.classList.add('main__task');
    task.setAttribute('draggable', 'true');

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('main__delete-btn');
    deleteBtn.textContent = "Delete";

    const editBtn = document.createElement('button');
    editBtn.classList.add('main__edit-btn');
    editBtn.textContent = "Edit";

    const img = document.createElement('img');
    img.src = '/img/un-complete.png';
    img.alt = 'un-complete';
    img.classList.add('main__task-un-complete');

    const text = document.createElement('p');
    text.textContent = textContent;
    text.classList.add('main__task-text');

    task.appendChild(img);
    task.appendChild(text);
    task.appendChild(editBtn);
    task.appendChild(deleteBtn);

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

    deleteBtn.addEventListener('click', () => {
        task.remove();
        save();
    })

    editBtn.addEventListener('click', () => {
        const newText = prompt("Edit your task:", text.textContent);
        if (newText !== null && newText.trim() !== "") {
            text.textContent = newText;
            save();
        }
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

clearBtn.addEventListener('click', (event) => {
    lists.forEach(list => {
        list.container.innerHTML = '';
    });

    localStorage.removeItem('lists');
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

//People API
async function loadPeople() {
    const container = document.querySelector('.people__list');

    try {
        const link = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await link.json();

        container.innerHTML = '';

        data.forEach((item) => {
            const card = document.createElement('div');
            card.classList.add('people__card');
            card.innerHTML = `
                <h3>${item.name}</h3>
                <p>Email: ${item.email}</p>
                <p>Phone: ${item.phone}</p>
                <p>Company: ${item.company.name}</p>
            `;
            container.appendChild(card);

        });

        applyTheme();
    } catch (error) {
        container.innerHTML = 'Error loading info';
    }
}
