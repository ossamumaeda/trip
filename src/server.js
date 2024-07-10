import fastify from "fastify"
import cors from '@fastify/cors'
import {createTrip} from "./routes/create-trip"
import {confirmTrip} from "./routes/confirm-trip"
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