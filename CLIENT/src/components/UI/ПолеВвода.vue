<template>
    <div style="display: flex; gap: 5px; width: 100%">

        <div :class='button' v-if="props.ТаблицаВнешнегоКлюча" class="button" @click="ОбработчикНажатияПоКнопкеВыбора"
            title='Выбрать из связанной таблицы'>...</div>
        <div :class='button' v-if="props.ТаблицаВнешнегоКлюча" class="button" @click="ОбработчикНажатияПоКнопкеОткрытия"
            title='Открыть значение в связанной таблице'>O</div>


        <input type="text" class="edit" :style="props.styleForInput" v-model="id" />
    </div>
</template>


<script setup lang="ts">

import { inject } from 'vue';
const СоздатьДиалоговоеОкно = inject('СоздатьДиалоговоеОкно');
import type { ДиалоговоеОкно } from '@/interfaces/КонфигурацияИнтерфейса';
import { ТипКомпонентаПредставления } from '@/interfaces/КонфигурацияИнтерфейса';
const id = defineModel('id');
const Данные = defineModel('Данные');
const props = defineProps(['ТаблицаВнешнегоКлюча', 'ОбработчикПослеЗаполненияВнешнегоКлюча', 'styleForInput', 'attrForInput']);

function ОбработчикНажатияПоКнопкеОткрытия() {
    const ДиалоговоеОкно: ДиалоговоеОкно = {
        id: Date.now(),
        id_obj: id,
        Объект: props.ТаблицаВнешнегоКлюча,
        ТипКомпонентаПредставления: ТипКомпонентаПредставления.Элемент
    };
    СоздатьДиалоговоеОкно(ДиалоговоеОкно);
}

function ОбработчикНажатияПоКнопкеВыбора() {
    СоздатьДиалоговоеОкно(
        {
            id: Date.now(),
            Объект: props.ТаблицаВнешнегоКлюча,
            ТипКомпонентаПредставления: "ПредставлениеСписка",
            РежимВыбора: true,
            ОбработчикВыбораВнешнегоКлюча: (selRecord) => {
                try {
                    id.value = selRecord.id;
                } catch (error) {
                    
                }
                props.ОбработчикПослеЗаполненияВнешнегоКлюча ? props.ОбработчикПослеЗаполненияВнешнегоКлюча(selRecord, Данные.value) : () => { }
            },
            
        });
    }
    
    
</script>

<style scope>
.edit {
    padding: 1px;
    margin: 1px;
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.3);
    width: 100%
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