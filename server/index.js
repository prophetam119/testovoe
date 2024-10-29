const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const Feedback = require('./models/Feedback')

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/feedbacks');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Ошибка подключения к MongoDB'));

app.get('/api/ping', (req, res) => {
    res.json({ message: 'pong' });
});

app.post('/api/registration', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Проверка наличия отклика с таким же email или телефоном
        const existingFeedback = await Feedback.findOne({ $or: [{ email }, { phone }] });

        if (existingFeedback) {
            console.log('takoi uje est');
            
            return res.status(400).json({
                status: 'error',
                fields: {
                    email: existingFeedback.email === email ? 'Пользователь с таким email уже существует' : null,
                    phone: existingFeedback.phone === phone ? 'Пользователь с таким телефоном уже существует' : null,
                }
            });
        }

        // Создание нового отклика
        const newFeedback = new Feedback({ name, email, phone, message });
        await newFeedback.save();

        res.json({
            status: 'success',
            msg: 'Ваша заявка успешно отправлена'
        });
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({
            status: 'error',
            msg: 'Произошла ошибка при обработке вашего запроса'
        });
    }
});





// app.post('/api/registration', (req, res) => {
//     console.log(req.body);


    

//     if (req.body.email) {
//         res.json({
//             status: 'success',
//             msg: 'Ваша заявка успешно отправлена'
//         });
//     } else {
//         res.status(400).json({
//             status: 'error',
//             fields: {
//                 email: 'Пользователь с таким email уже существует',
//                 phone: 'Неверный формат телефона'
//             }
//         });
//     }
// });

const PORT = 9090;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});