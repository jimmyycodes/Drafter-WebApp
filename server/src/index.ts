import express from "express";
import {createDraft, draftOptions, getOptions, getTurn} from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port = 8088;
const app = express();
app.use(bodyParser.json());
app.get("/api/getOptions", getOptions);
app.get("/api/getTurn", getTurn);
app.post("/api/createDraft", createDraft);
app.post("/api/draftOptions", draftOptions);
app.listen(port, () => console.log(`Server listening on ${port}`));
