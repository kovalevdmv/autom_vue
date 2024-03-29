import СписокУниверсальный from "@/components/Универсальный/Список.vue";
import ЭлементУниверсальный from "@/components/Универсальный/Элемент.vue";
import ДиалогРаботаСБД from "@/components/Сервисные/РаботаСБД.vue";
import type { КонфигурацияСущности } from '@/interfaces/КонфигурацияСистемы';
import ТаблицыБазыДанных from "./ТаблицыБазыДанных";
import { ТипыЭлемента,ТипКомпонентаПредставления } from "@/interfaces/КонфигурацияИнтерфейса";
import ОбщииФукнции from '@/ОбщииФукнции';

const Стили = {
    Поля: {
        Желтый: 'background-color: #FFFFCC;',
        Ширина100: 'width: 100px;',
        ШиринаВpx: (Проц: number) => { return `width: ${Проц}px;` },
        Скрытый: 'display: none;',
        Пустой: ''
    }
}

const Атрибуты = {
    Поля: {
        ТолькоПросмотр: `readonly: true`
    }
}

export const РаботаСБД: КонфигурацияСущности = {
    Имя: "РаботаСБД",
    ПредставлениеСписка: {
        Компонента: ДиалогРаботаСБД,
        Заголовок: "Работа с БД",
    },
    ПредставлениеЭлемента: {
        Компонента: ДиалогРаботаСБД,
        Заголовок: "Работа с БД",
    }
};

export const ТипСклада: КонфигурацияСущности = {
    Имя: "ТипСклада",
    ТаблицаБД: ТаблицыБазыДанных.ТипСкладаБД,
    ПредставлениеСписка: {
        Компонента: СписокУниверсальный,
        Заголовок: "Типы складов",
        НастройкаПолей: [
            { Имя: 'id', Заголовок: 'ИД' },
            { Имя: 'name', Заголовок: 'Наименование' },
        ]
    },
    ПредставлениеЭлемента: {
        Компонента: ЭлементУниверсальный,
        Заголовок: 'Тип склада',
        НастройкаПолей: [
            {
                Имя: 'id', Заголовок: 'ИД', Стили: Стили.Поля.Ширина100 + Стили.Поля.Желтый, Атрибуты: Атрибуты.Поля.ТолькоПросмотр
            },
            { Имя: 'name', Заголовок: 'Наименование' },
        ]
    },
};

export const Склад: КонфигурацияСущности = {
    Имя: "Склад",
    ТаблицаБД: ТаблицыБазыДанных.СкладБД,
    ДопПоля: [
        { Поле: "type.name as _type", Связь: "type_id = type.id" },
    ],
    ПредставлениеСписка: {
        Компонента: СписокУниверсальный,
        Заголовок: "Список склада",
        НастройкаПолей: [
            { Имя: 'id', Заголовок: 'ИД' },
            { Имя: 'name', Заголовок: 'Наименование' },
            { Имя: '_type' },
            { Имя: 'name2' },
        ]
    },
    ПредставлениеЭлемента: {
        Компонента: ЭлементУниверсальный,
        Заголовок: (Объект: any) => { return Объект.id ? `Склад (${Объект.name})` : 'Новый склад'; },
        НастройкаПолей: [
            { Имя: 'id', Заголовок: 'ИД', Стили: Стили.Поля.Ширина100 + Стили.Поля.Желтый, Атрибуты: Атрибуты.Поля.ТолькоПросмотр },
            { Имя: 'name', Заголовок: 'Наименование' },
            {
                Имя: 'type_id', Заголовок: 'Тип склада (id)',
                ТаблицаВнешнегоКлюча: ТипСклада,
                ОбработчикПослеЗаполненияВнешнегоКлюча: (selRec, Data) => { Data._type = selRec.name; },
                Стили: Стили.Поля.Ширина100 + Стили.Поля.Желтый, Атрибуты: Атрибуты.Поля.ТолькоПросмотр
            },
            { Имя: '_type', Заголовок: 'Тип склада', Стили: Стили.Поля.Желтый, Атрибуты: Атрибуты.Поля.ТолькоПросмотр },
        ]
    }
};

