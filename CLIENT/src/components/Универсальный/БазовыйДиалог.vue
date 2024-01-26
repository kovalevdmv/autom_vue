<template>
    <div style="display: flex; gap: 10px; margin: 10px;">
        <v-btn @click="Записать">Записать</v-btn>
        <v-divider vertical></v-divider>
        <v-btn @click="ОбновитьДанные">Обновить</v-btn>
        <v-divider vertical></v-divider>
        <v-btn @click="Закрыть">Закрыть</v-btn>
        <v-divider vertical></v-divider>
        <v-btn @click="Удалить">Удалить</v-btn>
    </div>
</template>

<script setup>

import { defineProps, inject, onMounted } from 'vue';
import GeneralFunc from "@/GeneralFunc.js"
let { props } = defineProps(['props']);
const toast = inject('toast');
const ЗакрытьДиалоговоеОкно = inject('ЗакрытьДиалоговоеОкно');
const МодельОбъекта = defineModel('МодельОбъекта');
const emit = defineEmits(['СобытиеПослеЗаполненияМоделиОбъекта','СобытиеПередЗакрытиемДиалога']);

function Закрыть(){
    const ПараметрыСобытия = {Прервать: false};
    emit('СобытиеПередЗакрытиемДиалога', ПараметрыСобытия);
    if (ПараметрыСобытия.Прервать)
        return;
    ЗакрытьДиалоговоеОкно(props.ОкноСОбъектом);
}

function Записать() {
    GeneralFunc.ЗаписатьОбъект(props.ОкноСОбъектом.Объект, МодельОбъекта.value, toast);

    if ('ПодчиненныеТаблицы' in props.ОкноСОбъектом.Объект)
        for (let curChieldTable of props.ОкноСОбъектом.Объект.ПодчиненныеТаблицы)
            for (let curline of МодельОбъекта.value[curChieldTable.Таблица.Имя])
                GeneralFunc.ЗаписатьОбъект(curChieldTable.Таблица, curline, toast);
}

async function Удалить() {

    if (!МодельОбъекта.value.id)
        return;
    const Ответ = await GeneralFunc.remoteCall("РаботаСБазойДанных.ВыполнитьЗапросRPC",
        {
            ТекстЗапроса: `DELETE FROM ${props.ОкноСОбъектом.Объект.ТаблицаБД.Имя} WHERE id = $1`,
            Параметры: [МодельОбъекта.value.id]
        });

    if (!Ответ.err)
        toast.add({ severity: 'info', summary: 'Удаление данных', detail: Ответ.httpResponse.statusText, life: 5000 });

    if (Ответ.err)
        toast.add({ severity: 'error', summary: 'Удаление данных', detail: Ответ.err, life: 5000 });
}

async function ОбновитьДанные() {
    if (props.ОкноСОбъектом.id_obj) {
        let ТекстЗапроса = `SELECT T.* FROM ${props.ОкноСОбъектом.Объект.ТаблицаБД.Имя} AS T WHERE T.id = $1 ORDER BY ID`;
        ТекстЗапроса = GeneralFunc.ОбработатьТекстЗапросаДляДопПолей(props.ОкноСОбъектом.Объект, ТекстЗапроса);
        const Ответ = await GeneralFunc.remoteCall("РаботаСБазойДанных.ВыполнитьЗапросRPC",
            { ТекстЗапроса: ТекстЗапроса, Параметры: [props.ОкноСОбъектом.id_obj] });
        if (!Ответ.err)
            МодельОбъекта.value = GeneralFunc.ОбработатьРезультатЗапросаДляОбработкиПолей(props.ОкноСОбъектом.Объект, Ответ.httpResponse.data)[0];
        else
            toast.add({ severity: 'error', summary: 'Получение данных', detail: Ответ.err, life: 5000 });

        // Заполнение данных связанных таблиц

        if (props.ОкноСОбъектом.Объект.ПодчиненныеТаблицы) {
            for (let curTable of props.ОкноСОбъектом.Объект.ПодчиненныеТаблицы) {
                let text = `SELECT T.* FROM ${curTable.Таблица.ТаблицаБД.Имя} AS T INNER JOIN ${props.ОкноСОбъектом.Объект.ТаблицаБД.Имя} AS MAIN_TABLE ON MAIN_TABLE.${curTable.КлючГлавнойТаблицы}=T.${curTable.КолонкаСВнешнимКлючемВПодчиненнойТаблице}`;
                text = GeneralFunc.ОбработатьТекстЗапросаДляДопПолей(curTable, text);
                text += ' WHERE MAIN_TABLE.id = $1';
                text += ' ORDER BY T.id';
                let Ответ = await GeneralFunc.remoteCall("РаботаСБазойДанных.ВыполнитьЗапросRPC",
                    { ТекстЗапроса: text, Параметры: [props.ОкноСОбъектом.id_obj] });
                if (!Ответ.err)
                    МодельОбъекта.value[curTable.Таблица.Имя] = GeneralFunc.ОбработатьРезультатЗапросаДляОбработкиПолей(props.ОкноСОбъектом.Объект, Ответ.httpResponse.data);
                else
                    toast.add({ severity: 'error', summary: 'Получение данных', detail: Ответ.err, life: 5000 });

            }
        }
    }

    emit('СобытиеПослеЗаполненияМоделиОбъекта');

}

onMounted(ОбновитьДанные);

</script>
