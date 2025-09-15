// Import Important Elements And Put Them In Variables
const inputText = document.querySelector("#inputTask");
const addButton = document.querySelector(".add");
const inputDays = document.querySelector(".inputDays");
const radioInputs = document.querySelectorAll(".inputDays .inputDay input");
const days = document.querySelectorAll(".day");
const arrows = document.querySelectorAll("#arrow");
const AllTaskDivs = document.querySelectorAll(".day .tasks");
const progressBars = document.querySelectorAll(".progress-bar");
const deleteButtons = document.querySelectorAll(".deleteDayTasks");
const toTopButton = document.querySelector("button.toTop");
const deleteAllTasksButton = document.querySelector("button.deleteAllTasks");


// Some General Variables
let counter = 0; // To Set Unique Id For Every Task
let globalCounter = 0; // To Set Unique Id For Every Task When We Add It To All Days

let lastCase; // To Save The Task Div Which We Click On It When We Want To Update It
let lastCaseId; // To Save The Id Of The Task Which We Want To Update It
let lastCaseDay; // To Save The Day Of The Task Which We Want To Update It

let CanDeleteAllTasks = false;

// week Days Array That Contains days and tasks for every day
let week = [
    {day: "saturday", tasks: []},
    {day: "sunday", tasks: []},
    {day: "monday", tasks: []},
    {day: "tuesday", tasks: []},
    {day: "wednesday", tasks: []},
    {day: "thursday", tasks: []},
    {day: "friday", tasks: []},
];

addButton.onclick = (event) => {
    CheckOnData(inputText.value);

    if (inputText.value != "")
    {
        if (event.target.dataset.process == "add")
            PlayWhenAddTasks();
        else
            PlayWhenUpdateTasks();
    }

    inputText.value = "";

    event.preventDefault();
}

function CheckOnData()
{
    let words = inputText.value.split(" ");

    for (let i = 0; i < words.length; i++)
        if (words[i].length > 25)
        {
            alert("Error,  Every Word Can't Be More Than 16 Characters");
            inputText.value = "";
        }
}

function PlayWhenAddTasks()
{
    OpenAndResizeDay();
    AddTasksToCertainArray();
    AddTasksToDays();
    SetTasksToLocalStorage();
    ShowProgressBar();
    ProgressBar();
    ShowDeleteButton();
}

function AddTasksToCertainArray()
{
    let task = {
        id: Date.now(),
        text: inputText.value,
        complete: false
    };

    radioInputs.forEach( (radioInput, index) => {

        if (radioInput.checked && radioInput.id === "all")
            week.forEach(day => {
                task.id = Date.now() + ++globalCounter; // To Set Unique Id For Every Task When We Add It To All Days
                day.tasks.push({...task}); // Use Spread Operator To Push A Copy Of The Task Object To Avoid Reference Issues
            });
        else if (radioInput.checked)
            week[index].tasks.push(task);

    });
}

function OpenAndResizeDay()
{
    radioInputs.forEach( (radioInput, index) => {

        if (radioInput.checked && radioInput.id == "all")
        {
            days.forEach((day, i) => {
                if (day.classList.contains("opened"))
                {
                    if (week[i].tasks.length == 0)
                        // If The Day Is Already Opened, Just Resize It
                        day.style.maxHeight = day.scrollHeight + 1000 + "px";
                    else
                        // If The Day Is Already Opened, Just Resize It
                        day.style.maxHeight = day.scrollHeight + 100 + "px";
                }
                else
                {
                    // If The Day Is Not Opened, Open It And Resize It (Click The Arrow To Open It)
                    day.children[1].click();
                    OpenAndResizeDay(); // Call The Function Again To Resize It
                }
            });
        }
        else if (radioInput.checked)
        {
            if (days[index].classList.contains("opened"))
            {
                if (week[index].tasks.length == 0)
                    // If The Day Is Already Opened, Just Resize It
                    days[index].style.maxHeight = days[index].scrollHeight + 1000 + "px";
                else
                    // If The Day Is Already Opened, Just Resize It
                    days[index].style.maxHeight = days[index].scrollHeight + 100 + "px";
            }
            else
            {
                // If The Day Is Not Opened, Open It And Resize It (Click The Arrow To Open It)
                days[index].children[1].click();
                OpenAndResizeDay(); // Call The Function Again To Resize It
            }
        }
    });
}