export const Проекты: КонфигурацияСущности = {
    Имя: "Проекты",
    ТаблицаБД: ТаблицыБазыДанных.ПроектыБД,
    ПредставлениеСписка: {
        Компонента: СписокУниверсальный,
        Заголовок: "Проекты",
        НастройкаПолей: [
            { Имя: 'id', Заголовок: 'ИД', },
            { Имя: 'name', Заголовок: 'Наименование' },
        ]
    },
    ПредставлениеЭлемента: {
        Компонента: ЭлементУниверсальный,
        Заголовок: 'Проект',
        НастройкаПолей: [
            {
                Имя: 'id', Заголовок: 'ИД', Стили: Стили.Поля.Ширина100 + Стили.Поля.Желтый, Атрибуты: Атрибуты.Поля.ТолькоПросмотр
            },
            { Имя: 'name', Заголовок: 'Наименование', Атрибуты: Атрибуты.Поля.ТолькоПросмотр },
        ]
    },
};

export const Номенклатура: КонфигурацияСущности = {
    Имя: "Номенклатура",
    ТаблицаБД: ТаблицыБазыДанных.НоменклатураБД,
    ДопПоля: [
        { Поле: "Sklad.name as _main_warehouse", Связь: "main_warehouse = Sklad.id" },
        { Поле: "Sklad.type_id as type_id" },
        { Поле: "type.name as type_name", Связь: "Sklad.type_id = type.id" },
        { Поле: "price as price_format", Обработка: ЗначениеПоля => ЗначениеПоля },
    ],
    ПодчиненныеТаблицы: [
        {
            get Таблица() { return АналогиНоменклатуры },
            КлючГлавнойТаблицы: 'id',
            КолонкаСВнешнимКлючемВПодчиненнойТаблице: 'nomenclature_id',
            ДопПоля: [
                { Поле: "goods.name as analogue", Связь: "analogue_id = goods.id" },
            ],
            ПредставлениеСписка: {
                Компонента: СписокУниверсальный,
                Заголовок: "Список аналогов",
                НастройкаПолей: [
                    { Имя: 'id', Стили: Стили.Поля.Желтый, Атрибуты: Атрибуты.Поля.ТолькоПросмотр },
                    { Имя: 'nomenclature_id', Стили: Стили.Поля.Желтый, Атрибуты: Атрибуты.Поля.ТолькоПросмотр },
                    {
                        Имя: 'analogue_id',
                        get ТаблицаВнешнегоКлюча() { return Номенклатура },
                        ОбработчикПослеЗаполненияВнешнегоКлюча: (selRec, Data) => { Data.analogue = selRec.name; },
                        Стили: Стили.Поля.Желтый,
                        Атрибуты: Атрибуты.Поля.ТолькоПросмотр
                    },
                    { Имя: 'analogue', Стили: Стили.Поля.Желтый, Атрибуты: Атрибуты.Поля.ТолькоПросмотр },
                ]
            }
        },
        {
            Таблица: Проекты,
            КлючГлавнойТаблицы: 'id',
            КолонкаСВнешнимКлючемВПодчиненнойТаблице: 'nom_id',
            ПредставлениеСписка: {
                Компонента: СписокУниверсальный,
                Заголовок: "Список проектов ном-ры",
                НастройкаПолей: [
                    { Имя: 'id', Стили: Стили.Поля.Желтый, Атрибуты: Атрибуты.Поля.ТолькоПросмотр },
                    { Имя: 'nom_id' },
                    { Имя: 'name' },
                ]
            }
        }
    ],
    ПредставлениеСписка: {
        Компонента: СписокУниверсальный,
        Заголовок: "Список ном-ра",
        НастройкаПолей: [
            { Имя: 'id', Заголовок: 'ИД' },
            { Имя: 'name', Заголовок: 'Наименование' },
            { Имя: 'description', Заголовок: 'Описание' },
            { Имя: 'price', Заголовок: 'Цена' },
            { Имя: '_main_warehouse', Заголовок: 'Основной склад' },
            { Имя: 'type_name', Заголовок: 'Тип склада' }
        ]
    },
    ПредставлениеЭлемента: {
        Компонента: ЭлементУниверсальный,
        Заголовок: "Элемент ном-ра",
        НастройкаПолей: [
            { Имя: 'id', Заголовок: 'ИД', Стили: Стили.Поля.Ширина100 + Стили.Поля.Желтый, Атрибуты: Атрибуты.Поля.ТолькоПросмотр },
            { Имя: 'name', Заголовок: 'Наименование' },
            { Имя: 'description', Заголовок: 'Описание' },
            { Имя: 'price', Заголовок: 'Цена' },
            {
                Имя: 'main_warehouse', Заголовок: 'Основной склад (код)',
                ТаблицаВнешнегоКлюча: Склад,
                ОбработчикПослеЗаполненияВнешнегоКлюча: (selRec, Data) => { Data._main_warehouse = selRec.name; },
                Стили: Стили.Поля.Ширина100 + Стили.Поля.Желтый, Атрибуты: Атрибуты.Поля.ТолькоПросмотр
            },
            { Имя: '_main_warehouse', Заголовок: 'Основной склад', Стили: Стили.Поля.Желтый, Атрибуты: Атрибуты.Поля.ТолькоПросмотр },
            {
                Имя: 'type_id',
                Заголовок: 'Тип склада (код)',
                ТаблицаВнешнегоКлюча: ТипСклада,
                ОбработчикПослеЗаполненияВнешнегоКлюча: (selRec, Data) => { Data.type_name = selRec.name; },
                Стили: Стили.Поля.Ширина100 + Стили.Поля.Желтый, Атрибуты: Атрибуты.Поля.ТолькоПросмотр
            },
            { Имя: 'type_name', Заголовок: 'Тип склада', Стили: Стили.Поля.Желтый, Атрибуты: Атрибуты.Поля.ТолькоПросмотр }
        ]
    },
};

