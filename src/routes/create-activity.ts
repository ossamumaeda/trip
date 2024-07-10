import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod"
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";

export async function createActivity(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/trip/:tripId/activities', {
        schema: {
            params: z.object({
                tripId: z.string().uuid(),
            }),
            body: z.object({
                title: z.string().min(3),
                occours_at: z.coerce.date()

            })
        }
    }, async (request) => {

        const { occours_at, title } = request.body
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
        if (dayjs(occours_at).isBefore(trip.starts_at)) {
            throw new Error('Invalid date')
        }
        if (dayjs(occours_at).isAfter(trip.ends_at)) {
            throw new Error('Invalid date')
        }

        const activity = await prisma.activity.create({
            data: {
                occurs_at: occours_at,
                trip_id: tripId,
                title: title
            }
        })

        return { activityId: activity.id }
    })
}