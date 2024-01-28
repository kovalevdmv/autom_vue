import РаботаСБазойДанных from './РаботаСБазойДанных.js';
import ОперацииСТоварами from './БизнесЛогика/ОперацииСТоварами.js'

const rpcMethods = {
    РаботаСБазойДанных : {
        ВыполнитьЗапросRPC: РаботаСБазойДанных.ВыполнитьЗапросRPC,
    },
    ОперацииСТоварами: {
        ОтразитьПриобретениеТоваровRPC: ОперацииСТоварами.ОтразитьПриобретениеТоваровRPC,
    }
};

export { rpcMethods };