function AddTasksToDays()
{
    AllTaskDivs.forEach( (tasksDiv, index) => {
        CreateTasks(week[index].tasks, tasksDiv);
    });
}

function CreateTasks(tasksArray, tasksDiv)
{
    tasksDiv.innerHTML = ""; // Clear The Tasks Div Before Adding New Tasks (To Avoid Duplicates)

    for (let i = 0; i < tasksArray.length; i++)
    {
        let nameOfDay = tasksDiv.parentElement.parentElement.children[0].innerHTML;

        // Create The Task Div (main Div With All Task Elements)
        let task = document.createElement("div");
        task.className = "task";
        task.setAttribute("data-id", tasksArray[i].id);
        task.setAttribute("data-name", nameOfDay);

        // Create The Text Div (The Div That Contains The Text And Checkbox)
        let textDiv = document.createElement("div");
        textDiv.className = "text";

        // Create The Checkbox Input
        let input = CreateCheckboxInput();


        // If The Task Is Complete, Add The Done Class To The Text Div And Check The Checkbox
        if (tasksArray[i].complete)
        {
            textDiv.className = "text done";
            input.checked = true;
        }
        else
            textDiv.className = "text";


        // Create The Label (The Text Itself)
        let label = CreateLabel(tasksArray, i);

        textDiv.appendChild(input); // Append The Checkbox To The Text Div
        textDiv.appendChild(label); // Append The Label To The Text Div

        counter++; // Increase The Counter By 1 (To Set Unique Id For Every Task)

        task.appendChild(textDiv); // Append The Text Div To The Task Div


        // Create The Process Div (The Div That Contains The Process Icons => delete, update, copy, drag & drop)
        let processDiv = document.createElement("div");
        processDiv.className = "process";

        // Create The Delete Span (The Span That Contains The Delete Icon)
        let deleteSpan = CreateDeleteSpan();

        processDiv.appendChild(deleteSpan); // Append The Delete Span To The Process Div


        // Create The Update Span (The Span That Contains The Update Icon)
        let updateSpan = CreateUpdateSpan();

        processDiv.appendChild(updateSpan); // Append The Update Span To The Process Div


        // Create The Copy Span (The Span That Contains The Copy Icon)
        let copySpan = CreateCopySpan();

        processDiv.appendChild(copySpan); // Append The Copy Span To The Process Div


        // Create The Drag Span (The Span That Contains The Drag & Drop Icon)
        let dragSpan = CreateDragSpan();

        processDiv.appendChild(dragSpan); // Append The Drag Span To The Process Div


        task.appendChild(processDiv); // Append The Process Div To The Task Div

        tasksDiv.appendChild(task); // Append The Task Div To The Tasks Div
    }
}

function CreateCheckboxInput()
{
    let input = document.createElement("input");
    input.type = "checkbox";
    input.name = "Day";
    input.id = `task${counter}`;
    input.className = "taskCheckbox";

    return input;
}

function CreateLabel(tasksArray, i)
{
    let label = document.createElement("label");
    label.setAttribute("for", `task${counter}`);

    let labelText = document.createTextNode(tasksArray[i].text);
    
    label.appendChild(labelText);

    return label;
}

function CreateDeleteSpan()
{
    let deleteSpan = document.createElement("span");
    deleteSpan.className = "delete";

    let deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-solid fa-xmark";

    deleteSpan.appendChild(deleteIcon); // Append The Icon To The Span

    // Create The Tooltip (The Small Text That Appears When Hover On The Icon)
    let tooltipDelete = document.createElement("div");
    tooltipDelete.className = "tooltip";

    let tooltipDeleteText = document.createTextNode("Delete");

    tooltipDelete.appendChild(tooltipDeleteText); // Append The Text To The Tooltip

    deleteSpan.appendChild(tooltipDelete); // Append The Tooltip To The Span

    return deleteSpan;
}

