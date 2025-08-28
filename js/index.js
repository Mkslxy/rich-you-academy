//Analytics json
async function loadJSON() {
    const response = await fetch('../json/sales_february_2025.json');
    const data = await response.json();

//Line Chart
    const groupLine = {};
    data.sales.forEach((element) => {
        if (!groupLine[element.date]) {
            groupLine[element.date] = 0;
        }
        groupLine[element.date] += element.amount;
    })

    const labels = Object.keys(groupLine).sort();
    const valuesLine = labels.map(item => (groupLine[item]));

    new Chart(document.querySelector(".analytics__sales-chart"), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Product Sales',
                data: valuesLine,
                borderColor: 'white',
                backgroundColor: 'rgba(181,170,170,0.2)',
                fill: true,
                tension: 0.3,
                pointRadius: 5,
                pointBackgroundColor: 'black',
                pointHoverRadius: 15,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {display: true, text: 'Date'}
                },
                y: {
                    title: {display: true, text: 'Sums sales'}
                }
            },
            plugins: {
                legend: {display: true},
                tooltip: {display: true},
            }
        }
    });

//Bar Chart
    const groupLead = {};
    data.sales.forEach((element) => {
        if (element.isLead) {
            groupLead[element.date] = (groupLead[element.date] || 0) + 1;
        }
    });

    const valuesLead = labels.map(item => groupLead[item] || 0);


    new Chart(document.querySelector(".analytics__leads-chart"), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Lead per day',
                data: valuesLead,
                backgroundColor: 'rgba(108,101,101,0.2)',

            }],
            options: {
                x: {title: {display: true, text: 'Date', color: 'white'}, ticks: {color: 'white'}},
                y: {title: {display: true, text: 'Leads count', color: 'white'}, ticks: {color: 'white'}},
            },
            plugins: {
                legend: {labels: {color: 'white'}},
                tooltip: {enabled: true},
            }
        }
    });

    //Circle Chart
    const orders = {};
    data.sales.forEach((element) => {
        if (!orders[element.customerId]) {
            orders[element.customerId] = 1;
        } else {
            orders[element.customerId] += 1;
        }
    });

    const categories = {"1 sale": 0, "2 sales": 0, "3 sales": 0, "4+ sales": 0};

    Object.values(orders).forEach(order => {
        if (order === 1) {
            categories["1 sale"]++;
        } else if (order === 2) {
            categories["2 sales"]++;
        } else if (order === 3) {
            categories["3 sales"]++;
        } else {
            categories["4+ sales"]++;
        }
    });

    new Chart(document.querySelector(".analytics__circle-chart"), {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ['#4CAF50', '#FF9800', '#F44336', '#5e6c5e'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {enabled: true},
            }
        }
    });

    //Second Line Chart
    const secondGroupLine = {};
    data.sales.forEach((element) => {
        if (!secondGroupLine[element.date]) {
            secondGroupLine[element.date] = 0;
        }
        secondGroupLine[element.date] += element.amount;
    })


    new Chart(document.querySelector(".analytics__second-line-chart"), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Product Sales',
                data: valuesLine,
                borderColor: 'white',
                backgroundColor: 'rgba(177,140,140,0.2)',
                fill: true,
                tension: 0.3,
                pointRadius: 5,
                pointBackgroundColor: 'black',
                pointHoverRadius: 15,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {display: true, text: 'Date'}
                },
                y: {
                    title: {display: true, text: 'Sums sales'}
                }
            },
            plugins: {
                legend: {display: true},
                tooltip: {display: true},
            }
        }
    });

    //Radar Chart
    const salesByManagers = {};

    data.sales.forEach((element) => {
        if (!salesByManagers[element.manager]) {
            salesByManagers[element.manager] = 0;
        }
        salesByManagers[element.manager] += element.amount;
    });

    const managerLabels = Object.keys(salesByManagers);
    const managerValues = managerLabels.map(item => salesByManagers[item]);

    new Chart(document.querySelector(".analytics__radar-chart"), {
        type: 'radar',
        data: {
            labels: managerLabels,
            datasets: [{
                label: 'Sales by Manager',
                data: managerValues,
                backgroundColor: 'rgba(181,170,170,0.2)',
                borderColor: 'white',
                pointBackgroundColor: 'black'
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    angleLines: {color: 'black'},
                    grid: {color: 'gray'},
                    pointLabels: {color: 'gray'},
                }
            },
            plugins: {
                legend: {labels: {color: 'white'}},
                tooltip: {enabled: true}
            }
        }
    });


    //Tables

    //Table income by manager

    const managerIncome = {};
    const firstContainer = document.querySelector('.analytics__container-first');
    const secondContainer = document.querySelector('.analytics__container-second');

    data.sales.forEach((element) => {
        const {manager, amount} = element;
        if (!managerIncome[manager]) {
            managerIncome[manager] = {orders: 1, revenue: amount};
        } else {
            managerIncome[manager].orders += 1;
            managerIncome[manager].revenue += amount;
        }
    });

    const managerTable = document.createElement("table");
    managerTable.classList.add('analytics__container-manager-table');
    managerTable.innerHTML = `
        <table class="manager-table">
    <caption><strong>Income Managers</strong></caption>
      <tr>
        <th>Manager</th>
        <th>Orders</th>
        <th>Revenue</th>
        <th>Avg Check</th>
      </tr>
    <tbody>
      ${Object.entries(managerIncome).map(([manager, stats]) => `
        <tr>
          <td>${manager}</td>
          <td>${stats.orders}</td>
          <td>${stats.revenue}</td>
          <td>${(stats.revenue / stats.orders).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
`;
    //Table income by low product

    const productIncome = {};
    data.sales.forEach((element) => {
        const {product, amount} = element;
        if (!productIncome[product]) {
            productIncome[product] = {units: 1, revenue: amount};
        }else{
            productIncome[product].units += 1;
            productIncome[product].revenue += amount;
        }
    })

    const productTable = document.createElement("table");
    productTable.classList.add('analytics__container-manager-table');
    productTable.innerHTML = `
    <caption><strong>Income with low products</strong></caption>
        <tr>
            <th>Product</th>
            <th>Units</th>
            <th>Revenue</th>
            <th>Turnover</th>
        </tr>
        ${Object.entries(productIncome)
        .sort((a, b) => a[1].revenue - b[1].revenue)
        .map(([product, stats]) => `
            <tr>
                <td>${product}</td>
                <td>${stats.units}</td>
                <td>${stats.revenue}</td>
                <td>${(stats.revenue / stats.units).toFixed(2)}</td>
            </tr>
        `).join('')}
    `;

    firstContainer.appendChild(managerTable);
    secondContainer.appendChild(productTable);
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
    img.src = 'img/un-complete.png';
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
            img.src = 'img/un-complete.png';
            img.classList.remove('main__task-img-complete');
        } else {
            img.src = 'img/complete.png';
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
