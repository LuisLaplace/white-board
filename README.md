# 05 Third-Party APIs: Task Board

As a user i want to be able to input a task with a title, due date, and descritpion of the task.  Once the form has been filled out it will  be colored either red(Overdue), yellow(due today), or white(on time).  The user will be able to drag and drop the task cards on any of the lanes.  Once a task is placed on the done lane, it is automatically changed to white and you can now delete the task.

## User Story

```md
AS A project team member with multiple tasks to organize
I WANT a task board 
SO THAT I can add individual project tasks, manage their state of progress and track overall project progress accordingly
```

## Notable code

Code that creates a modal with a form to add tasks.  In bootstrap it is a bit difficult to find an actual modal with a form.  Thus combining some of the given structures in the website to make this modal functional.
```
    <div id="task-modal" style="display: none">
      <form>
        <label for="title">Task Title</label>
        <input type="text" id="title" placeholder="Please enter title">

        <label for="due-date">Task Due Date</label>
        <input type="text" id="due-date" placeholder="Please enter due date">

        <label for="description">Task Description</label>
        <input type="textarea" id="description" placeholder="Please enter description">

        <button id="submit-button">Submit</button>
      </form>
    </div>
    
```

this code will allow for the creation of a task card and change the background based on the due date.
```
function createTaskCard(project) {
  const taskCard = $("<div>")
    .addClass("card project-card draggable my-3")
    .attr("data-project-id", project.id);
  const cardHeader = $("<div>").addClass("card-header h4").text(project.name);
  const cardBody = $("<div>").addClass("card-body");
  const cardDescription = $("<p>").addClass("card-text").text(project.type);
  const cardDueDate = $("<p>").addClass("card-text").text(project.dueDate);
  const cardDeleteBtn = $("<button>")
    .addClass("btn btn-danger delete")
    .text("Delete")
    .attr("data-project-id", project.id);
  cardDeleteBtn.on("click", handleDeleteTask);

  if (project.dueDate && project.status !== "done") {
    const now = dayjs();
    const taskDueDate = dayjs(project.dueDate, "DD/MM/YYYY");

    if (now.isSame(taskDueDate, "day")) {
      taskCard.addClass("bg-warning text-white");
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass("bg-danger text-white");
      cardDeleteBtn.addClass("border-light");
    }
  }

  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}
```

https://luislaplace.github.io/white-board/
https://github.com/LuisLaplace/white-board


![alt text](<assets/img/Screenshot 2024-06-04 175853.png>)
![alt text](<assets/img/Screenshot 2024-06-04 180651.png>)
![alt text](<assets/img/Screenshot 2024-06-04 180721.png>)
