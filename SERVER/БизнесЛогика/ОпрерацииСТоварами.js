import Piscina from 'piscina';

//const piscina = new Piscina({ filename: workerPath });
const piscina = new Piscina({ filename: './worker.js' });

async function runTasks() {
  // Запуск задачи A
  const resultA = await piscina.run({ taskName: 'taskA', data: 'Данные для A' });
  console.log(resultA);

  // Запуск задачи B
  const resultB = await piscina.run({ taskName: 'taskB', data: 'Данные для B' });
  console.log(resultB);
}

runTasks();