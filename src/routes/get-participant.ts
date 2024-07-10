import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from 'zod'
import { prisma } from "../lib/prisma";
export async function getParticipant(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().get(
        '/participant/:idParticipant', {

        schema: {

            params: z.object({

                idParticipant: z.string().uuid(),

            })

        },

    }, async (request, reply) => {
        const { idParticipant } = request.params

        const participant = await prisma.participant.findUnique({ // Search for participants --  SELECT * FROM participantS WHERE ID=idParticipant
            where: {
                id: idParticipant,
            },
            select:{
                id:true,
                email:true,
                is_confirmed:true,
                name:true,

            }
        })

        if (!participant) {
            throw new Error('participant not found')
        }


        return { participant }

    })

}
