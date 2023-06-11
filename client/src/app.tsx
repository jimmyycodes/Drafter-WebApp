import React, { ChangeEvent, Component } from "react";
import { Drafting } from "./drafting";
import "./modify.css"

//app state storing all the inputs user might type in.
interface AppState {
  drafters: string
  options: string
  username: string 
  join: string
  rounds: number
  id: number
  homeScreen: boolean
}

//App class renders the homeScreen page where users are able to construct a draft.
export class App extends Component<{}, AppState> {

  constructor(props: any) {
    super(props);
    this.state = {drafters: "", options: "", homeScreen: true, rounds: 0, id: 0, join: "", username: ""};
  }

  render = (): JSX.Element => {
    if(this.state.homeScreen){
      const drafterName = (
                      <p>
                        Drafter: 
                        <input type="text" value={this.state.username} onChange={this.usernameText}></input>
                        <b>(required for either option)</b>
                      </p>
                        );
      const drafterID = (
                      <p>
                      Draft Id: 
                      <input type="text" value={this.state.join} onChange={this.joinText}></input>
                    </p>
                      );
      const joinDraftBtn = (
                      <p><button type="button" onClick={this.joinDraft}>Join</button></p>
                      );
      const Rounds = (
                      <p>
                      Rounds: 
                      <input type="number" step="1" min="0" className="editRounds" value={this.state.rounds} onChange={this.roundsText}></input>
                    </p>
                    );
      const textArea = (
                    <p>
                    <textarea rows={15} cols={25} className="text-area" value={this.state.options} onChange={this.optionsText}></textarea>

                    <textarea rows={15} cols={25} value={this.state.drafters} onChange={this.draftersText}></textarea>
                  </p>
                  );
      const createDraftBtn = (
                  <p>
                  <button type="button" onClick={this.createDraft}
                  >Create</button>
                </p>
                );
      return (
        <div>
          {drafterName}
          <h2>Join Existing Draft</h2>
          {drafterID}
          {joinDraftBtn}
          <h2>Create New Draft</h2>
          {Rounds}
          <p>
            Options(one per line)&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;Drafters (one per line, in order)
          </p>
          {textArea}
          {createDraftBtn}
        </div>
      );
    }else{
      return <Drafting id={this.state.id} drafter={this.state.username}/>
    }
  };

  //stores the username that client will join the draft with
  usernameText = (evt: ChangeEvent<HTMLInputElement>): void =>{
    this.setState({username: evt.target.value})
  }

  //used to store the draftID
  joinText = (evt: ChangeEvent<HTMLInputElement>): void =>{
    this.setState({join: evt.target.value});
  }

  //used when user clicks the join button, sets homeScreen page to false and saves the id
  joinDraft = (): void =>{
    this.setState({homeScreen: false, id: +this.state.join});
  }
  
  //used to store how many rounds user wants
  roundsText = (evt: ChangeEvent<HTMLInputElement>): void =>{
    this.setState({rounds: +evt.target.value})
  }

  //Used to store the options user wants to pick from
  optionsText = (evt: ChangeEvent<HTMLTextAreaElement>): void =>{
    this.setState({options: evt.target.value});
  }

  //stores the current drafters that will be involved in the Draft
  draftersText = (evt: ChangeEvent<HTMLTextAreaElement>): void =>{
    this.setState({drafters: evt.target.value});
  }

  //when user presses the button create, it will send data to the server to store the new 'draft' and will handle whatever is sent back through handleDraftResponse.
  createDraft = (): void => {
    fetch("/api/createDraft", {
      method: "POST",
      body: JSON.stringify({"name": this.state.drafters, "options": this.state.options, "round": JSON.stringify(this.state.rounds), "currUser": this.state.username}),
      headers: {'Content-Type': 'application/json'}
    }).then(this.handleDraftResponse).catch(this.handleServerError);

  }

  //Handles the createDraft response, if 200, it will parse the json and store the id sent back otherwise it will alert a message on react displaying what type of error was caused.
  handleDraftResponse = (res: Response) => { 
    if(res.status === 200){
      res.json().then(this.handleDraftJson).catch(this.handleServerError);
    }else{
      res.text().then(this.handleServerJson).catch(this.handleServerError);
    }
  }

  //Handles the response from createDraft which sets the id to what was given and also changing the screen
  handleDraftJson = (val: string) => {
    this.setState({id: JSON.parse(val), homeScreen: false});
  }

  //alerts the client to whatever was sent back
  handleServerJson = (val: string) =>{
    alert(val);
  }

  //prints to console if any server error occurred 
  handleServerError = (_: Response) =>{
    console.error("unknown error talking to server");
  }


}
