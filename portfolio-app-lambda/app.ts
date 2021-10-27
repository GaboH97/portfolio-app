import express from "express";
import { getUserPortfolioInfo } from "./services/usersService";
const app = express()


app.get('/', (req, res) => {
    res.send({ hello: 'world' })
})

app.get('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getUserPortfolioInfo(id);
    res.send(result);
})

app.patch('/:id', (req, res) => {
    res.send({ hello: 'world' })
})


export default app;