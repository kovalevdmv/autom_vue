import { rpcMethods } from './rpc.js';

import Piscina from 'piscina';
const piscina = new Piscina({ filename: './worker.js' });

import express from 'express';
const app = express();
const port = 3000;
import cors from 'cors';

// Используйте CORS для всех маршрутов
app.use(cors());

app.use(express.json()); // Для разбора JSON-тел запросов

// вызор на клиенте
//{
//    "MethodName": "Module1.Method1",
//    "Parameters": Any
//}
app.post('/api/rpc', (req, res) => {
    const { MethodName, Parameters } = req.body;
    const [ModuleName, Method] = MethodName.split('.');
    if (rpcMethods[ModuleName] && rpcMethods[ModuleName][Method]) {
        try {
            rpcMethods[ModuleName][Method](res, Parameters, piscina);
        } catch (error) {
            res.status(200).json({ status: 'error', message: error });
        }
    } else {
        res.status(200).json({ status: 'error', message: `Method not found ${MethodName}` });
    }
});

/*
// Получение всех элементов
app.get('/api/items', (req, res) => {
    Nomenclature.findAll().then(items => res.json(items));
});

// Добавление нового элемента
app.post('/api/items', (req, res) => {
    console.log(Date.now());
    console.log(req.body);
    Nomenclature.create(req.body).then(item => res.status(201).json(item)).catch(err => {
        console.error('Error fetching item', err);
        res.status(500).send('Internal Server Error');
    });
});


app.put('/api/items/:id', (req, res) => {
    const id = req.params.id;
    Nomenclature.findByPk(id)
        .then(item => {
            if (!item) {
                res.status(404).send('Item not found');
            } else {
                console.log(req.body);
                item.update(req.body)
                    .then(updatedItem => {
                        res.status(200).send('Ok');
                    })
                    .catch(err => {
                        console.error('Error updating item', err);
                        res.status(500).send('Internal Server Error');
                    });
            }
        })
        .catch(err => {
            console.error('Error fetching item', err);
            res.status(500).send('Internal Server Error');
        });
});


// Маршрут для получения товара по ID
app.get('/api/items/:id', (req, res) => {
    const id = req.params.id;

    Nomenclature.findByPk(id)
        .then(product => {
            if (product) {
                res.json(product);
            } else {
                res.status(404).send('Product not found');
            }
        })
        .catch(err => {
            console.error('Error fetching product', err);
            res.status(500).send('Internal Server Error');
        });
});

// Другие маршруты для обновления и удаления...
*/

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
