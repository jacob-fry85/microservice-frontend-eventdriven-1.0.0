import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';

class LastAttemptComponent extends React.Component {
    render() {
        return (
            <Table borderd hover responsive="sm">
                <thead>
                    <tr className='text-center'>
                        <th>Challenge</th>
                        <th>Your Guess</th>
                        <th>Correct</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.lastAttempts.map(a =>
                        <tr key={ a.id }
                            style={{ color: a.correct ? 'green' : 'red'}}
                            className='text-center'> 
                            <td>{a.factorA} x {a.factorB}</td>
                            <td>{a.resultAttempt}</td>
                            <td>{a.correct ? "Correct" : 
                                ("Incorrect (" + a.factorA * a.factorB + ")")}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        );
    }
}


export default LastAttemptComponent;