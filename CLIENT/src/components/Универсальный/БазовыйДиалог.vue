<template>
    <div style="display: flex; gap: 10px; margin: 10px;">
        <v-btn @click="Записать">Записать</v-btn>
        <v-divider vertical></v-divider>
        <v-btn @click="ОбновитьДанные">Обновить</v-btn>
        <v-divider vertical></v-divider>
        <v-btn @click="Закрыть">Закрыть</v-btn>
        <!--
        <v-divider vertical></v-divider>
        <v-btn @click="Удалить">Удалить</v-btn>
        -->
    </div>
</template>

<script setup lang="ts">

import type { ДиалоговоеОкно } from '@/interfaces/КонфигурацияИнтерфейса.ts'
import { defineProps, inject, onMounted } from 'vue';
import ОбщииФукнции from "@/ОбщииФукнции.ts"
import type { ДанныеСущности } from '@/interfaces/КонфигурацияСистемы';
const { props } = defineProps(['props']);
const toast = inject('toast');
const ЗакрытьДиалоговоеОкно = inject('ЗакрытьДиалоговоеОкно');
const Данные = defineModel<ДанныеСущности>('Данные');
const emit = defineEmits(['СобытиеПослеЗаполненияМоделиОбъекта', 'СобытиеПередЗакрытиемДиалога']);


function Закрыть() {
    const ПараметрыСобытия = { Прервать: false };
    emit('СобытиеПередЗакрытиемДиалога', ПараметрыСобытия);
    if (ПараметрыСобытия.Прервать)
        return;
    ЗакрытьДиалоговоеОкно(props.ДиалоговоеОкно);
}

function Записать() {
    ОбщииФукнции.ЗаписатьОбъект(props.ДиалоговоеОкно.КонфигурацияСущности, Данные.value, toast);

    if ('ПодчиненныеТаблицы' in props.ДиалоговоеОкно.КонфигурацияСущности)
        for (let curChieldTable of props.ДиалоговоеОкно.КонфигурацияСущности.ПодчиненныеТаблицы)
            for (let curline of Данные.value[curChieldTable.Таблица.Имя])
                ОбщииФукнции.ЗаписатьОбъект(curChieldTable.Таблица, curline, toast);
}

async function Удалить() {

    if (!Данные.value.id)
        return;
    const Ответ = await ОбщииФукнции.ВызватьМетодНаСервере("РаботаСБазойДанных.ВыполнитьЗапросRPC",
        {
            ТекстЗапроса: `DELETE FROM ${props.ДиалоговоеОкно.КонфигурацияСущности.ТаблицаБД.Имя} WHERE id = $1`,
            Параметры: [Данные.value.id]
        });

    if (!Ответ.err)
        toast.add({ severity: 'info', summary: 'Удаление данных', detail: Ответ.httpResponse.statusText, life: 5000 });

    if (Ответ.err)
        toast.add({ severity: 'error', summary: 'Удаление данных', detail: Ответ.err, life: 5000 });
}

async function ОбновитьДанные() {
    if (props.ДиалоговоеОкно.ДанныеСущности && props.ДиалоговоеОкно.ДанныеСущности.id) {
        let ТекстЗапроса = `SELECT T.* FROM ${props.ДиалоговоеОкно.КонфигурацияСущности.ТаблицаБД.Имя} AS T WHERE T.id = $1 ORDER BY ID`;
        ТекстЗапроса = ОбщииФукнции.ОбработатьТекстЗапросаДляДопПолей(props.ДиалоговоеОкно.КонфигурацияСущности, ТекстЗапроса);
        const Ответ = await ОбщииФукнции.ВызватьМетодНаСервере("РаботаСБазойДанных.ВыполнитьЗапросRPC",
            { ТекстЗапроса: ТекстЗапроса, Параметры: [props.ДиалоговоеОкно.ДанныеСущности.id] });
        if (!Ответ.err)
            Данные.value = ОбщииФукнции.ОбработатьРезультатЗапросаДляОбработкиПолей(props.ДиалоговоеОкно.КонфигурацияСущности, Ответ.data)[0];
        else
            toast.add({ severity: 'error', summary: 'Получение данных', detail: Ответ.err, life: 5000 });

        // Заполнение данных связанных таблиц

        if (props.ДиалоговоеОкно.КонфигурацияСущности.ПодчиненныеТаблицы) {
            for (let curTable of props.ДиалоговоеОкно.КонфигурацияСущности.ПодчиненныеТаблицы) {
                let text = `SELECT T.* FROM ${curTable.Таблица.ТаблицаБД.Имя} AS T LEFT JOIN ${props.ДиалоговоеОкно.КонфигурацияСущности.ТаблицаБД.Имя} AS MAIN_TABLE ON MAIN_TABLE.${curTable.КлючГлавнойТаблицы}=T.${curTable.КолонкаСВнешнимКлючемВПодчиненнойТаблице}`;
                text = ОбщииФукнции.ОбработатьТекстЗапросаДляДопПолей(curTable, text); // доп поля из секции ПодчиненныеТаблицы.ДопПоля
                //text = ОбщииФукнции.ОбработатьТекстЗапросаДляДопПолей(curTable.Таблица, text); // доп поля из ПодчиненныеТаблицы.Таблица.ДопПоля
                text += ' WHERE MAIN_TABLE.id = $1';
                text += ' ORDER BY T.id';
                let Ответ = await ОбщииФукнции.ВызватьМетодНаСервере("РаботаСБазойДанных.ВыполнитьЗапросRPC",
                    { ТекстЗапроса: text, Параметры: [props.ДиалоговоеОкно.ДанныеСущности.id] });
                if (!Ответ.err)
                    Данные.value[curTable.Таблица.Имя] = ОбщииФукнции.ОбработатьРезультатЗапросаДляОбработкиПолей(props.ДиалоговоеОкно.КонфигурацияСущности, Ответ.data);
                else
                    toast.add({ severity: 'error', summary: 'Получение данных', detail: Ответ.err, life: 5000 });

            }
        }
    }

    emit('СобытиеПослеЗаполненияМоделиОбъекта');

}

onMounted(ОбновитьДанные);

</script>
