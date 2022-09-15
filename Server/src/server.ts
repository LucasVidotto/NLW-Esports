import express from 'express';
import { PrismaClient } from '@prisma/client'
const app = express();
const prisma = new PrismaClient()

// HTTP methods // REST Api //HTTP codes

//pesquisar (http codes mdn)
app.get('/games', async (req, res) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,
                }
            }
        }
    })
    return res.json(games);
})
app.post('/ads', (req, res) => {
    return res.status(201).json([]);
})

app.get("/games/:id/ads", async (req, res) => {
    const gameId = req.params.id;
    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourEnd: true,
            hourStart: true,
        },
        where: {
            gameId,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return res.json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(',')
        }
    }))
});
app.get("/ads/:id/discord", async (req, res) => {
    const adId = req.params.id;
    const ad = await prisma.ad.findFirstOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })
    return res.json({
        discord: ad.discord
    })
});

app.listen(3333);