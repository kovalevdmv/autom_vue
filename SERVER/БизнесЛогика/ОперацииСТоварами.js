import Настройки from '../sett.js';
import БД from '../РаботаСБазойДанных.js';

async function ОтразитьПриобретениеТоваров_ОбъектПриобретениеТоваров(Параметры) {

  if (!Параметры.Данные.id)
    return { type: 'info', text: 'Нет данных по объекту. id не указан' };

  const КлиентДБ = await БД.НачатьТранзакцию();

  try {
    // удалить существующие записи
    БД.УдалитьЗаписиВАгрегирующихТаблицахПоИДРегистратора(КлиентДБ, 'movement_of_goods', Параметры.Данные.id, Параметры.ТаблицаБД.Имя);

    // Добавить новые записи
    Параметры.Данные.ПриобретениеТоваровТаблицаТоваров.forEach((Строка) => {
      БД.ВыполнитьЗапросВТранзакции(КлиентДБ,
        `INSERT INTO movement_of_goods (date,registrator_id,registrator_type,warehouse_id,goods_id,quantity,amount) VALUES
        ($1,$2,$3,$4,$5,$6,$7)`,
        [Параметры.Данные.date, Параметры.Данные.id, Параметры.ТаблицаБД.Имя, Параметры.Данные.warehouse_id, Строка.goods_id, Строка.quantity, Строка.amount]
      );
    }
    );

    БД.ЗафиксироватьТранзакцию(КлиентДБ);

  } catch (err) {

    console.log(err.message);
    БД.ОтменитьТранзакцию(КлиентДБ);

    return { type: 'error', text: err.message };
  }

  return { type: 'info', text: 'ОбъектЗаписан' };

}

export async function ОтразитьПриобретениеТоваров(Данные) {
  const res = await ОтразитьПриобретениеТоваров_ОбъектПриобретениеТоваров(Данные);

  return res;
}

export async function ОтразитьПриобретениеТоваровRPC(respons, Параметры, piscina) {

  try {

    let result = undefined;
    if (Настройки.ИспользоватьПотоки)
      result = await piscina.run({ taskName: 'ОтразитьПриобретениеТоваров', data: Параметры });
    else
      result = await ОтразитьПриобретениеТоваров(Параметры);

    respons.json(result);
  } catch (error) {
    respons.status(500).send(error.message);
  }


}

export default { ОтразитьПриобретениеТоваров, ОтразитьПриобретениеТоваровRPC }