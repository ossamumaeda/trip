import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { array, z } from 'zod'
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getEmailClient } from "../lib/mail";
import nodemailer from 'nodemailer';
export async function getLinks(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().get(
        '/trips/:tripId/links', {

        schema: {

            params: z.object({

                tripId: z.string().uuid(),

            })

        },

    }, async (request, reply) => {
        const { tripId } = request.params

        const trip = await prisma.trip.findUnique({ // Search for trips --  SELECT * FROM TRIPS WHERE ID=tripId
            where: {
                id: tripId,
            },
            include: { // JOIN clause -- JOIN PARTICIPANT ON .. WHERE IS_OWNER=false
                links: true
            }
        })

        if (!trip) {
            throw new Error('Trip not')
        }


        return {links: trip.links}

    })

}