function CreateUpdateSpan()
{
    let updateSpan = document.createElement("span");
    updateSpan.className = "update";

    let updateIcon = document.createElement("i");
    updateIcon.className = "fa-solid fa-pen";

    updateSpan.appendChild(updateIcon); // Append The Icon To The Span

    let tooltipUpdate = document.createElement("div");
    tooltipUpdate.className = "tooltip";

    let tooltipUpdateText = document.createTextNode("Update");

    tooltipUpdate.appendChild(tooltipUpdateText); // Append The Text To The Tooltip

    updateSpan.appendChild(tooltipUpdate); // Append The Tooltip To The Span

    return updateSpan;
}

function CreateCopySpan()
{
    let copySpan = document.createElement("span");
    copySpan.className = "copy";

    let copyIcon = document.createElement("i");
    copyIcon.className = "fa-solid fa-copy";

    copySpan.appendChild(copyIcon);

    let tooltipCopy = document.createElement("div");
    tooltipCopy.className = "tooltip";
    
    let tooltipCopyText = document.createTextNode("Copy");

    tooltipCopy.appendChild(tooltipCopyText);

    copySpan.appendChild(tooltipCopy);

    return copySpan;
}

function CreateDragSpan()
{
    let dragSpan = document.createElement("span");
    dragSpan.className = "drag";

    let dragIcon = document.createElement("i");
    dragIcon.className = "fa-solid fa-grip";

    dragSpan.appendChild(dragIcon);

    let tooltipDrag = document.createElement("div");
    tooltipDrag.className = "tooltip";

    let tooltipDragText = document.createTextNode("Drag & Drop");

    tooltipDrag.appendChild(tooltipDragText);

    dragSpan.appendChild(tooltipDrag);

    return dragSpan;
}

function SetTasksToLocalStorage()
{
    window.localStorage.setItem("week", JSON.stringify(week));
}

function getTasksFromLocalStorage()
{
    let data = JSON.parse(window.localStorage.getItem("week"));
    if (data)
    {
        week = data;
        AddTasksToDays();
    }
}

function ShowProgressBar()
{
    progressBars.forEach( (progressBar, index) => {
        if (week[index].tasks.length != 0)
            progressBar.style.display = "block";
        else
            progressBar.style.display = "none";
    });
}

function ProgressBar()
{
    progressBars.forEach( (progressBar, index) => {
        let percent = (CountCompletedTasks(  week[index].tasks  ) / week[index].tasks.length) * 100;

        progressBar.children[0].style.width = `${percent}%`;
        progressBar.children[1].innerHTML = Math.round(percent * 100) / 100 + "%";
    });
}

function CountCompletedTasks(tasks)
{
    let count = 0;

    for (let i = 0; i < tasks.length; i++)
        if (tasks[i].complete == true)
            count++;

    return count;
}

function ShowDeleteButton()
{
    deleteButtons.forEach( (deleteButton, index) => {
        if (week[index].tasks.length != 0)
            deleteButton.style.display = "block";
        else
            deleteButton.style.display = "none";

        PlayDeleteButton(deleteButton, index);
    });
}

function PlayDeleteButton(deleteButton, index)
{
    deleteButton.onclick = (event) => {
        let checkToDelete = confirm("Are You Sure You Want Delete This Day's Tasks?");

        if (checkToDelete)
        {
            AllTaskDivs[index].innerHTML = "";
            week[index].tasks = [];

            event.target.style.display = "none";

            SetTasksToLocalStorage();
            ShowProgressBar();
        }
    }
}


function PlayWhenUpdateTasks()
{
    lastCase.children[0].children[1].innerHTML = inputText.value;

    UpdateCertainTaskInArray();

    inputDays.style.display = "grid";

    addButton.innerHTML = "Add Task";
    addButton.dataset.process = "add";
}

function UpdateCertainTaskInArray()
{
    for (let i = 0; i < week.length; i++)
    {
        if (week[i].day == lastCaseDay) {
            week[i].tasks.forEach( (task) => {
                if (task.id == lastCaseId)
                    task.text = inputText.value;
            });
        }
    }

    SetTasksToLocalStorage();
}

