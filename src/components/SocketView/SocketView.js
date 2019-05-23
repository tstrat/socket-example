import React, { Component } from 'react';
import io from 'socket.io-client';
import './socketview.css';
const socket = io.connect('http://localhost:4000');

export default class SocketView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            connected: false,
            messages: [],
            users: [],
            name: '',
            newMessage: ''
        };

        this.sendMessage = this.sendMessage.bind(this);
        // Listeners for the socket

        // listen for this login event from the server
        socket.on('login', data => {
            console.log('Login event: ', data);

            this.addChatMessage(data.message);
            this.setState({
                connected: true,
                users: data.users
            });
        });

        socket.on('new message', data => {
            this.addChatMessage(data);
        });

        socket.on('user joined', updatedUsers => {
            this.setState({
                users: updatedUsers
            });
        });

        socket.on('user left', users => {
            this.setState({ users });
        });
    }

    addChatMessage(message) {
        this.setState({
            messages: [...this.state.messages, message]
        });
    }

    connect(username) {
        if (username) {
            // send a 'join' event to the server with your username
            socket.emit('join', username);
        }
    }

    /* Sending a new message to the socket server */
    sendMessage() {
        // This emit needs to match on the server side
        socket.emit('new message', {
            username: this.state.name,
            message: this.state.newMessage
        });
        this.setState({
            newMessage: ''
        });
    }

    render() {
        const { connected, messages, users, name, newMessage } = this.state;

        const allMessages = messages.map((message, index) => {
            return (
                <div key={index} className='message'>
                    <h3>{message.username}</h3>
                    <p>{message.message}</p>
                </div>
            );
        });

        const allUsers = users.map((user, index) => (
            <div key={index} className='user'>
                {user.name}
            </div>
        ));
        return (
            <div>
                <h1>Socket Connected:</h1>
                <h3>{'' + connected}</h3>
                {!connected ? (
                    <>
                        <input
                            value={name}
                            onChange={e =>
                                this.setState({ name: e.target.value })
                            }
                        />
                        <button onClick={() => this.connect(name)}>
                            Connect
                        </button>
                    </>
                ) : (
                    <></>
                )}

                {!connected ? null : (
                    <>
                        <input
                            value={newMessage}
                            onChange={e =>
                                this.setState({ newMessage: e.target.value })
                            }
                        />
                        <button onClick={this.sendMessage}>Send</button>
                        <div className='socket-view-chat'>
                            <div className='messages'>{allMessages}</div>
                            <div className='users'>{allUsers}</div>
                        </div>
                    </>
                )}
            </div>
        );
    }
}
