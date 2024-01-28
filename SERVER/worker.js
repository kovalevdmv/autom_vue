function taskA(data) {
    // Обработка задачи A
    return `Результат задачи A с данными ${data}`;
  }
  
  function taskB(data) {
    // Обработка задачи B
    return `Результат задачи B с данными ${data}`;
  }
  
  // Универсальная функция для обработки входящих задач
export default ({ taskName, data }) => {
    switch (taskName) {
      case 'taskA':
        return taskA(data);
      case 'taskB':
        return taskB(data);
      default:
        throw new Error('Неизвестная задача');
    }
  };