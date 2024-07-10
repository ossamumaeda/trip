import { FastifyInstance } from "fastify"
import { ClientError } from "./errors/client-error"
import { ZodError } from "zod"
type fastifyErrorHandling = FastifyInstance['errorHandler']
export const errorHandler: fastifyErrorHandling = (error, request, reply) => {

    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: `Invalid input`,
            errors:error.flatten().fieldErrors
        })
    }

    if (error instanceof ClientError) { // Error 400 - 
        return reply.status(400).send({
            message: error.message
        })
    }

    return reply.status(500).send({ message: 'Internal Server Error' })
}