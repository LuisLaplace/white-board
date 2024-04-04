// Retrieve tasks and nextId from localStorage
let taskList = readTasksFromStorage();
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
const myModal = document.getElementById('myModal')
const myInput = document.getElementById('myInput')
// Todo: create a function to generate a unique task id
function generateTaskId() {
    const taskId = nextId;
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return taskId;
}
// I want to accept an array of tasks, stringifys, and save them in local storage
function saveTasksToStorage(taskList) {
    localStorage.setItem("tasks", JSON.stringify(taskList));
}
// read task form local storage and return array or task objects
function readTasksFromStorage() {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $(`<div class="task-card" id="task-${task.id}"></div>`);
    const cardHeader = $(`<h3>${task.title}</h3>`);
    const cardDescription = $(`<p>${task.description}</p>`);
    const cardDueDate = $(`<p>Due Date: ${task.dueDate}</p>`);
    const cardDeleteBtn = $(`<button class="deleteTaskBtn" data-task-id="${task.id}">Delete</button>`);
    // Set the card background color based on due date
    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    // Append elements to the task card
    taskCard.append(cardHeader, cardDescription, cardDueDate, cardDeleteBtn);
    // Add event listener for delete button
    cardDeleteBtn.on('click', handleDeleteTask);
    // Determine the appropriate container based on task status
    let taskContainer;
    if (task.status === 'todo') {
        taskContainer = $('#todo-cards');
    } else if (task.status === 'in-progress') {
        taskContainer = $('#in-progress-cards');
    } else if (task.status === 'done') {
        taskContainer = $('#done-cards');
    }
    // Append the task card to the corresponding container
    taskContainer.append(taskCard);

    return taskCard;
}
// Todo: create a function to render the task list and make cards draggable
function handleAddTask(event) {
    event.preventDefault();
    console.log('Form submitted. handleAddTask function called.');

    const taskTitle = $('#taskTitle').val();
    const taskDescription = $('#taskDescription').val();
    const taskDueDate = $('#taskDueDate').val();
    const taskStatus = 'todo';
    const newTask = {
        id: generateTaskId(),
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate,
        status: taskStatus,
    };
    taskList.push(newTask); // Add the new task to the taskList array
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        taskList = savedTasks;
    }
    saveTasksToStorage(taskList); // Save the updated taskList to localStorage
    // After adding a new task, let's explicitly call renderTaskList to update the UI
    renderTaskList(); // Render the updated task list
}
// Todo: create a function to handle adding a new task
function renderTaskList() {
    taskList.forEach(task => {
        createTaskCard(task);
    });
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = parseInt($(this).attr('data-task-id')); // Convert task ID to a number
    // Filter out the task with the matching ID
    taskList = taskList.filter(task => task.id !== taskId);

    saveTasksToStorage(taskList); // Save the updated taskList to localStorage
    renderTaskList(); // Render the updated task list
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = parseInt(ui.draggable.attr('data-task-id')); // Convert task ID to a number
    const newStatus = $(this).attr('data-status');
    // Find the index of the task in the taskList array
    const taskIndex = taskList.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        // Update the status of the task at the found index
        taskList[taskIndex].status = newStatus;

        // Save the updated taskList to localStorage
        saveTasksToStorage(taskList);

        // Render the updated task list
        renderTaskList();
    }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function() {
    document.getElementById('addTaskForm').addEventListener('submit', handleAddTask);
    $('.deleteTaskBtn').click(handleDeleteTask); // Delete task when delete button is clicked
    // Make status lanes droppable
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop
    });
    // Initialize date picker for the due date field
    $('#taskDueDate').datepicker({
        changeMonth: true,
        changeYear: true
    });
    // Show modal when open button is clicked
    $('#openModalButton').click(function () {
        $('#formModal').modal('show');
    });
});