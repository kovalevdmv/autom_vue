<template>
    <div>
        <h2>{{ Заголовок }}</h2>
        
        <v-btn style='margin: 5px;' @click='Добавить'>Добавить</v-btn>
        <v-divider vertical></v-divider>
        <v-btn style='margin: 5px;' @click='ОбновитьДанные'>Обновить</v-btn>
        <v-divider vertical></v-divider>
        <v-btn style='margin: 5px;' @click="ЗакрытьДиалоговоеОкно(props.ОкноСОбъектом)">Закрыть</v-btn>
        
        <v-btn style='margin: 5px;' @click='Выбрать' v-if="props.ОкноСОбъектом.РежимВыбора">Выбрать</v-btn>
        <DataTable columnResizeMode='fit' scrollable scrollHeight='700px' selectionMode='single' stripedRows size='small'
            :value='МассивОбъектов' tableStyle='min-width: 50rem' @row-dblclick='ДвойнойКликПоСтрокеТаблицы'
            :resizable-columns='true' sortField='id' :sortOrder='1' showGridlines style="user-select: none;">
            <Column v-for='col of props.ОкноСОбъектом.Объект.ПредставлениеСписка.НастройкаПолей' :key='col.Имя' :field='col.Имя'
                :header='col.Заголовок ? col.Заголовок : col.Имя' :sortable='true'>
            </Column>
        </DataTable>
        
    </div>
</template>
  
<script setup lang="ts">

const СоздатьДиалоговоеОкно = inject('СоздатьДиалоговоеОкно');
const ЗакрытьДиалоговоеОкно = inject('ЗакрытьДиалоговоеОкно');

const Заголовок = computed(() => {
    return props.ОкноСОбъектом.Объект.ПредставлениеСписка.Заголовок + (props.ОкноСОбъектом.РежимВыбора ? ' (выбор)' : '');
});

const props = defineProps(['ОкноСОбъектом', 'ОбработчикВыбораВнешнегоКлюча']);

import { ref, onMounted, computed, inject } from 'vue';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
import GeneralFunc from '@/GeneralFunc.js';

const ДвойнойКликПоСтрокеТаблицы = (Ev) => {
    if (props.ОкноСОбъектом.РежимВыбора) {
        props.ОбработчикВыбораВнешнегоКлюча( Ev.data );
        ЗакрытьДиалоговоеОкно(props.ОкноСОбъектом)
        return;
    }

    ПерейтиКЭлементу(Ev.data.id);
};

const ПерейтиКЭлементу = (id) => {
    СоздатьДиалоговоеОкно({
        id: Date.now(),
        id_obj: id,
        Объект: props.ОкноСОбъектом.Объект,
        ТипКомпонентаПредставления: 'ПредставлениеЭлемента'
    });
};

const Добавить = () => {
    СоздатьДиалоговоеОкно({ id: Date.now(), id_obj: undefined, Объект: props.ОкноСОбъектом.Объект, ТипКомпонентаПредставления: 'ПредставлениеЭлемента' });
};

const МассивОбъектов = ref([]);

async function ОбновитьДанные() {

    let ТекстЗапроса = `SELECT T.* FROM ${props.ОкноСОбъектом.Объект.ТаблицаБД.Имя} AS T`;
    ТекстЗапроса = GeneralFunc.ОбработатьТекстЗапросаДляДопПолей(props.ОкноСОбъектом.Объект, ТекстЗапроса);
    const Ответ = await GeneralFunc.remoteCall('РаботаСБазойДанных.ВыполнитьЗапросRPC',
        { ТекстЗапроса: ТекстЗапроса });
    if (!Ответ.err)
        МассивОбъектов.value = GeneralFunc.ОбработатьРезультатЗапросаДляОбработкиПолей(props.ОкноСОбъектом.Объект, Ответ.httpResponse.data);
    else
        toast.add({ severity: 'error', summary: 'Получение данных', detail: Ответ.err, life: 5000 });
}

onMounted(ОбновитьДанные);

</script>
  
<style scoped></style>