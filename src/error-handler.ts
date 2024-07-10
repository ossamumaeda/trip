import { FastifyInstance } from "fastify"

type fastifyErrorHandling = FastifyInstance['errorHandler']
export const errorHandler : fastifyErrorHandling = (error, request, reply) =>{
    return reply.status(500).send({message: 'Internal Server Error'})
}