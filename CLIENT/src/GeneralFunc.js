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

const remoteCall = async (MethodName, ПарамерВызова) => {
    try {
        const Ob = { MethodName: MethodName, Parameters: ПарамерВызова };
        const response = await axios.post(`${apiConfig.url}/rpc/`, Ob);
        if (response.data.status == 'error')
            return { httpResponse: response, err: response.data.message };
        return { httpResponse: response, err: '' };
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
    ТекстЗапроса = ТекстЗапроса.replace(new RegExp(`select ${ПсевдонимГлавнойТаблицы}\\.`, 'gi'), `select ` + ВыборкаПолей.join(",") + `, ${ПсевдонимГлавнойТаблицы}.`) + " ";

    ТекстЗапроса = ТекстЗапроса.replace(new RegExp(`as ${ПсевдонимГлавнойТаблицы} `, 'gi'), `as ${ПсевдонимГлавнойТаблицы} ${СоединенияПолей.join(" ")} `);

    return ТекстЗапроса;
}

function ОбработатьРезультатЗапросаДляОбработкиПолей(Объект, РезультатЗапроса) {
    if (!("ДопПоля" in Объект))
        return РезультатЗапроса;

    const ОбработчикиПолей = Объект.ДопПоля.filter(field => "Обработка" in field && typeof field.Обработка === "function");
    РезультатЗапроса.forEach((record) => {
        ОбработчикиПолей.forEach((Обработчик) => {
            const fieldName = Обработчик.Поле.toLowerCase().split("as")[1].trim();
            record[fieldName] = Обработчик.Обработка(record[fieldName]);
        });
    });

    return РезультатЗапроса;
}

async function ЗаписатьОбъект(Объект, МодельОбъекта, toast) {

    let additional_field = ("ДопПоля" in Объект) ? Объект.ДопПоля.map(field => field.Поле.split("as")[1].trim()) : [];

    let ПодчиненныеТаблицы = ("ПодчиненныеТаблицы" in Объект) ? Объект.ПодчиненныеТаблицы.map(field => field.Таблица.Имя) : [];

    const array_field = Object.keys(МодельОбъекта).filter(key => key !== "id" && !additional_field.includes(key) && !ПодчиненныеТаблицы.includes(key));
    let Ответ;
    if (!МодельОбъекта.id) {
        const field_array = [];
        const value_array = [];
        array_field.forEach((key) => {
            if (МодельОбъекта[key] != null) {
                field_array.push(key);
                value_array.push(`'${МодельОбъекта[key]}'`);
            }
        });
        Ответ = await remoteCall("РаботаСБазойДанных.ВыполнитьЗапросRPC",
            {
                ТекстЗапроса: `INSERT INTO ${Объект.ТаблицаБД.Имя} (${field_array.join(",")}) VALUES (${value_array.join(",")})`,
                Параметры: []
            });
        if (!Ответ.err)
            toast.add({ severity: 'info', summary: 'Запись данных', detail: Ответ.httpResponse.statusText, life: 5000 });
    } else {
        const array_values = [];
        array_field.forEach((key) => {
            if (МодельОбъекта[key] != null) {
                array_values.push(`${key} = '${МодельОбъекта[key]}'`);
            }
        });
        Ответ = await remoteCall("РаботаСБазойДанных.ВыполнитьЗапросRPC",
            {
                ТекстЗапроса: `UPDATE ${Объект.ТаблицаБД.Имя} SET ${array_values.join(",")} WHERE id = $1`,
                Параметры: [МодельОбъекта.id]
            });
        if (!Ответ.err)
            toast.add({ severity: 'info', summary: 'Запись данных', detail: Ответ.httpResponse.statusText, life: 5000 });
    }
    if (Ответ.data)
        МодельОбъекта = Ответ.httpResponse.data[0]
    else if (Ответ.err)
        toast.add({ severity: 'error', summary: 'Запись данных', detail: Ответ.err, life: 5000 });
}

export default { deepAssignObject, remoteCall, ОбработатьТекстЗапросаДляДопПолей, ОбработатьРезультатЗапросаДляОбработкиПолей, ЗаписатьОбъект };