document.addEventListener("click", (event) => {
    if (event.target.className == "delete")
    {
        let checkToDelete = confirm("Are You Sure You Want Delete This Task?");

        if (checkToDelete)
        {
            let task = event.target.parentElement.parentElement; // Get The Task Div

            task.remove(); // Remove The Task Div From The Page

            DeleteTasksFromArray(task);

            ShowProgressBar();
            ProgressBar();
            ShowDeleteButton();
            SetTasksToLocalStorage();
        }
    }

    if (event.target.className == "update")
    {
        lastCase = event.target.parentElement.parentElement; // The Clicked Task
        let text = lastCase.children[0].children[1].innerHTML; // The Clicked Task's Text

        // Change The Value Of The InputText To The Clicked Task's Text
        inputText.value = text;

        // Hide The InputDays Section
        inputDays.style.display = "none";


        addButton.innerHTML = "Update"; // Change The Btn Text To Update

        // Change The Data Process To Update To Use The Add Btn To Update Not Add
        addButton.dataset.process = "update";

        lastCaseId = lastCase.dataset.id; // The Clicked Task's Id
        lastCaseDay = lastCase.dataset.name; // The Clicked Task's Day

        ScrollToTop();

        FocusOnTheInputAfterScrollToTop();
    }

    if (event.target.className == "taskCheckbox")
    {
        event.target.parentElement.classList.toggle("done"); // Toggle The Done Class On The Text Div

        ChangeTheCompleteCaseOfTheTask(event);

        ProgressBar();
        SetTasksToLocalStorage();
    }

    if (event.target.className == "copy")
    {
        if (event.target.classList.contains("active"))
            return; // if This Button Contain Class Active That Prevents The User To Click It


        let textToCopy = event.target.parentElement.parentElement.children[0].children[1].innerHTML;
        navigator.clipboard.writeText(textToCopy); // Copy The Task's Text To The Clipboard


        let tooltip = event.target.children[1];
        tooltip.innerHTML = "Copied!"; // Change The Text In tooltip To Copied!


        event.target.classList.add("active"); // Add The Active Class To Prevent The User To Click It

        RemoveActiveClassAfterDelay(event, tooltip);
    }
});

function DeleteTasksFromArray(task)
{
    for (let i = 0; i < week.length; i++)
        if (week[i].day == task.dataset.name)
            week[i].tasks = week[i].tasks.filter( (element) => element.id != task.dataset.id );
}

