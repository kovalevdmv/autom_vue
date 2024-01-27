import { ТипыКолонок, ДействияПриИзмененииГлавнойВнешнейТаблицы, ТаблицаВБД } from '@/РаботаСМодельюБД';

export const ТипСкладаБД = new ТаблицаВБД('type','Тип склада');
ТипСкладаБД.Колонка("id").Тип(ТипыКолонок.INTEGER).НеNull().АвтоИнкремент().ЭтоПервичныйКлюч();
ТипСкладаБД.Колонка("name").Тип(ТипыКолонок.TEXT);

export const СкладБД = new ТаблицаВБД('sklad','Склады');
СкладБД.Колонка("id").Тип(ТипыКолонок.INTEGER).НеNull().АвтоИнкремент().ЭтоПервичныйКлюч();
СкладБД.Колонка("name").Тип(ТипыКолонок.TEXT);
СкладБД.Колонка("type_id").Тип(ТипыКолонок.INTEGER)
    .ЭтоВнешнийКлюч(true,ТипСкладаБД,'id',ДействияПриИзмененииГлавнойВнешнейТаблицы.НетДействия,ДействияПриИзмененииГлавнойВнешнейТаблицы.Ограничивать);

export const НоменклатураБД = new ТаблицаВБД('nomenclatures','Номенклатура');
НоменклатураБД.Колонка("id").Тип(ТипыКолонок.INTEGER).НеNull().АвтоИнкремент().ЭтоПервичныйКлюч();
НоменклатураБД.Колонка("name").Тип(ТипыКолонок.TEXT);
НоменклатураБД.Колонка("price").Тип(ТипыКолонок.NUMERIC_ТОЧНОСТЬ(10, 2));
НоменклатураБД.Колонка("description").Тип(ТипыКолонок.TEXT);
НоменклатураБД.Колонка("main_warehouse").Тип(ТипыКолонок.INTEGER).ЭтоВнешнийКлюч(true,СкладБД,'id',ДействияПриИзмененииГлавнойВнешнейТаблицы.НетДействия,ДействияПриИзмененииГлавнойВнешнейТаблицы.Ограничивать);
НоменклатураБД.Колонка("type_id").Тип(ТипыКолонок.INTEGER);
НоменклатураБД.Колонка("projects_id").Тип(ТипыКолонок.INTEGER);

export const АналогиБД = new ТаблицаВБД('analoguesofnomenclature','Аналоги номенклатуры');
АналогиБД.Колонка("id").Тип(ТипыКолонок.INTEGER).НеNull().АвтоИнкремент().ЭтоПервичныйКлюч();
АналогиБД.Колонка("nomenclature_id").Тип(ТипыКолонок.INTEGER).НеNull().ЭтоВнешнийКлюч(true, НоменклатураБД, 'id', ДействияПриИзмененииГлавнойВнешнейТаблицы.НетДействия, ДействияПриИзмененииГлавнойВнешнейТаблицы.Ограничивать);
АналогиБД.Колонка("analogue_id").Тип(ТипыКолонок.INTEGER).ЭтоВнешнийКлюч(true, НоменклатураБД, 'id', ДействияПриИзмененииГлавнойВнешнейТаблицы.НетДействия, ДействияПриИзмененииГлавнойВнешнейТаблицы.Ограничивать);
АналогиБД.Колонка("comment").Тип(ТипыКолонок.TEXT);

export const ПроектыБД = new ТаблицаВБД('projects','Проекты');
ПроектыБД.Колонка("id").Тип(ТипыКолонок.INTEGER).НеNull().АвтоИнкремент().ЭтоПервичныйКлюч();
ПроектыБД.Колонка("name").Тип(ТипыКолонок.TEXT);
ПроектыБД.Колонка("nom_id").Тип(ТипыКолонок.INTEGER).ЭтоВнешнийКлюч(true, НоменклатураБД, 'id', ДействияПриИзмененииГлавнойВнешнейТаблицы.НетДействия, ДействияПриИзмененииГлавнойВнешнейТаблицы.Ограничивать);

export const ПриобретениеТоваровБД = new ТаблицаВБД('purchase_of_goods','Приобретение товаров');
ПриобретениеТоваровБД.Колонка('id').Тип(ТипыКолонок.INTEGER).АвтоИнкремент().ЭтоПервичныйКлюч();
ПриобретениеТоваровБД.Колонка('number').Тип(ТипыКолонок.INTEGER);
ПриобретениеТоваровБД.Колонка('date').Тип(ТипыКолонок.timestamp_with_time_zone).НеNull().ПоУмолчанию('NOW()');
ПриобретениеТоваровБД.Колонка('warehouse').Тип(ТипыКолонок.INTEGER).НеNull()
    .ЭтоВнешнийКлюч(true,СкладБД,'id',ДействияПриИзмененииГлавнойВнешнейТаблицы.НетДействия,ДействияПриИзмененииГлавнойВнешнейТаблицы.Ограничивать)
ПриобретениеТоваровБД.Колонка("comment").Тип(ТипыКолонок.TEXT);    


export  default [НоменклатураБД, АналогиБД, ТипСкладаБД, СкладБД, ПроектыБД, ПриобретениеТоваровБД];    