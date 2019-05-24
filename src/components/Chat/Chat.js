import React, { Component } from 'react';
import io from 'socket.io-client';

// connect to server
const socket = io.connect('http://localhost:4000');

class Chat extends Component {
    constructor(props) {
        super(props);

        // state
        this.state = {
            message: '',
            chatMessages: []
        };

        // listen for 'newbie joined' event and log when a new person joins
        socket.on('newbie joined', messageFromServer => {
            console.log(messageFromServer);
        });

        // listen for message from server
        socket.on('new message from sever', message => {
            console.log('new message', message);
            this.setState({
                chatMessages: [...this.state.chatMessages, message]
            });
        });

        this.sendMessage = this.sendMessage.bind(this);
    }

    joinRoom() {
        // send a request to the server to join the room
        socket.emit('needy', 1234);
    }

    sendMessage() {
        socket.emit('message to server', {
            room: 1234,
            message: this.state.message
        });
    }

    render() {
        return (
            <div className='chat'>
                <button onClick={this.joinRoom}>Join the Room</button>
                <input
                    value={this.state.message}
                    onChange={e => this.setState({ message: e.target.value })}
                />
                <button onClick={this.sendMessage}>Send</button>

                {this.state.chatMessages.map(message => (
                    <div>{message}</div>
                ))}
            </div>
        );
    }
}

export default Chat;
