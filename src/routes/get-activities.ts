import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { array, z } from 'zod'
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getEmailClient } from "../lib/mail";
import nodemailer from 'nodemailer';
export async function getActivities(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().get(
        '/trips/:tripId/activities', {

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
                activities: {
                    orderBy:{
                        occurs_at:"asc"
                    }
                }
            }
        })

        if (!trip) {
            throw new Error('Trip not')
        }

        const diffActivitiesDates = dayjs(trip.ends_at).diff(trip.starts_at, 'days');

        const activities = Array.from({ length: diffActivitiesDates + 1 }).map((_, i) => {
            const date = dayjs(trip.starts_at).add(i, 'days')
            return {
                date: date.toDate(),
                activities: trip.activities.filter((a) => {
                    return dayjs(a.occurs_at).isSame(date,'day')
                })
            }
        })

        return activities

    })

}
