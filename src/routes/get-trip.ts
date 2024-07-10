import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from 'zod'
import { prisma } from "../lib/prisma";
export async function getTrip(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().get(
        '/trip/:tripId', {

        schema: {

            params: z.object({

                tripId: z.string().uuid(),

            })

        },

    }, async (request, reply) => {
        const { tripId } = request.params

        const trip = await prisma.trip.findUnique({ // Search for participants --  SELECT * FROM participantS WHERE ID=idParticipant
            where: {
                id: tripId,
            },
            include:{
                participant:true,
                activities: true,
                links:true
            }
        })

        if (!trip) {
            throw new Error('trip not found')
        }


        return { trip }

    })

}
