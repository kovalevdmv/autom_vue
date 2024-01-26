
<template>
    <div>
        <h2>Работа с БД</h2>

        <Dialog maximizable :style="{ width: '50rem' }" v-model:visible="МодельОбъекта.ПоказатьДиалогСОшибкой"
            header="Ошибка при выполнении запроса" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <p style="padding: 10px;">
                {{ МодельОбъекта.ОшибкаЗапроса }}
            </p>
        </Dialog>


        <div style="display: flex; flex-direction: column; gap: 10px; padding: 50px;">
            <dev style="display:grid; grid-template-columns: 1fr 7fr; justify-items: left; width: 100%;">
                <div>Запрос:</div>
                <textarea  v-model="МодельОбъекта.Запрос" style="width: 100%;  box-shadow: 0px 0px 5px  rgba(0, 0, 0, 0.3); border-radius: 3px;" />
                <div>Показывать ошибку в диалоге:</div>
                <input type="checkbox" v-model="МодельОбъекта.ПоказыватьОшибкуВДиалоге" />
            </dev>
            <v-btn @click="ОбновитьДанные">Выполнить</v-btn>
            <DataTable columnResizeMode='fit' scrollable scrollHeight='700px' selectionMode='single' stripedRows
                size='small' :value='МодельОбъекта.РезультатЗапроса' tableStyle='min-width: 50rem'
                @row-dblclick='ДвойнойКликПоСтрокеТаблицы' :resizable-columns='true' sortField='id' :sortOrder='1'
                showGridlines style="user-select: none;">
                <Column v-for='(col, index) in МодельОбъекта.Колонки' :key='index' :field='col' :header='col'
                    :sortable='true'>
                </Column>
            </DataTable>
        </div>

    </div>
</template>

<style scope></style>

<script setup>

import { ref, inject } from 'vue';
import GeneralFunc from '@/GeneralFunc.js';

const МодельОбъекта = ref(
    {
        Запрос: 'select row_number() over(order by id) as index, * from nomenclatures',
        РезультатЗапроса: [],
        Колонки: [],
        ПоказатьДиалогСОшибкой: false,
        ОшибкаЗапроса: '',
        ПоказыватьОшибкуВДиалоге: false
    }
);

const toast = inject('toast');

async function ОбновитьДанные() {

    const Ответ = await GeneralFunc.remoteCall('РаботаСБазойДанных.ВыполнитьЗапросRPC',
        { ТекстЗапроса: МодельОбъекта.value.Запрос });
    if (!Ответ.err) {
        МодельОбъекта.value.РезультатЗапроса = Ответ.httpResponse.data;
        МодельОбъекта.value.Колонки = Object.keys(Ответ.httpResponse.data[0]);
    }
    else {
        МодельОбъекта.value.ОшибкаЗапроса = Ответ.err;
        МодельОбъекта.value.ПоказатьДиалогСОшибкой = МодельОбъекта.value.ПоказыватьОшибкуВДиалоге && true;
        toast.add({ severity: 'error', summary: 'Получение данных', detail: Ответ.err, life: 5000 });

    }
}


</script>