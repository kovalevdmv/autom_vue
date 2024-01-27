<template>
    <div style="padding: 10px;">

        <h2>{{ Заголовок }}</h2>

        <BaseDialog :props="props" v-model:Данные="Данные"
            @СобытиеПослеЗаполненияМоделиОбъекта="СобытиеПослеЗаполненияМоделиОбъекта"
            @СобытиеПередЗакрытиемДиалога="СобытиеПередЗакрытиемДиалога" />

        <!-- +++ Универсальное заполнение реквизитов -->
        <div style="display: grid; grid-template-columns: 1fr 5fr; gap: 5px; padding: 10px; margin: 5px;">
            <template v-for="curFiled of props.ДиалоговоеОкно.КонфигурацияСущности.ПредставлениеЭлемента.НастройкаПолей"
                :key="curFiled.Имя">
                <div>{{ curFiled.Заголовок }}:</div>
                <EnterField v-model:id="Данные[curFiled.Имя]" v-model:Данные="Данные" :НастройкаПоля="curFiled" />
            </template>
        </div>
        <!-- --- -->

        <!-- +++ Универсальное заполнение подчиненных табличных частей -->
        <TabView>
            <TabPanel v-for="curChiledTable of props.ДиалоговоеОкно.КонфигурацияСущности.ПодчиненныеТаблицы"
                :key="curChiledTable.Таблица.Имя" :header="curChiledTable.Таблица.Имя">
                <div v-if="Данные[curChiledTable.Таблица.Имя]"
                    style="border-width: 1px; border-style: solid; padding: 10px; margin: 10px;">
                    <h2>{{ curChiledTable.ПредставлениеСписка.Заголовок }}</h2>
                    <div style="display: flex; gap: 10px; padding: 10px;">
                        <v-btn
                            @click="ДобавитьСтрокуВПодчиненнуюТаблицу(curChiledTable, Данные[curChiledTable.Таблица.Имя])">Добавить</v-btn>
                    </div>
                    <v-table density="compact">
                        <thead>
                            <tr>
                                <th class="text-left" v-for="field of curChiledTable.ПредставлениеСписка.НастройкаПолей"
                                    :key="field.Имя">
                                    {{ field.Заголовок ? field.Заголовок : field.Имя }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in Данные[curChiledTable.Таблица.Имя]" :key="item.name">
                                <td v-for="curFiled of curChiledTable.ПредставлениеСписка.НастройкаПолей">
                                    <EnterField v-model:id=item[curFiled.Имя]
                                        v-model:Данные=Данные[curChiledTable.Таблица.Имя][index]
                                        :НастройкаПоля="curFiled" />
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>

            </TabPanel>
        </TabView>
        <!-- --- -->

    </div>
</template>
  
<script setup lang="ts">

const props = defineProps(['ДиалоговоеОкно']);
import { ref } from 'vue';
let Заголовок = ref('Элемент');

import EnterField from '@/components/UI/ПолеВвода.vue'
import BaseDialog from '@/components/Универсальный/БазовыйДиалог.vue'

const Данные = ref({ id: 0 });

function СобытиеПередЗакрытиемДиалога(ПараметрыСобытия) {
    //ПараметрыСобытия.Прервать = false;
}

function ДобавитьСтрокуВПодчиненнуюТаблицу(НастройкаПодчиненнойТаблицы, ДанныеПодчиненнойТаблицы) {
    const ДанныеСтроки = {};
    ДанныеСтроки[НастройкаПодчиненнойТаблицы.КолонкаСВнешнимКлючемВПодчиненнойТаблице] = Данные.value[НастройкаПодчиненнойТаблицы.КлючГлавнойТаблицы];
    ДанныеПодчиненнойТаблицы.push(ДанныеСтроки);
}

const ВычислитьЗаголовок = () => {
    if (typeof props.ДиалоговоеОкно.КонфигурацияСущности.ПредставлениеЭлемента.Заголовок === 'function')
        Заголовок.value = props.ДиалоговоеОкно.КонфигурацияСущности.ПредставлениеЭлемента.Заголовок(Данные.value);
    else
        Заголовок.value = props.ДиалоговоеОкно.КонфигурацияСущности.ПредставлениеЭлемента.Заголовок;
};

function СобытиеПослеЗаполненияМоделиОбъекта() {
    ВычислитьЗаголовок();
}

</script>

<style scoped></style>
