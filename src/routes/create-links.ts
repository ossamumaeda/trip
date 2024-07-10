import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod"
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";

export async function createLink(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/trip/:tripId/link', {
        schema: {
            params: z.object({
                tripId: z.string().uuid(),
            }),
            body: z.object({
                title: z.string().min(3),
                url: z.string().url()

            })
        }
    }, async (request) => {

        const { url, title } = request.body
        const { tripId } = request.params
        //Find trip
        const trip = await prisma.trip.findUnique({ // Search for trips --  SELECT * FROM TRIPS WHERE ID=tripId
            where: {
                id: tripId,
            },
            include: { // JOIN clause -- JOIN PARTICIPANT ON .. WHERE IS_OWNER=false
                participant: {
                    where: {
                        is_owner: false
                    }
                }
            }
        })
        // Validations
        if (!trip) {
            throw new Error('Trip not found :(');
        }

        const link = await prisma.link.create({
            data: {
                url: url,
                trip_id: tripId,
                title: title
            }
        })

        return { link: link.id }
    })
}