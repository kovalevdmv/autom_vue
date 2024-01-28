import type { ГлавныйИнтерфейс } from '@/interfaces/КонфигурацияИнтерфейса';
import КонфигурацияСистемы from './КонфигурацияСистемы';


export const ГлавноеМеню: ГлавныйИнтерфейс = {

    Элементы: [
        {
            Представление: "Номенклатура",
            КонфигурацияСущности: КонфигурацияСистемы.Номенклатура
        },
        {
            Представление: "Аналоги",
            КонфигурацияСущности: КонфигурацияСистемы.АналогиНоменклатуры
        },
        {
            Представление: "Склад",
            КонфигурацияСущности: КонфигурацияСистемы.Склад
        },
        {
            Представление: "Тип cклада",
            КонфигурацияСущности: КонфигурацияСистемы.ТипСклада
        },
        {
            Представление: "Проекты",
            КонфигурацияСущности: КонфигурацияСистемы.Проекты
        },
        {
            Представление: "Приобретение товаров",
            КонфигурацияСущности: КонфигурацияСистемы.ПриобретениеТоваров
        },
        {
            Представление: "Подразделения",
            КонфигурацияСущности: КонфигурацияСистемы.Подразделения
        },
        {
            Представление: "Работа с БД",
            КонфигурацияСущности: КонфигурацияСистемы.РаботаСБД
        },
        {
            Представление: "Движения товаров (общая таблица)",
            КонфигурацияСущности: КонфигурацияСистемы.ДвиженияТоваровОбщаяТаблица
        },
        {
            Представление: "ПриобретениеТоваровТаблицаТоваров",
            КонфигурацияСущности: КонфигурацияСистемы.ПриобретениеТоваровТаблицаТоваров
        }]
}
