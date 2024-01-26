
<template>
    <div>
        <h2>Работа с БД</h2>

        <Dialog maximizable :style="{ width: '50rem' }" v-model:visible="Данные.ПоказатьДиалогСОшибкой"
            header="Ошибка при выполнении запроса" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <p style="padding: 10px;">
                {{ Данные.ОшибкаЗапроса }}
            </p>
        </Dialog>


        <div style="display: flex; flex-direction: column; gap: 10px; padding: 50px;">
            <dev style="display:grid; grid-template-columns: 1fr 7fr; justify-items: left; width: 100%;">
                <div>Запрос:</div>
                <textarea  v-model="Данные.Запрос" style="width: 100%;  box-shadow: 0px 0px 5px  rgba(0, 0, 0, 0.3); border-radius: 3px;" />
                <div>Показывать ошибку в диалоге:</div>
                <input type="checkbox" v-model="Данные.ПоказыватьОшибкуВДиалоге" />
            </dev>
            <v-btn @click="ОбновитьДанные">Выполнить</v-btn>
            <DataTable columnResizeMode='fit' scrollable scrollHeight='700px' selectionMode='single' stripedRows
                size='small' :value='Данные.РезультатЗапроса' tableStyle='min-width: 50rem'
                @row-dblclick='ДвойнойКликПоСтрокеТаблицы' :resizable-columns='true' sortField='id' :sortOrder='1'
                showGridlines style="user-select: none;">
                <Column v-for='(col, index) in Данные.Колонки' :key='index' :field='col' :header='col'
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

const Данные = ref(
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
        { ТекстЗапроса: Данные.value.Запрос });
    if (!Ответ.err) {
        Данные.value.РезультатЗапроса = Ответ.httpResponse.data;
        Данные.value.Колонки = Object.keys(Ответ.httpResponse.data[0]);
    }
    else {
        Данные.value.ОшибкаЗапроса = Ответ.err;
        Данные.value.ПоказатьДиалогСОшибкой = Данные.value.ПоказыватьОшибкуВДиалоге && true;
        toast.add({ severity: 'error', summary: 'Получение данных', detail: Ответ.err, life: 5000 });

    }
}


</script>