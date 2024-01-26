<template>
    <div>
        <h2>{{ Заголовок }}</h2>

        <v-btn style='margin: 5px;' @click='Добавить'>Добавить</v-btn>
        <v-divider vertical></v-divider>
        <v-btn style='margin: 5px;' @click='ОбновитьДанные'>Обновить</v-btn>
        <v-divider vertical></v-divider>
        <v-btn style='margin: 5px;' @click="ЗакрытьДиалоговоеОкно(props.ДиалоговоеОкно)">Закрыть</v-btn>

        <v-btn style='margin: 5px;' @click='Выбрать' v-if="props.ДиалоговоеОкно.РежимВыбора">Выбрать</v-btn>
        <DataTable columnResizeMode='fit' scrollable scrollHeight='700px' selectionMode='single' stripedRows size='small'
            :value='МассивОбъектов' tableStyle='min-width: 50rem' @row-dblclick='ДвойнойКликПоСтрокеТаблицы'
            :resizable-columns='true' sortField='id' :sortOrder='1' showGridlines style="user-select: none;">
            <Column v-for='col of props.ДиалоговоеОкно.КонфигурацияСущности.ПредставлениеСписка.НастройкаПолей'
                :key='col.Имя' :field='col.Имя' :header='col.Заголовок ? col.Заголовок : col.Имя' :sortable='true'>
            </Column>
        </DataTable>

    </div>
</template>
  
<script setup lang="ts">

import type { ДиалоговоеОкно } from '@/interfaces/КонфигурацияИнтерфейса';
import { ТипКомпонентаПредставления } from '@/interfaces/КонфигурацияИнтерфейса';

const СоздатьДиалоговоеОкно = inject('СоздатьДиалоговоеОкно');
const ЗакрытьДиалоговоеОкно = inject('ЗакрытьДиалоговоеОкно');

const Заголовок = computed(() => {
    return props.ДиалоговоеОкно.КонфигурацияСущности.ПредставлениеСписка.Заголовок + (props.ДиалоговоеОкно.РежимВыбора ? ' (выбор)' : '');
});

const props = defineProps(['ДиалоговоеОкно', 'ОбработчикВыбораВнешнегоКлюча']);

import { ref, onMounted, computed, inject } from 'vue';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
import GeneralFunc from '@/GeneralFunc.js';

const ДвойнойКликПоСтрокеТаблицы = (Ev) => {
    if (props.ДиалоговоеОкно.РежимВыбора) {
        props.ОбработчикВыбораВнешнегоКлюча(Ev.data);
        ЗакрытьДиалоговоеОкно(props.ДиалоговоеОкно)
        return;
    }

    ПерейтиКЭлементу(Ev.data.id);
};

const ПерейтиКЭлементу = (id: number) => {
    const ДиалоговоеОкна: ДиалоговоеОкно = {
        id: Date.now(),
        ДанныеСущности: { id: id },
        КонфигурацияСущности: props.ДиалоговоеОкно.КонфигурацияСущности,
        ТипКомпонентаПредставления: ТипКомпонентаПредставления.Элемент
    };
    СоздатьДиалоговоеОкно(ДиалоговоеОкна);
};

const Добавить = () => {
    СоздатьДиалоговоеОкно({ id: Date.now(), Объект: props.ДиалоговоеОкно.КонфигурацияСущности, ТипКомпонентаПредставления: 'ПредставлениеЭлемента' });
};

const МассивОбъектов = ref([]);

async function ОбновитьДанные() {

    let ТекстЗапроса = `SELECT T.* FROM ${props.ДиалоговоеОкно.КонфигурацияСущности.ТаблицаБД.Имя} AS T`;
    ТекстЗапроса = GeneralFunc.ОбработатьТекстЗапросаДляДопПолей(props.ДиалоговоеОкно.КонфигурацияСущности, ТекстЗапроса);
    const Ответ = await GeneralFunc.remoteCall('РаботаСБазойДанных.ВыполнитьЗапросRPC',
        { ТекстЗапроса: ТекстЗапроса });
    if (!Ответ.err)
        МассивОбъектов.value = GeneralFunc.ОбработатьРезультатЗапросаДляОбработкиПолей(props.ДиалоговоеОкно.КонфигурацияСущности, Ответ.httpResponse.data);
    else
        toast.add({ severity: 'error', summary: 'Получение данных', detail: Ответ.err, life: 5000 });
}

onMounted(ОбновитьДанные);

</script>
  
<style scoped></style>