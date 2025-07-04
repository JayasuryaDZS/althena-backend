import express from 'express';
import { createUser, loginUser } from '../controller/userController.js';
import axios from 'axios';

const router = express.Router();

router.post('/create', createUser);

router.post('/login', loginUser);

router.post('/chat/new', async (req, res) => {
    const dataObject = req.body;
    try {
        const response = await axios.post('https://andrea-dev.althena.ai/api/chat/new', dataObject, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'f0d1bca6-53ce-4966-a4f4-9c7624e42b26'
            }
        });
        res.status(200).json({ ...response.data , statusCode: 0 })
    } catch (error) {
        res.status(400).json({ message: error.message })
        console.log(error, 'checign the error message 24 --->');
    }
})

async function getChatHistory(org_id, org_user_id) {
    try {
        const response = await axios.post('https://andrea-dev.althena.ai/api/chat/history', { org_id, org_user_id }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'f0d1bca6-53ce-4966-a4f4-9c7624e42b26'
            }
        });
        return response.data
    } catch (error) {
        throw new Error(error.message);
    }
}

router.post('/chat/history', async (req, res) => {
    const { org_id, org_user_id } = req.body;
    try {
        const chatHistoryList = await getChatHistory(org_id, org_user_id);
        res.status(200).json({ ...chatHistoryList, statusCode: 0 })
    } catch (error) {
        console.log(error, 'checking the error')
        res.status(400).json({ message: error.message })
    }
})

router.post('/chat/:id/continue', async (req, res) => {
    const { id } = req.params;
    const { message, mode } = req.body;
    try {
        const response = await axios.post(`https://andrea-dev.althena.ai/api/chat/${id}/continue`, { message, mode }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'f0d1bca6-53ce-4966-a4f4-9c7624e42b26'
            }
        });
        const messagesArray = [...response.data.messages];
        const lastMesssage = response.data.messages[messagesArray.length - 1];
        const newData = { ...response.data, messages: lastMesssage }
        res.status(200).json({ ...newData, statusCode: 0 })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.post('/chat/messages', async (req, res) => {
    const { chatId } = req.body;
    try {
        const response = await axios.post('https://andrea-dev.althena.ai/api/chat/messages', { chatId }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'f0d1bca6-53ce-4966-a4f4-9c7624e42b26'
            }
        })
        res.status(200).json({ ...response.data, statusCode: 0 })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.put('/chat/:id/delete', async(req, res) => {
    const { id } = req.params;
    const { org_id, org_user_id  } = req.body;
    try {
        const response = await axios.put(`https://andrea-dev.althena.ai/api/chat/${id}/delete`, { org_id, org_user_id }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'f0d1bca6-53ce-4966-a4f4-9c7624e42b26'
            }
        });
        const newhistoryList = await getChatHistory(org_id, org_user_id);
        res.status(200).json({ ...newhistoryList, statusCode: 0 })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

export default router;