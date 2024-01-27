<template>
    <div style="display: flex; gap: 5px; width: 100%">

        <div :class='button' v-if="props.НастройкаПоля.ТаблицаВнешнегоКлюча" class="button"
            @click="ОбработчикНажатияПоКнопкеВыбора" title='Выбрать из связанной таблицы'>...</div>
        <div :class='button' v-if="props.НастройкаПоля.ТаблицаВнешнегоКлюча" class="button"
            @click="ОбработчикНажатияПоКнопкеОткрытия" title='Открыть значение в связанной таблице'>O</div>


        <input v-if="props.НастройкаПоля.Тип !== 'Дата'" type="text" class="edit_100per" :style="props.НастройкаПоля.Стили"
            v-model="id" />
        <Calendar class="edit" @date-select="ПриВыбореДаты" v-if="props.НастройкаПоля.Тип == 'Дата'" showButtonBar showIcon showTime
            hourFormat="24" v-model="id" dateFormat="@" />
            

    </div>
</template>

<script setup lang="ts">

import { inject, ref } from 'vue';
const СоздатьДиалоговоеОкно = inject('СоздатьДиалоговоеОкно');
import type { ДиалоговоеОкно } from '@/interfaces/КонфигурацияИнтерфейса';
import { ТипКомпонентаПредставления } from '@/interfaces/КонфигурацияИнтерфейса';
const id = defineModel('id');
const Данные = defineModel('Данные');
const props = defineProps(['НастройкаПоля']);

function ПриВыбореДаты(значение) {
    id.value = (new Date(значение)).toISOString(); // в формат ISO 8601 для вставки в PG
}

function ОбработчикНажатияПоКнопкеОткрытия() {

    const ДиалоговоеОкно: ДиалоговоеОкно = {
        id: Date.now(),
        ДанныеСущности: { id: id.value },
        КонфигурацияСущности: props.НастройкаПоля.ТаблицаВнешнегоКлюча,
        ТипКомпонентаПредставления: ТипКомпонентаПредставления.Элемент
    };

    СоздатьДиалоговоеОкно(ДиалоговоеОкно);
}

function ОбработчикНажатияПоКнопкеВыбора() {
    СоздатьДиалоговоеОкно(
        {
            id: Date.now(),
            КонфигурацияСущности: props.НастройкаПоля.ТаблицаВнешнегоКлюча,
            ТипКомпонентаПредставления: "ПредставлениеСписка",
            РежимВыбора: true,
            ОбработчикВыбораВнешнегоКлюча: (selRecord) => {
                try {
                    id.value = selRecord.id;
                } catch (error) {

                }
                props.НастройкаПоля.ОбработчикПослеЗаполненияВнешнегоКлюча ? props.НастройкаПоля.ОбработчикПослеЗаполненияВнешнегоКлюча(selRecord, Данные.value) : () => { }
            },

        });
}


</script>

<style scope>
.edit_100per {
    padding: 1px;
    margin: 1px;
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.3);
    width: 100%
}

.edit {
    padding: 1px;
    margin: 1px;
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.3);
}

.button {
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
    user-select: none;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
}

.button:hover {
    background-color: #efefef;
}

.shadow-box {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}
</style>