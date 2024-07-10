import fastify from "fastify"
import cors from '@fastify/cors'
import {createTrip} from "./routes/create-trip"
import {confirmTrip} from "./routes/confirm-trip"
import {confirmParticipant} from "./routes/confirm-participant"
import {createActivity} from "./routes/create-activity"
import {createLink} from "./routes/create-links"
import {getActivities} from "./routes/get-activities"
import {getLinks} from "./routes/list-links"
import {getParticipants} from "./routes/get-participants"
import {getParticipant} from "./routes/get-participant"
import {createInvite} from "./routes/create-invite"
import {getTrip} from "./routes/get-trip"
import {updateTrip} from "./routes/update-trip"
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import {errorHandler} from "./error-handler"
import { env } from "./env" 
const app = fastify();

const __PORT__ = env.PORT

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.listen({port: __PORT__}).then(() =>{
    console.log("Server running :)")
});
app.setErrorHandler(errorHandler)
app.register(cors,{
    origin:'*',
})
app.register(createTrip)

app.register(confirmTrip)
app.register(confirmParticipant)
app.register(createActivity)
app.register(createLink)
app.register(getActivities)
app.register(getLinks)
app.register(getParticipants)
app.register(createInvite)
app.register(getParticipant)
app.register(getTrip)
app.register(updateTrip)
