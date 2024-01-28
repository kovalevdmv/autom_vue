const deepAssignObject = (target, source) => {
    Object.keys(source).forEach(key => {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) {
                target[key] = {};
            }
            deepAssignObject(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    });
};

import { apiConfig } from "@/sett.js";
import axios from 'axios';

const ВызватьМетодНаСервере = async (MethodName, ПарамерВызова) => {
    try {
        const Ob = { MethodName: MethodName, Parameters: ПарамерВызова };
        const response = await axios.post(`${apiConfig.url}/rpc/`, Ob);
        if (response.data.status == 'error')
            return { httpResponse: response, err: response.data.message };
        return { httpResponse: response, data: response.data, err: '' };
    } catch (error) {
        const ErrorText = `"Ошибка при получении данных: ${error} (${JSON.stringify(ПарамерВызова)})`;
        console.error("Ошибка при получении данных: ", ErrorText);
        return { response: undefined, err: ErrorText };
    }
}

function ОбработатьТекстЗапросаДляДопПолей(Объект, ТекстЗапроса, ПсевдонимГлавнойТаблицы = "T") {

    if (!("ДопПоля" in Объект))
        return ТекстЗапроса;

    const ВыборкаПолей = [];
    const СоединенияПолей = [];

    for (let field of Объект.ДопПоля) {
        if ("Связь" in field) {
            ВыборкаПолей.push(`${field.Поле}`);
            const TableNameFromField = field.Поле.split(".")[0];
            const aliasTable = TableNameFromField;
            const TableInDB = field.Таблица ? field.Таблица : TableNameFromField;
            СоединенияПолей.push(` left join ${TableInDB} as ${aliasTable} on ${field.Связь}`);
        }
        else
            ВыборкаПолей.push(`${field.Поле.includes(".") ? '' : ПсевдонимГлавнойТаблицы + '.'}${field.Поле}`);
    };

    ТекстЗапроса = ТекстЗапроса.replace(/\s+/g, ' ');
    ТекстЗапроса = ТекстЗапроса.replace(new RegExp(`select ${ПсевдонимГлавнойТаблицы}\\.\\*`, 'gi'), `select ${ПсевдонимГлавнойТаблицы}.* ${ВыборкаПолей.length ? ',' : ''} ${ВыборкаПолей.join(",")} `) + " ";

    ТекстЗапроса = ТекстЗапроса.replace(new RegExp(`as ${ПсевдонимГлавнойТаблицы} `, 'gi'), `as ${ПсевдонимГлавнойТаблицы} ${СоединенияПолей.join(" ")} `);

    return ТекстЗапроса;
}

/**
 * Для вычисляемых полей
 * @param Объект 
 * @param РезультатЗапроса 
 * @returns 
 */
function ОбработатьРезультатЗапросаДляОбработкиПолей(Объект, РезультатЗапроса) {
    if (!("ДопПоля" in Объект))
        return РезультатЗапроса;

    const ОбработчикиПолей = Объект.ДопПоля.filter(field => "Обработка" in field && typeof field.Обработка === "function");
    РезультатЗапроса.forEach((record) => {
        ОбработчикиПолей.forEach((Обработчик) => {
            const fieldName = Обработчик.Поле.toLowerCase().split("as")[1].trim();
            record[fieldName] = Обработчик.Обработка(record[fieldName], record);
        });
    });

    return РезультатЗапроса;
}

async function ЗаписатьОбъект(Объект, Данные, toast) {

    let additional_field = ("ДопПоля" in Объект) ? Объект.ДопПоля.map(field => field.Поле.split("as")[1].trim()) : [];

    let ПодчиненныеТаблицы = ("ПодчиненныеТаблицы" in Объект) ? Объект.ПодчиненныеТаблицы.map(field => field.Таблица.Имя) : [];

    const array_field = Object.keys(Данные).filter(key => key !== "id" && !additional_field.includes(key) && !ПодчиненныеТаблицы.includes(key));
    let Ответ;
    if (!Данные.id) {
        const field_array = [];
        const value_array = [];
        array_field.forEach((key) => {
            if (Данные[key] != null) {
                field_array.push(key);
                value_array.push(`'${Данные[key]}'`);
            }
        });
        Ответ = await ВызватьМетодНаСервере("РаботаСБазойДанных.ВыполнитьЗапросRPC",
            {
                ТекстЗапроса: `INSERT INTO ${Объект.ТаблицаБД.Имя} (${field_array.join(",")}) VALUES (${value_array.join(",")})`,
                Параметры: []
            });
        if (!Ответ.err)
            toast.add({ severity: 'info', summary: 'Запись данных', detail: Ответ.httpResponse.statusText, life: 5000 });
    } else {
        const array_values = [];
        array_field.forEach((key) => {
            if (Данные[key] != null) {
                array_values.push(`${key} = '${Данные[key]}'`);
            }
        });
        Ответ = await ВызватьМетодНаСервере("РаботаСБазойДанных.ВыполнитьЗапросRPC",
            {
                ТекстЗапроса: `UPDATE ${Объект.ТаблицаБД.Имя} SET ${array_values.join(",")} WHERE id = $1`,
                Параметры: [Данные.id]
            });
        if (!Ответ.err)
            toast.add({ severity: 'info', summary: 'Запись данных', detail: Ответ.httpResponse.statusText, life: 5000 });
    }
    if (Ответ.data)
        Данные = Ответ.data[0]
    else if (Ответ.err)
        toast.add({ severity: 'error', summary: 'Запись данных', detail: Ответ.err, life: 5000 });
}

export default {
    deepAssignObject,
    ВызватьМетодНаСервере,
    ОбработатьТекстЗапросаДляДопПолей,
    ОбработатьРезультатЗапросаДляОбработкиПолей,
    ЗаписатьОбъект
};