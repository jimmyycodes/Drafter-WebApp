import { Request, Response } from "express";
//Constructs a type Draft which will be used as the values of the map
type Draft = {
  drafters: string[], 
  options: string[],
  soFar: draftPick[],
  rounds: number
};
//Constructs another type called draftPick which is used to keep track of which drafter picked which option
type draftPick = {
  name: string
  option: string
};
//Constructs a map where the id is the detail to the draft
let Drafts: Map<string, Draft> = new Map();

//post method
/**
 * Create Draft parses client sent data and saves their draft within the map with a unique key. 
 * @param req takes in 4 arguments:
 *            - Drafters(string but will be parsed into a array)
 *            - Options which represents all the current options they can draft from
 *            - Current user which will be who joins the draft
 *            - Rounds which represents how many rounds they can go for.
 * @param res is used to either send back error status or information if data is valid.
 * @returns a json that will represent the 'id' of that specific draft
 */
export function createDraft(req: Request, res: Response){
  const name = req.body.name;
  const options = req.body.options;
  const currUser = req.body.currUser;
  const round = req.body.round;

  if(currUser === undefined || typeof currUser !== 'string'){
    res.status(400).send('missing username');
    return;
  }
  if(options === undefined || typeof options !== 'string'){
    res.status(400).send('missing options parameter');
    return;
  }
  if(name === undefined || typeof name !== 'string'){
    res.status(400).send('missing drafter parameter');
    return;
  }
  if(round === undefined || typeof round !== 'string'){
    res.status(400).send('missing round parameter');
    return;
  }
  if(currUser === ""){
    res.status(400).send('Missing user please include.');
    return;
  }
  if(name === ""){
    res.status(400).send('Missing drafters please include.');
    return;
  }
  if(options === ""){
    res.status(400).send('Missing options please include.');
    return;
  }
  if(round === "0"){
    res.status(400).send('no rounds included.');
    return;
  }

  //parses the string into a array
  const draftConv =  name.split('\n');
  const newDraftConv = draftConv.filter((item) => item);
  for(let i = 0; i < newDraftConv.length; i++){
    newDraftConv[i] = newDraftConv[i].trim();
  }
  const optionsConv = options.split('\n');
  const newOptionsConv = optionsConv.filter((item) => item);
  for(let i = 0; i < newOptionsConv.length; i++){
    newOptionsConv[i] = newOptionsConv[i].trim();
  }

  if(newDraftConv.length > newOptionsConv.length){
    res.status(400).send("Size of drafters cannot be larger than current options.");
    return;
  }
  const roundConv = JSON.parse(round) * newDraftConv.length;
  
  const draft: Draft = {
    drafters: newDraftConv,
    options: newOptionsConv,
    soFar: [],
    rounds: roundConv
  }
  Drafts.set((Drafts.size + 1).toString(), draft);
  res.json(JSON.stringify(Drafts.size));
}

//post method
/**
 * draftOptions removes the specific option a drafter wants to 'draft' and updates the rounds as well as updating whose picked so far.
 * @param req takes in 3 arguments:
 *            - Name, this will be a single string which represents the drafter that is picking
 *            - options, this will be a single string which represents the option the drafter is picking
 *            - key, this will be the id to the map to access current data on the draft.
 * @param res is used to either send back error status or information if data is valid.
 * @returns returns back a Draft array of whose been picked soFar so the client can display it.
 */
export function draftOptions(req: Request, res: Response){
  //passes in a string
  const name = req.body.name;
  const options = req.body.options;
  const key = req.body.key;

  //checks if options is of right type
  if(options === undefined || typeof options !== 'string'){
    res.status(400).send('missing options parameter');
    return;
  }
  //checks if drafter is of right type
  if(name === undefined || typeof name !== 'string'){
    res.status(400).send('missing drafter parameter');
    return;
  }
  //checks if key is of right type
  if(key === undefined || typeof key !== 'string'){
    res.status(400).send('missing key parameter');
    return;
  }

  const currDraft = Drafts.get(key);
  //checks if draft is found with given id
  if(currDraft === undefined){
    res.status(400).send('no Draft for an id called $' + JSON.stringify(key));
    return;
  }
  //checks if options is found in the array
  if(!currDraft.options.includes(options)){
    res.status(400).send('no options found for a name of ' + JSON.stringify(options));
    return;
  }
  //checks if current drafter is valid
  if(!currDraft.drafters.includes(name)){
    res.status(400).send('no options found for a name of ' + JSON.stringify(options));
    return;
  }

  //removes options from array
  const index = currDraft.options.indexOf(options, 0);
  currDraft.options.splice(index, 1);

  //decrement the amount of rounds
  currDraft.rounds--;

  //If there are no more rounds we set options to empty
  if(currDraft.rounds === 0){
    currDraft.options.length = 0;
  }

  const draftPicker: draftPick = {
    name: name,
    option: options
  }
  //we remove whose picked right now and pushes it back to the back of the array
  const picked = currDraft.drafters.shift();
  if(picked === undefined){
    res.status(400).send('current drafters is empty');
    return;
  }
  currDraft.drafters.push(picked);

  //Updates whose been picked so far and sends back data on that
  currDraft.soFar.push(draftPicker);
  res.json(currDraft.soFar);
}

//get method
/**
 * getOptions returns the current options that client can pick from given a specific Draft
 * @param req takes in one argument:
 *            - Key: this represents the id needed to access the specific map
 * @param res is used to either send back error status or information if data is valid.
 * @returns the options so far but as a string
 */
export function getOptions(req: Request, res: Response){
  const key = req.query.key;
  //checks if key is of right type
  if(key === undefined || typeof key !== 'string'){
    res.status(400).send('missing key parameter');
    return;
  }

  const currDraft = Drafts.get(key);
  //checks if draft is found with given id
  if(currDraft === undefined){
    res.status(400).send('no Draft for an id called ${key}');
    return;
  }
  res.json(JSON.stringify(currDraft.options));
}

//get method
/**
 * getTurn takes in a id request and returns back a record representing who has been picked so far as well as whose turn it is now.
 * @param req takes in one argument:
 *            - Key: this represents the id needed to access the specific map
 * @param res is used to either send back error status or information if data is valid.
 * @returns a record that represents whose picked so far as well as whose turn it is.
 */
export function getTurn(req: Request, res: Response){
  const key = req.query.key;
  if(key === undefined || typeof key !== 'string'){
    res.status(400).send('missing key parameter');
    return;
  }
  const currDraft = Drafts.get(key);
  //checks if draft is found with given id
  if(currDraft === undefined){
    res.status(400).send('no Draft for an id called ${key}');
    return;
  }
  res.json(JSON.stringify({soFar: currDraft.soFar, isTurn: currDraft.drafters[0]}));
}

//reset is used for testing the server.
export function reset(){
  Drafts.clear();
}
