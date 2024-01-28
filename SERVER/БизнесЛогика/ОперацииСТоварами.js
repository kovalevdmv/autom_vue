import Настройки from '../sett.js';
import РаботаСБазойДанных from '../РаботаСБазойДанных.js';

function ОтразитьПриобретениеТоваров_ДокументПриобретениеТоваров(Данные) {
  РаботаСБазойДанных.ВыполнитьЗапрос("insert into sklad (name) values ('123');")
}

export function ОтразитьПриобретениеТоваров(Данные) {
  ОтразитьПриобретениеТоваров_ДокументПриобретениеТоваров(Данные);

  return true;
}

export async function ОтразитьПриобретениеТоваровRPC(respons, Параметры, piscina) {

  try {

    let result = undefined;
    if (Настройки.ИспользоватьПотоки)
      result = await piscina.run({ taskName: 'ОтразитьПриобретениеТоваров', data: Параметры });
    else
      result = ОтразитьПриобретениеТоваров(Параметры);

    respons.json(result);
  } catch (error) {
    respons.status(500).send(error.message);
  }


}

export default { ОтразитьПриобретениеТоваров, ОтразитьПриобретениеТоваровRPC }