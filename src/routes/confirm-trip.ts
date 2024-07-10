import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from 'zod'
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getEmailClient } from "../lib/mail";
import nodemailer from 'nodemailer';
export async function confirmTrip(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().get(
        '/trips/:tripId/confirm', {

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
        if (trip.is_confirmed) {
            // throw new Error('Trip is already confirmed!');
            return reply.redirect(`http://localhost:3000/trips/${tripId}`) // Front end link
        }

        //Update trip confirmation
        await prisma.trip.update({
            where: { id: tripId, },
            data: { is_confirmed: true }
        })

        //Send email routine
        const formatedStartDate = dayjs(trip.starts_at).format('LL');
        const formatedEndDate = dayjs(trip.ends_at).format('LL');
        const mail = await getEmailClient();
        const participants = trip.participant;

        Promise.all(
            participants.map(async (participant) => {
                const confirmationLink = `http://localhost:3000/participants/${participant.id}/confirm`;

                const message = await mail.sendMail({
                    from: {
                        name: 'Equipe plann.er',
                        address: 'oi@plann.er',
                    },
                    to: participant.email,
                    subject: `Confirme sua presença na viagem para ${trip.destination} em ${formatedStartDate}`,
                    html: `
                    <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                      <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formatedEndDate}</strong> até <strong>${formatedEndDate}</strong>.</p>
                      <p></p>
                      <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
                      <p></p>
                      <p>
                        <a href="${confirmationLink}">Confirmar viagem</a>
                      </p>
                      <p></p>
                      <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
                    </div>
                  `.trim(),
                })
                console.log(nodemailer.getTestMessageUrl(message))
            })
        )


        return reply.redirect(`http://localhost:3000/trips/${tripId}`)

    })

}
