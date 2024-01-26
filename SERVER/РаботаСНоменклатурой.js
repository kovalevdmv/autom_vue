import {Nomenclature} from './models/Nomenclature.js';

const ДобавитьНоменклатуруRPC = async (respons, Параметры) => {
    try {
        const item = await Nomenclature.create(Параметры.ДанныеНоменклатуры);
        respons.status(200).json(item);
    } catch (err) {
        console.error('Error fetching item', err);
        respons.status(500).send('Internal Server Error');
    }
}

const УдалитьНоменклатуруRPC = (respons, Параметры) => {

    Nomenclature.findByPk(Параметры.id)
        .then(item => {
            if (!item) {
                respons.status(404).send('Item not found');
            } else {
                item.destroy()
                    .then(() => {
                        respons.status(200).send('Item successfully deleted');
                    })
                    .catch(err => {
                        console.error('Error deleting item', err);
                        respons.status(500).send('Internal Server Error');
                    });
            }
        })
        .catch(err => {
            console.error('Error fetching item', err);
            respons.status(500).send('Internal Server Error');
        });
}

export default { ДобавитьНоменклатуруRPC, УдалитьНоменклатуруRPC }