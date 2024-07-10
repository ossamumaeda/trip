import fastify from "fastify"
import cors from '@fastify/cors'
import {createTrip} from "./routes/create-trip"
import {confirmTrip} from "./routes/confirm-trip"
import {confirmParticipant} from "./routes/confirm-participant"
import {createActivity} from "./routes/create-activity"
import {getActivities} from "./routes/get-activities"
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
const app = fastify();

const __PORT__ = '3000';

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.listen({port: __PORT__}).then(() =>{
    console.log("Server running :)")
});
app.register(cors,{
    origin:'*',
})
app.register(createTrip)

app.register(confirmTrip)
app.register(confirmParticipant)
app.register(createActivity)

app.register(getActivities)