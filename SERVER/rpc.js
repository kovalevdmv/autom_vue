import РаботаСНоменклатурой from './РаботаСНоменклатурой.js';
import РаботаСБазойДанных from './РаботаСБазойДанных.js';
import ОпрерацииСТоварами from './БизнесЛогика/ОпрерацииСТоварами.js'

const rpcMethods = {
    РаботаСНоменклатурой: {
        ДобавитьНоменклатуруRPC: РаботаСНоменклатурой.ДобавитьНоменклатуруRPC,
        УдалитьНоменклатуруRPC: РаботаСНоменклатурой.УдалитьНоменклатуруRPC,
    },
    РаботаСБазойДанных : {
        ВыполнитьЗапросRPC: РаботаСБазойДанных.ВыполнитьЗапросRPC,
    },
    ОпрерацииСТоварами: {
        ОтразитьПриобретениеТоваров: ОпрерацииСТоварами.ОтразитьПриобретениеТоваров,
    }
};

export { rpcMethods };