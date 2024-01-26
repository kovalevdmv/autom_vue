<template>
  <div class="root">
    <Toast />

    <!-- +++ Главная панель -->
    <div style="border-style: solid; border-width: 1px; display: flex; gap: 10px; padding: 5px;">
      <div v-for="el in ГлавноеМеню.Элементы" :key="el.Представление" style="display: flex;">
        <a class="link_mail_panel" @click.prevent="ОбработчикНажатияПоСсылке(el.КонфигурацияТаблицыБД)">{{ el.Представление }}</a>
      </div>
    </div>
    <!-- --- Главная панель -->

    <!-- +++ Таксбар -->
    <div style="border-style: solid; border-width: 1px; display: flex;" class="my-component">
      <div v-for="curWindow in СозданныеДиалоговыеОкна" :key="curWindow.id" @click="ОбработчикНажатияПоЗадаче(curWindow)"
        class="task" :class="{ active: curWindow === ТекущийАктивноеДиалоговоеОкно }">
        {{ curWindow.Объект.Имя }}
        <div @click.stop="ОбработчикНажатияПоЗакрытьЗадачу(curWindow)"
          style="box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5); padding-left: 7px; padding-right: 7px; margin-left: 5px; background-color: #ec3b41b3; border-radius: 5px; cursor: pointer;">
          X</div>
      </div>
    </div>
    <!-- --- -->

    <component v-for="curWindow in СозданныеДиалоговыеОкна" :key="curWindow.id"
      :ОбработчикВыбораВнешнегоКлюча="curWindow.ОбработчикВыбораВнешнегоКлюча"
      v-show="curWindow === ТекущийАктивноеДиалоговоеОкно"
      :is=curWindow.Объект[curWindow.ТипКомпонентаПредставления].Компонента :ОкноСОбъектом="curWindow" />
    <!-- <router-view></router-view> -->
  </div>
</template>

<script setup lang="ts">

import { ГлавноеМеню } from './Настройки';
import { ТипКомпонентаПредставления } from './interfaces/КонфигурацияИнтерфейса';
import type { ДиалоговоеОкно } from './interfaces/КонфигурацияИнтерфейса';
import type { КонфигурацияТаблицыБД } from './interfaces/КонфигурацияБД';
import { ref, provide } from 'vue';
import { useToast } from "primevue/usetoast";
const toast = useToast();

provide('СоздатьДиалоговоеОкно', СоздатьДиалоговоеОкно);
provide('ЗакрытьДиалоговоеОкно', ЗакрытьДиалоговоеОкно);
provide('toast', toast);

const СозданныеДиалоговыеОкна = ref<ДиалоговоеОкно[]>([]);
const ТекущийАктивноеДиалоговоеОкно = ref<ДиалоговоеОкно>();

function ОбработчикНажатияПоСсылке(КонфигурацияОбъекта: КонфигурацияТаблицыБД) {
  const НовоеДиалоговоеОкно: ДиалоговоеОкно =
  {
    id: Date.now(), Объект: КонфигурацияОбъекта, ТипКомпонентаПредставления: ТипКомпонентаПредставления.Список
  };
  ТекущийАктивноеДиалоговоеОкно.value = НовоеДиалоговоеОкно;

  СозданныеДиалоговыеОкна.value.push(ТекущийАктивноеДиалоговоеОкно.value);
}

// Вызывается из других компонент
function СоздатьДиалоговоеОкно(ДиалоговоеОкно: ДиалоговоеОкно) {
  ТекущийАктивноеДиалоговоеОкно.value = ДиалоговоеОкно;
  СозданныеДиалоговыеОкна.value.push(ТекущийАктивноеДиалоговоеОкно.value);
}

function ЗакрытьДиалоговоеОкно(ДиалоговоеОкно: ДиалоговоеОкно) {
  СозданныеДиалоговыеОкна.value = СозданныеДиалоговыеОкна.value.filter(_ => _ != ДиалоговоеОкно);
  const ПоследнееОкно = СозданныеДиалоговыеОкна.value[СозданныеДиалоговыеОкна.value.length - 1];
  ТекущийАктивноеДиалоговоеОкно.value = ПоследнееОкно;
}

function ОбработчикНажатияПоЗакрытьЗадачу(ДиалоговоеОкно: ДиалоговоеОкно) {
  ЗакрытьДиалоговоеОкно(ДиалоговоеОкно);
}

function ОбработчикНажатияПоЗадаче(ДиалоговоеОкно: ДиалоговоеОкно) {
  ТекущийАктивноеДиалоговоеОкно.value = ДиалоговоеОкно;
}

</script>

<style >
.link_mail_panel {
  user-select: none;
  color: black;
}

.link_mail_panel:hover {}

.task {
  margin: 5px;
  padding: 3px;

  border-width: 1px;
  display: flex;
  border-radius: 5px;
  user-select: none;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);
}

.task:hover:not(.active) {
  background-color: #efefef;
}

.active {
  background-color: #dedede;
}

/* Сброс стилей для body и html */
html,
body {
  display: block;
}

/* Стили для вашего root элемента */
.root {
  border-style: dotted;
  border-width: 1px;
  margin: 0;
  /* Убираем внешние отступы */
  width: 100vw;
  /* Занимает 100% ширины родителя */
  height: 100%;
  /* Занимает 100% высоты родителя */
  box-sizing: border-box;
  /* Включает границы и padding в общие размеры */
}
</style>
