import { ОтразитьПриобретениеТоваров } from './БизнесЛогика/ОперацииСТоварами.js'

// Универсальная функция для обработки входящих задач
export default ({ taskName, data }) => {
  switch (taskName) {
    case 'ОтразитьПриобретениеТоваров':
      return ОтразитьПриобретениеТоваров(data);
    default:
      throw new Error('Неизвестная задача');
  }
};