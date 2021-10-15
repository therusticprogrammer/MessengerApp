import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import "./App.css"

function App() {
	const [ state, setState ] = useState({ message: "", name: "" })
	const [ chat, setChat ] = useState([])

	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:3002")
			socketRef.current.on("message", ({ name, message }) => {
				setChat([ ...chat, { name, message } ])
			})
			return () => socketRef.current.disconnect()
		},
		[ chat ]
	)

	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

	const onSubmitMessage = (e) => {
		const { name, message } = state
		socketRef.current.emit("message", { name, message })
		e.preventDefault()
		setState({ message: "", name })
	}

	const displayChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3>
					{name}: <span>{message}</span>
				</h3>
			</div>
		))
	}

	return (
		<div className="placard">
			<form onSubmit={onSubmitMessage}>
				<h1>Chat</h1>
				<div className="chat-field">
					<TextField name="name" onChange={(e) => onTextChange(e)} value={state.name} label="Name" />
				</div>
				<div className="log-field">
					<TextField
						name="message"
						onChange={(e) => onTextChange(e)}
						value={state.message}
						
						label="Message"
					/>
				</div>
				<button>Send Chat</button>
			</form>
			<div className="display-chat">
				<h1>Messages Log</h1>
				{displayChat()}
			</div>
		</div>
	)
}

export default App

