import * as React from "react";
import ChallengesApiClient from "../services/ChallengesApiClient";
import LastAttemptComponent from "./LastAttemptComponent";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import LeaderBoardComponent from "./LeaderBoardComponent";

class ChallengeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            a:'', b: '',
            user:'',
            message:'',
            guess: 0,
            lastAttempts: [],
        };
        this.handleSubmitResult = this.handleSubmitResult.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount():void {
        ChallengesApiClient.challenge().then (
            res => {
                if(res.ok) {
                    res.json().then(json => {
                        this.setState({
                            a: json.factorA,
                            b: json.factorB,
                            slogan: json.slogan,
                        });
                    });
                } else {
                    this.updateMessage("Can't reach the server");
                }
            }
        );
    }

    handleChange(event) {
        const name = event.target.name;
        this.setState({
            [name]: event.target.value
        });
    }

    handleSubmitResult(event) {
        event.preventDefault();
        ChallengesApiClient.sendGuess(this.state.user,
            this.state.a, this.state.b,
            this.state.guess)
            .then(res => {
                if(res.ok) {
                    res.json().then(json => {
                        if(json.correct) {
                            this.updateMessage("Congratulations! Your guess is correct");
                        } else {
                            this.updateMessage("Oops! Your guess " + json.resultAttempt + " is wrong, but keep playing");
                        }
                        this.updateLastAttempts(this.state.user);
                        this.refreshChallenge();
                    });
                } else {
                    this.updateMessage("Error: server error or not available!");
                }
            })
    }

    updateMessage(m: string) {
        this.setState({
            message: m
        });
    }

    updateLastAttempts(userAlias: string) {
        ChallengesApiClient.getAttempt(userAlias).then(res => {
            if(res.ok) {
                let attempts: Attempt[] = [];
                res.json().then(data => {
                    data.forEach(item => {
                        attempts.push(item);
                    })
                    this.setState({lastAttempts:attempts});
                })
            }
        })
    }

    render() {
        return (
            <div className="display-column">
                <div>
                    <h3>Your new challenge is :</h3>
                    <div className="challenge text-center" >    
                        {this.state.a} x {this.state.b}
                    </div>
                </div>

                <Form onSubmit= {this.handleSubmitResult} className="mb-3">
                    <Form.Group>
                        <Form.Label>
                            Your alias :
                            <Form.Control type="text" maxLength="12"
                                name="user"
                                value={this.state.user}
                                onChange={this.handleChange}
                            />
                        </Form.Label>
                    </Form.Group>

                    <br/>

                    <Form.Group>
                        <Form.Label>
                            Your guess :
                            <Form.Control type="number" min="0"
                                name="guess"
                                value={this.state.guess}
                                onChange={this.handleChange}
                            />
                        </Form.Label>
                    </Form.Group>

                    <br/>
                    <div className="d-grid gap-2">
                        <Button size="lg" variant="primary" className="btn-primary" type="submit" value="Submit">Submit</Button>
                    </div>
                </Form>
                
                <h4>{this.state.message}</h4>
                {this.state.lastAttempts.length > 0 && <LastAttemptComponent lastAttempts = {this.state.lastAttempts}/>}

                <div className="display-column">
                    {/* we add this just before closing the main div */}
                    <LeaderBoardComponent />
                </div>
            </div>
        );
    }
}

export default ChallengeComponent;