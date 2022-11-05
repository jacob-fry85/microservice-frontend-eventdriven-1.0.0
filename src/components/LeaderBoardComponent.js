import * as React from 'react';
import GameApiClient from '../services/GameApiClient';
import ChallengesApiClient from '../services/ChallengesApiClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';

class LeaderBoardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leaderboard: [],
            serverError: false
        }
    }

    componentDidMount() {
        this.refreshLeaderBoard();
        // set a timer to refresh the leaderboard every 5 seconds
        setInterval(this.refreshLeaderBoard.bind(this), 15000);
    }

    getLeaderBoardData(): Promise {
        return GameApiClient.leaderBoard().then(
            lbRes => {
                if(lbRes.ok) {
                    return lbRes.json();
                } else {
                    return Promise.reject("Gamification: error response");
                }
            }
        )
    }

    getUserAliasData(userIds:number[]): Promise {
        return ChallengesApiClient.getUsers(userIds).then(
            usRes=> {
                if(usRes.ok) {
                    return usRes.json();
                } else {
                    return Promise.reject("Multiplication: error response");
                }
            }
        )
    }

    updateLeaderBoard(lb) {
        this.setState({
            leaderboard:lb,
            // reset the flag
            serverError: false
        });
    }

    refreshLeaderBoard() {
        this.getLeaderBoardData().then(lbData => {
                // console.log("lbData : ", lbData);
                let userIds = lbData.map(row => row.userId);
                // console.log("userIds : ", userIds);

                this.getUserAliasData(userIds).then(data => {
                    // build a map of id -> alias
                    let userMap = new Map();
                    // console.log("data : ", data);

                    data.forEach(idAlias => {
                        userMap.set(idAlias.id, idAlias.alias);
                        // console.log("userMap : ", userMap)
                    });

                  
                    // add a property to existing lb data
                    lbData.forEach(row => {
                        row['alias'] = userMap.get(row.userId)
                        // console.log("row{['alias'] : ", row['alias'])

                    });
                    this.updateLeaderBoard(lbData);
                }).catch(reason => {
                    console.log('Error mapping user ids', reason);
                    this.updateLeaderBoard(lbData);
                })
            }
        ).catch(reason => {
            this.setState({ serverError: true});
            console.log('Gamification server error', reason);
        })
    }

    render() {
        if(this.state.serverError) {
            return (
                <div>
                    We're sorry, but we can't display game statistics at this moment.
                </div>
            );
        }

        return(
            <div>
                <h3 className="text-center">LeaderBoard</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th className="text-center">User</th>
                            <th className="text-center">Score</th>
                            <th className="text-center">Badges</th>
                        </tr>
                    </thead>

                    <tbody>
                        { this.state.leaderboard.map(row => <tr key={row.userId}>
                            <td className="text-center">{row.alias ? row.alias : row.userId }</td>
                            <td className="text-center">{row.totalScore}</td>
                            <td className="text-center">{row.badges.map(b => <span className="badge" key={b}> {b} </span> )}</td>
                        </tr>) }
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default LeaderBoardComponent;