import React, {ChangeEvent, Component} from "react";
//draftPick stores the current drafter and who they picked
type draftPick = {
    name: string
    option: string
}

//drafting props takes in the username of the drafter that joined as well as the id of the current draft.
interface draftingProps{
    drafter: string;
    id: number;
}

//drafting state used to keep track of what is needed to be displayed
interface draftingState{
    options: string[];
    soFar: draftPick[];
    isTurn: string;
   potentialOption: string;
    valid: boolean;
}

//Drafting class prompts the user to pick a draft updating the screen and switching to different drafters accordingly. 
export class Drafting extends Component<draftingProps, draftingState>{
    constructor(props: any){
        super(props);
        this.state = {options:[], soFar: [], valid: true, potentialOption: "", isTurn: ""};
        this.draftOption();
        this.getTurn();
    }
    render =(): JSX.Element => {
        //this if statement is used to check if the current id that user joined with is valid, if not, it will prompt the user to a screen that 
        //tells them id was invalid.
        if(this.state.valid){
            let currOptions: JSX.Element[] = [];
            for(let i = 0; i < this.state.options.length; i++){
                const option = this.state.options[i];
                currOptions.push(<option key={i} value={option}>{option}</option>);
            }
            let currPicked: JSX.Element[] = [];
            for(let j = 0; j < this.state.soFar.length; j++){
                const current = this.state.soFar[j];
                currPicked.push(
                    <tr key={j}>
                    <td>{j+1}</td>
                    <td>{current.option}</td>
                    <td>{current.name}</td>
                    </tr>);
            }
            const display = this.state.soFar.length === 0 ?(
                    <p>No picks made yet</p>):
                (
                <table>
                    <thead>
                        <tr>
                            <th>Num</th>
                            <th>&ensp;Pick</th>
                            <th>&ensp;Drafter</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currPicked}
                    </tbody>
                </table>
                )
            const currSelect = (<select value={this.state.potentialOption} onChange={this.handleSelect}>
                                <option>Pick a Option</option>
                                {currOptions}
                            </select>);
            const draftButton = (<button type="button" onClick={this.handleClick}>draft</button>);
            const refreshButton = (<button type="button" onClick={this.refresh}>Refresh</button>);
            const Title = (<h2>Status of Draft "{this.props.id}"</h2>);
            
            //if current options is empty we know that the draft is complete.
            if(this.state.options.length === 0){
                return (
                    <div>
                        {Title}
                        {display}
                        <p>Draft is complete.</p>
                    </div>
                )
            //if the current turn is the drafter that joined, we will prompt them with a list of options to pick from.
            }else if(this.props.drafter === this.state.isTurn){
                return (
                    <div>
                        {Title}
                        {display}
                        <p>It's your pick!</p>
                        {currSelect}
                        {draftButton}
                    </div>
                )
            //otherwise, we know that it is not their turn yet
            }else{
                return (
                    <div>
                        {Title}
                        {display}
                        <p>Waiting for Team {this.state.isTurn} to pick</p>
                        {refreshButton}
                    </div>
                )
            }   
        }else{
            return(
            <div>
                Error: no draft with id {this.props.id}
            </div>
            );
        }
    }

    //refresh is called when user presses the refresh button, this will call to other seperate methods which are used to get who turn it is as 
    //well as the current option to draft from.
    refresh = (): void =>{
        this.getTurn();
        this.draftOption();
    }

    //getTurn sends the server a id and fetches back a record representing whose been picked so far as well as whose turn it is.
    getTurn = (): void =>{
        fetch("/api/getTurn?key=" + this.props.id).then(this.handleTurnResponse).catch(this.handleServerError);
    }

    //handleTurnResponse is used to handle the response of from the server when we fetch getTurn
    //if status is 200 we will handle the response with a separate method otherwise we display a error
    handleTurnResponse = (res: Response): void =>{
        if(res.status === 200){
            res.json().then(this.handleTurnJson).catch(this.handleServerError);
          }else{
            this.handleServerError(res);
        }
    }

    //handles the data being sent back from getTurn if status is 200. 
    handleTurnJson = (val: string): void =>{
        const updates = JSON.parse(val);
        this.setState(updates);
    }

    //handleClick is called when user clicks the draft button, it sends the name of the current drafter, the option they picked, as well as the id of the
    //current draft.
    handleClick = (): void =>{
        fetch("/api/draftOptions", {
            method: "POST", 
            body: JSON.stringify({"name": this.props.drafter, "options": this.state.potentialOption, "key": JSON.stringify(this.props.id)}),
            headers: {'Content-Type': 'application/json'}
        }).then(this.handleClickResponse).catch(this.handleServerError);
        this.draftOption();
        this.getTurn();
    }

    //handles what was sent back from the server when draftOptions was called
    //if status was 200, we use a seperate method to handle what was sent back
    //otherwise we display the error that was sent
    handleClickResponse = (res: Response): void =>{
        if(res.status === 200){
            res.json().then(this.handleClickJson).catch(this.handleServerError);
          }else{
            res.text().then(this.handleServerJSON).catch(this.handleServerError);
        }
    }

    //handleClickJson takes a draftPick array as a parameter which represents whose been picked so far and updates the state of class.
    handleClickJson = (val: draftPick[]): void =>{
        this.setState({soFar: val})
    }

    //handleSelect updates what option was selected 
    handleSelect = (evt: ChangeEvent<HTMLSelectElement>): void =>{
       this.setState({potentialOption: evt.target.value})
    }

    //draftOption is used to get the current options that is left so far given the id of the draft
    draftOption = (): void =>{
        fetch("/api/getOptions?key=" + this.props.id).then(this.handleOption).catch(this.handleServerError);
    }

    //handleOption is used to handle whatever was sent back from the server when getOptions was called
    handleOption = (res: Response): void =>{
        if(res.status === 200){
            res.json().then(this.handleOptionsJson).catch(this.handleServerError);
          }else{
            this.handleServerError(res);
          }
    }

    //handleOptionsJson recieves back the current options as a string which it will parse to update our list of options within our state.
    handleOptionsJson = (val: string): void =>{
        this.setState({options: JSON.parse(val)});
    }

    //used to alert the user any potential errors that may have occurred when user presses draft
    handleServerJSON = (val: string) =>{
        alert(val);
    }

    //handles when there are potential errors when communicating with the server.
    handleServerError = (_: Response) =>{
        this.setState({valid: false})
        console.error("unknown error talking to server");
    }
}
