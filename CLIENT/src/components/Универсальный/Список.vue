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
            <Column v-for='col of Поля' :key='col.Имя' :field='col.Имя' :header='col.Заголовок ? col.Заголовок : col.Имя'
                :sortable='true'>
            </Column>
        </DataTable>


    </div>
</template>
  
<script setup lang="ts">

import type { ДиалоговоеОкно } from '@/interfaces/КонфигурацияИнтерфейса';
import { ТипКомпонентаПредставления } from '@/interfaces/КонфигурацияИнтерфейса';

const Поля = ref([]);

const СоздатьДиалоговоеОкно = inject('СоздатьДиалоговоеОкно');
const ЗакрытьДиалоговоеОкно = inject('ЗакрытьДиалоговоеОкно');

const Заголовок = computed(() => {
    return props.ДиалоговоеОкно.КонфигурацияСущности.ПредставлениеСписка.Заголовок + (props.ДиалоговоеОкно.РежимВыбора ? ' (выбор)' : '');
});

const props = defineProps(['ДиалоговоеОкно', 'ОбработчикВыбораВнешнегоКлюча']);

import { ref, onMounted, computed, inject } from 'vue';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
import ОбщииФукнции from '@/ОбщииФукнции.ts';

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
    СоздатьДиалоговоеОкно({ id: Date.now(), КонфигурацияСущности: props.ДиалоговоеОкно.КонфигурацияСущности, ТипКомпонентаПредставления: 'ПредставлениеЭлемента' });
};

const МассивОбъектов = ref([]);

async function ОбновитьДанные() {

    let ТекстЗапроса = `SELECT T.* FROM ${props.ДиалоговоеОкно.КонфигурацияСущности.ТаблицаБД.Имя} AS T`;
    ТекстЗапроса = ОбщииФукнции.ОбработатьТекстЗапросаДляДопПолей(props.ДиалоговоеОкно.КонфигурацияСущности, ТекстЗапроса);
    const Ответ = await ОбщииФукнции.ВызватьМетодНаСервере('РаботаСБазойДанных.ВыполнитьЗапросRPC',
        { ТекстЗапроса: ТекстЗапроса });
    if (!Ответ.err)
        МассивОбъектов.value = ОбщииФукнции.ОбработатьРезультатЗапросаДляОбработкиПолей(props.ДиалоговоеОкно.КонфигурацияСущности, Ответ.data);
    else
        toast.add({ severity: 'error', summary: 'Получение данных', detail: Ответ.err, life: 5000 });

    // Если колонки списка не указаны явно, вывести все что указна для создания таблиц
    if (!props.ДиалоговоеОкно.КонфигурацияСущности.ДопПоля)
        props.ДиалоговоеОкно.КонфигурацияСущности.ДопПоля = []
    if (Array.isArray(props.ДиалоговоеОкно.КонфигурацияСущности.ПредставлениеСписка.НастройкаПолей))
        Поля.value = [...props.ДиалоговоеОкно.КонфигурацияСущности.ПредставлениеСписка.НастройкаПолей];
    else
        Поля.value = [];
    if (Поля.value.length == 0 || Поля.value.filter(el => el.Имя == "*").length > 0) {
        for (let Колонка of props.ДиалоговоеОкно.КонфигурацияСущности.ТаблицаБД.Колонки)
            Поля.value.push({ Имя: Колонка._Имя, Заголовок: Колонка._Синоним });
        for (let Колонка of props.ДиалоговоеОкно.КонфигурацияСущности.ДопПоля) {
            const ИмяПоля = (Колонка.Поле.toLowerCase().includes(" as ") ? Колонка.Поле.toLowerCase().split("as")[1] : Колонка.Поле).trim();
            Поля.value.push({ Имя: ИмяПоля, Заголовок: Колонка.Заголовок });
        }
    }
    Поля.value = Поля.value.filter(el => el.Имя !== "*");
}

onMounted(ОбновитьДанные);

</script>
  
<style scoped></style>@/ОбщииФукнции.ts