function ScrollToTop()
{
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function FocusOnTheInputAfterScrollToTop()
{
    const myInterval = setInterval( () => {
        if (window.scrollY == 0)
        {
            inputText.focus();
            clearInterval(myInterval);
        }
    }, 200);
}

function ChangeTheCompleteCaseOfTheTask(event)
{
    for (let i = 0; i < week.length; i++)
    {

        let task = event.target.parentElement.parentElement;

        if (week[i].day == task.dataset.name)
        {
            week[i].tasks.forEach( (element) => {
                if (element.id == task.dataset.id)
                    element.complete = !element.complete;
            });
        }
    }
}

function RemoveActiveClassAfterDelay(event, tooltip)
{
    setTimeout( () => {
        tooltip.innerHTML = "Copy";
        event.target.classList.remove("active");
    }, 2000);
}

getTasksFromLocalStorage();
ShowProgressBar();
ProgressBar();
ShowDeleteButton();
DragAndDrop();
ShowDays();

function DragAndDrop()
{
    AllTaskDivs.forEach( (tasksDiv) => {
        // Initialize SortableJS On Every Tasks Div
        Sortable.create(tasksDiv, {
            group: "tasks", // Set The Group Name To Allow Drag And Drop Between Different Days
            animation: 150,
            handle: ".drag", // Set The Drag Handle To The Drag Icon
            ghostClass: 'dragging', // Class Name For The Dragged Element

            onEnd: function (event) {
                let task = event.item; // The Dragged Task Div
                let taskTo = event.to; // The Tasks Div That The Task Was Dragged To

                let taskToName = taskTo.parentElement.parentElement.querySelector("h2").innerHTML; // The Day Name That The Task Was Dragged To

                DeleteTasksFromArray(task); // Delete The Task From The Old Array
                SetTasksToLocalStorage(); // Update The Local Storage

                task.dataset.name = taskToName; // Update The Data Name Attribute Of The Task Div To The New Day Name

                let index = NewIndexOfDraggedTask(taskTo, task); // The New Index Of The Dragged Task In The New Tasks Div

                AddDDraggedTaskToCertainArray(task, index); // Add The Dragged Task To The New Array

                let Day = taskTo.parentElement.parentElement;

                Day.style.maxHeight = Day.scrollHeight + 45 + "px"; // Resize The Day Div To Fit The New Task
            },

            // Drag The Task On The Tasks Div 
            onMove: function (event) {
                let taskTo = event.to;
                let Day = taskTo.parentElement.parentElement;

                Day.style.maxHeight = Day.scrollHeight + 45 + "px";
            },

            scroll: true,
            scrollSensitivity: 60,
            scrollSpeed: 10,
        });
    });
}

function NewIndexOfDraggedTask(taskTo, task)
{
    let arrayOfTasksTo = Array.from(taskTo.children); // Convert The HTML Collection To An Array

    for (let i = 0; i < arrayOfTasksTo.length; i++)
    {
        if (arrayOfTasksTo[i].dataset.id == task.dataset.id)
            return i;
    }
}

function AddDDraggedTaskToCertainArray(taskDiv, index)
{
    let task = {
        id: taskDiv.dataset.id,
        text: taskDiv.querySelector("label").innerHTML,
        complete: taskDiv.children[0].classList.contains("done")
    }

    for (let i = 0; i < week.length; i++)
    {
        if (week[i].day == taskDiv.dataset.name)
        {
            let length = week[i].tasks.length + 1;

            for (let j = 0; j < length; j++)
            {
                if (j >= index)
                {
                    let temp = week[i].tasks[j];
                    week[i].tasks[j] = task;
                    task = temp;
                }
            }
        }
    }

    SetTasksToLocalStorage();
    ShowProgressBar();
    ProgressBar();
    ShowDeleteButton();
}

function ShowDays()
{
    arrows.forEach( (arrow) => {
        arrow.onclick = function(event) {

            let thisDay = event.target.parentElement;

            // If This Day Is Not Opened (Not Contain The ShowData Class) So Open It
            if (!thisDay.classList.contains("opened"))
            {
                event.target.classList.add("active"); // Add The Active Class To The Arrow (To Rotate It)

                thisDay.classList.add("opened") // Add The Opened Class To The Day (overflow: visible)

                thisDay.style.maxHeight = thisDay.scrollHeight + 100 + "px"; // Change The Max Height Of The Day To The Height Of The Content

                event.target.nextElementSibling.classList.add("visible")
            }
            else
            {
                event.target.classList.remove("active");

                thisDay.classList.remove("opened");

                thisDay.style.maxHeight = "70px"; // Change The Max Height Of The Day To Hide The Content

                event.target.nextElementSibling.classList.remove("visible");
            }
        } 
    });
}

window.addEventListener("scroll", () => {
    if (window.scrollY >= 100)
        toTopButton.style.right = "20px";
    else
        toTopButton.style.right = "-100px";
});

toTopButton.onclick = function () {
    ScrollToTop();
}

deleteAllTasksButton.onclick = function (event) {
    AreTasksExist();

    if (CanDeleteAllTasks)
    {
        let checkToDelete = confirm("Are You Sure You Want Delete All Tasks?");

        if (checkToDelete)
        {
            AllTaskDivs.forEach((tasksDiv) => tasksDiv.innerHTML = "");
            week.forEach((day) => day.tasks = []);

            days.forEach((day) => {
                day.children[1].classList.remove("active");
                day.style.maxHeight = "70px";
            });

            ShowProgressBar();
            ShowDeleteButton();
            SetTasksToLocalStorage();
            CanDeleteAllTasks = false;
        }
    }
    else
        alert("No Tasks To Delete Them!");
}

function AreTasksExist()
{
    week.forEach((day) => {
        if (day.tasks.length > 0)
            CanDeleteAllTasks = true;
    });
}