export const АналогиНоменклатуры: КонфигурацияСущности = {
    Имя: "АналогиНоменклатуры",
    ТаблицаБД: ТаблицыБазыДанных.АналогиБД,
    ДопПоля: [
        { Заголовок: "Номенклатура", Поле: "goods.name as goods", Связь: "nomenclature_id = goods.id" },
        { Заголовок: "Аналог", Поле: "goods2.name as analogue", Связь: "analogue_id = goods2.id", Таблица: 'goods' },
    ],
    ПредставлениеСписка: {
        Компонента: СписокУниверсальный,
        Заголовок: "Аналоги",

    },
    ПредставлениеЭлемента: {
        Компонента: ЭлементУниверсальный,
        Заголовок: 'Аналог',
        НастройкаПолей: [
            {
                Имя: 'id', Заголовок: 'ИД', Стили: Стили.Поля.Ширина100 + Стили.Поля.Желтый, Атрибуты: Атрибуты.Поля.ТолькоПросмотр
            },
            {
                Имя: 'nomenclature_id',
                Заголовок: 'Номенклатура (код)',
                ТаблицаВнешнегоКлюча: Номенклатура,
                ОбработчикПослеЗаполненияВнешнегоКлюча: (selRec, Data) => { Data.goods = selRec.name; }
            },
            { Имя: 'goods', Заголовок: 'Номенклатура' },
            {
                Имя: 'analogue_id',
                Заголовок: 'Аналог (код)',
                ТаблицаВнешнегоКлюча: Номенклатура,
                ОбработчикПослеЗаполненияВнешнегоКлюча: (selRec, Data) => { Data.analogue = selRec.name; }
            },
            { Имя: 'analogue', Заголовок: 'Аналог' },
            { Имя: 'comment', Заголовок: 'Комментарий' },
        ]
    },
};

//+++ Приобретение товаров
// ТЧ товары
export const ПриобретениеТоваровТаблицаТоваров: КонфигурацияСущности = {
    Имя: "ПриобретениеТоваровТаблицаТоваров",
    ТаблицаБД: ТаблицыБазыДанных.ПриобретениеТоваровТаблицаТоваровБД,
    ДопПоля: [{ Поле: 'goods.name as goods_name', Связь: "goods_id = goods.id", Заголовок: 'Товар' }],
    ПредставлениеСписка: {
        Компонента: СписокУниверсальный,
        Заголовок: "Таблица товаров",
    }, ПредставлениеЭлемента: {
        Заголовок: 'ПриобретениеТоваровТаблицаТоваров',
        Компонента: ЭлементУниверсальный
    }
};

