const fs = require('fs');
const readline = require('readline');
const tasksList = [];

class Task {
    constructor(name, score, isBonus, isSubTask, isCompleted) {
        this.name = name;
        this.score = score;
        this.isBonus = isBonus;
        this.isSubTask = isSubTask;
        this.isCompleted = isCompleted;
    }

    toString() {
        return ` [${this.isCompleted ? 'X' : ' '}] ${this.isSubTask ? '\t' : this.isBonus ? '#' : '*'} ${this.name} = ${this.score}`;
    }
}

const lineReader = readline.createInterface({
    input: fs.createReadStream('tasks.txt')
});

let isBonusSection = false;
lineReader.on('line', line => {
    isBonusSection = isBonusSection || line.trim() === 'Bonus!';

    const startOfTaskDescription = line.indexOf(']')+1;
    const endOfTaskDescription = line.lastIndexOf(':');
    const taskDescription = line.substring(startOfTaskDescription, endOfTaskDescription).trim();

    const taskValue = line.substring(endOfTaskDescription+1, endOfTaskDescription >= 0 ? line.length : 0).trim();
    const isSubTask = line.trim().startsWith('*');
    const isCompleted = line.substring(line.indexOf('['), startOfTaskDescription).trim() === '[x]';

    if (taskDescription && taskDescription !== 'Final Score') tasksList.push(new Task(
        taskDescription,
        taskValue !== '' ? parseInt(taskValue, 10) : 0,
        isBonusSection,isSubTask,
        isCompleted)
    );
}).on('close', () => {
    console.log('Full List Of Tasks');
    tasksList.forEach(task => console.log(task.toString()));

    const totals = tasksList.reduce((totals, currentTask) => {
        totals[0] += currentTask.score;
        totals[1] += currentTask.isCompleted ? currentTask.score : 0;
        totals[2] += !currentTask.isBonus ? currentTask.score : 0;
        totals[3] += !currentTask.isBonus && currentTask.isCompleted ? currentTask.score : 0;

        return totals;
    }, [0,0,0,0]);

    console.log(
        "\nTotal of all tasks: " + totals[0] +
        "\nTotal of all completed tasks: " + totals[1] +
        "\nTotal of Core tasks: " + totals[2] +
        "\nTotal of Core completed tasks: " + totals[3]
    );
});
