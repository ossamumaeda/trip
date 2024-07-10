import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from 'zod'
import { prisma } from "../lib/prisma";
export async function updateTrip(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().put(
        '/trip/:tripId', {

        schema: {

            params: z.object({

                tripId: z.string().uuid(),

            }),
            body: z.object({
                destination: z.string(),
                starts_at: z.coerce.date(),
                ends_at: z.coerce.date(),
            })

        },

    }, async (request, reply) => {
        const { tripId } = request.params
        const { destination, ends_at, starts_at } = request.body
        const trip = await prisma.trip.findUnique({ // Search for participants --  SELECT * FROM participantS WHERE ID=idParticipant
            where: {
                id: tripId,
            }
        })

        if (!trip) {
            throw new Error('trip not found')
        }

        await prisma.trip.update({
            where:{
                id:tripId
            },
            data:{
                destination,
                ends_at,
                starts_at,
            }
        })
        
        const tripUpdated = await prisma.trip.findUnique({ // Search for participants --  SELECT * FROM participantS WHERE ID=idParticipant
            where: {
                id: tripId,
            }
        })

        return { tripUpdated }

    })

}
