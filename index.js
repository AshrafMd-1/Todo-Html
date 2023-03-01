const todoEl = document.getElementById('todo');
const dateEl = document.getElementById('date');
const addEl = document.getElementById('add');
const overdueEl = document.getElementById('overdue');
const todayEl = document.getElementById('today');
const upcomingEl = document.getElementById('upcoming');


let items = [];
addEl.addEventListener('click', () => {
    const todo = todoEl.value;
    const date = dateEl.value;
    const id = items.length + 1;
    const completed = false;
    items.push({id, todo, date, completed});
    localStorage.setItem('items', JSON.stringify(items));
    render();
})

const getStorage = () => {
    const storage = localStorage.getItem('items');
    if (storage) {
        items = JSON.parse(storage);
    } else {
        return [];
    }
}

const dayRem = (date) => {
    const days=(new Date(date).setUTCHours(0,0,0,0)-new Date().setUTCHours(0,0,0,0))/(1000*60*60*24);
    if (days===0) {
        return 'Today is the day!'
    } else if (days>=1) {
        return `${days} days left`
    }else{
        return `Already overdue`
    }
}

const render = () => {
    const listCreate = (list, parent) => {
        list.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `${item.todo} - ${dayRem(item.date)} ${item.completed ? '[x]' : '[ ]'}`
            li.style.textDecoration = item.completed ? 'line-through' : 'none';
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = 'Delete';
            li.addEventListener('click', () => {
                const index = items.findIndex(i => i.id === item.id);
                items[index].completed = !items[index].completed;
                localStorage.setItem('items', JSON.stringify(items));
                render();
            });
            deleteBtn.addEventListener('click', () => {
                const index = items.findIndex(i => i.id === item.id);
                items.splice(index, 1);
                localStorage.setItem('items', JSON.stringify(items));
                render();
            });
            li.appendChild(deleteBtn);
            parent.appendChild(li);
        })
    }
    const overdue = items.filter(item => {
        const today = new Date().setUTCHours(0,0,0,0);
        const itemDate = new Date(item.date).setUTCHours(0,0,0,0);
        return itemDate < today;
    });
    const today = items.filter(item => {
        const today = new Date().setUTCHours(0,0,0,0);
        const itemDate = new Date(item.date).setUTCHours(0,0,0,0);
        console.log(`Items Date - ${itemDate}\n Today's Date - ${today}`);
        return itemDate === today;
    });
    const upcoming = items.filter(item => {
        const today = new Date().setUTCHours(0,0,0,0);
        const itemDate = new Date(item.date).setUTCHours(0,0,0,0);
        return itemDate > today;
    });
    overdueEl.innerHTML = '';
    todayEl.innerHTML = '';
    upcomingEl.innerHTML = '';
    listCreate(overdue, overdueEl);
    listCreate(today, todayEl);
    listCreate(upcoming, upcomingEl);
};


getStorage();
render();