// Основная таблица
export const ПриобретениеТоваров: КонфигурацияСущности = {
    Имя: "ПриобретениеТоваров",
    ТаблицаБД: ТаблицыБазыДанных.ПриобретениеТоваровБД,
    ДопПоля: [{ Поле: 'sklad.name as warehouse_name', Связь: "warehouse_id = sklad.id" }],
    ПредставлениеСписка: {
        Компонента: СписокУниверсальный,
        Заголовок: "Приобретение товаров",
        НастройкаПолей: [
            { Имя: 'id', Заголовок: 'ИД' },
            { Имя: 'date', Заголовок: 'Номенклатура (код)' },
            { Имя: 'number', Заголовок: 'Номенклатура' },
            { Имя: 'warehouse_id', Заголовок: 'Склад (код)' },
            { Имя: 'warehouse_name', Заголовок: 'Склад' },
            { Имя: 'comment', Заголовок: "Комментарий" },
        ]
    },
    ПредставлениеЭлемента: {
        Компонента: ЭлементУниверсальный,
        Заголовок: 'Приобретение товаров',
        ДопДействия: [
            {
                Заголовок: 'Отразить движения по товарам',
                Обработчик: async (Контекст,Данные) => {
                    const response = await ОбщииФукнции.ВызватьМетодНаСервере('ОперацииСТоварами.ОтразитьПриобретениеТоваровRPC', { Данные: Данные, ТаблицаБД: ТаблицыБазыДанных.ПриобретениеТоваровБД });
                    console.log(response);
                },
            }
        ],
        НастройкаПолей: [
            {
                Имя: 'id', Заголовок: 'ИД', Стили: Стили.Поля.Ширина100, Атрибуты: Атрибуты.Поля.ТолькоПросмотр
            },
            { Имя: 'date', Заголовок: 'Дата', Тип: ТипыЭлемента.Дата },
            {
                Имя: 'warehouse_id',
                Заголовок: 'warehouse (код)',
                ТаблицаВнешнегоКлюча: Склад,
                ОбработчикПослеЗаполненияВнешнегоКлюча: (Склад, ДанныеДокумента) => { ДанныеДокумента.warehouse_name = Склад.name }
            },
            { Имя: 'warehouse_name', Заголовок: 'Склад', },
        ]
    },
    ПодчиненныеТаблицы: [
        {
            Таблица: ПриобретениеТоваровТаблицаТоваров,
            ДопПоля: [{ Поле: 'goods.name as goods_name', Связь: "goods_id = goods.id" }],
            КлючГлавнойТаблицы: 'id',
            КолонкаСВнешнимКлючемВПодчиненнойТаблице: 'purchase_of_goods_id',
            ПредставлениеСписка: {
                Заголовок: 'Таблица товаров',
                Компонента: СписокУниверсальный,
                НастройкаПолей: [
                    { Имя: 'id' },
                    { Имя: 'goods_id', ТаблицаВнешнегоКлюча: Номенклатура, ОбработчикПослеЗаполненияВнешнегоКлюча: (ВыбраннаяНомра, ДанныеСтрокиТЧ) => ДанныеСтрокиТЧ.goods_name = ВыбраннаяНомра.name }, { Имя: 'goods_name' },
                    { Имя: 'quantity', ОбработчикЗавершениеРедактированияЭлемента: (Данные) => Данные.amount = Данные.price * Данные.quantity },
                    { Имя: 'price', ОбработчикЗавершениеРедактированияЭлемента: (Данные) => Данные.amount = Данные.price * Данные.quantity },
                    { Имя: 'amount' }],
            },
        }]
};

//--- Приобретение товаров

export const Подразделения: КонфигурацияСущности = {
    Имя: "Подразделения",
    ТаблицаБД: ТаблицыБазыДанных.ПодразделенияБД,
    ПредставлениеСписка: {
        Компонента: СписокУниверсальный,
        Заголовок: "Подразделения"
    },
    ПредставлениеЭлемента: {
        Компонента: ЭлементУниверсальный,
        Заголовок: 'Подразделения',
    },
};

export const ДвиженияТоваровОбщаяТаблица: КонфигурацияСущности = {
    Имя: "ДвиженияТоваровОбщаяТаблица",
    ТаблицаБД: ТаблицыБазыДанных.ДвиженияТоваровОбщаяТаблицаБД,
    ПредставлениеСписка: {
        Компонента: СписокУниверсальный,
        Заголовок: "ДвиженияТоваровОбщаяТаблица",
    },
    ПредставлениеЭлемента: {
        Компонента: ЭлементУниверсальный,
        Заголовок: 'ДвиженияТоваровОбщаяТаблица',
                ДопДействия: [{
            Заголовок: 'Открыть регистратор', Обработчик: (Контекст, Данные) => {
                console.log(Данные);
                Контекст.СоздатьДиалоговоеОкно({ ТипКомпонентаПредставления: ТипКомпонентаПредставления.Элемент, КонфигурацияСущности: ПриобретениеТоваров, ДанныеСущности: { id: Данные.registrator_id } });
                
            }
        }]
    },
};

export default {
    ТипСклада,
    Склад,
    Проекты,
    Номенклатура,
    АналогиНоменклатуры,
    ПриобретениеТоваровТаблицаТоваров,
    ПриобретениеТоваров,
    РаботаСБД,
    Подразделения,
    ДвиженияТоваровОбщаяТаблица
};
