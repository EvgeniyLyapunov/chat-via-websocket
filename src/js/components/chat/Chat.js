import moment from 'moment';

import ChatAPI from '../../api/ChatAPI';
import Modal from '../modal/modal';
import MessageItem from '../message-item/MessageItem';

import './chat.css';

export default class Chat {
	constructor(container) {
		this.container = container;
		this.api = new ChatAPI();
		this.modal = new Modal(this);

		this.chatBoard = null;
		this.onlineListElement = null;
		this.chatMessageListElement = null;
		this.chatForm = null;

		this.websocket = null;
		this.isConnect = false;

		this.user = null;
		this.onlineUsers = [];

		this.bindToDOM = this.bindToDOM.bind(this);
		this.onEnterChatHandler = this.onEnterChatHandler.bind(this);
		this.receivingMessage = this.receivingMessage.bind(this);
		this.renderUsers = this.renderUsers.bind(this);
		this.renderMessage = this.renderMessage.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.onExit = this.onExit.bind(this);
	}

	init() {
		this.modal.init();
		this.bindToDOM();
	}

	bindToDOM() {
		this.chatBoard = document.createElement('div');
		this.chatBoard.classList.add('chat');
		this.chatBoard.innerHTML = `
			<div class="chat__online">
        <span class="chat__online-label">Сейчас online:</span>
      </div>
      <div class="chat__board">
        <ul class="chat__board-list"></ul>
        <form class="chat__board-form">
          <textarea class="chat__board-form-textarea" type="text" name="message"></textarea>
          <button class="chat__board-form-button" type="submit">Отправить</button>
        </form>
      </div>
		`;
		this.container.insertAdjacentElement('beforeEnd', this.chatBoard);
		this.chatMessageListElement = this.chatBoard.querySelector('.chat__board-list');

		this.chatForm = this.chatBoard.querySelector('.chat__board-form');
		this.chatForm.addEventListener('submit', this.sendMessage);
		window.addEventListener('unload', this.onExit);
	}

	async onEnterChatHandler(data) {
		const res = await this.api.postNewUser(data);

		if (res.status === 'error') {
			this.modal.onNameIsFail();
			return;
		}

		this.user = res.user;

		this.modal.onClose();

		this.websocket = new WebSocket('wss:chat-backend-a4d4.onrender.com/localhost:10000');

		this.websocket.addEventListener('message', this.receivingMessage);
	}

	receivingMessage(event) {
		const message = JSON.parse(event.data);

		if (!message.type) {
			this.onlineUsers = message;
			this.renderUsers();
			return;
		}

		this.renderMessage(message);
	}

	sendMessage(e) {
		e.preventDefault();

		const formData = new FormData(this.chatForm);
		const msg = Object.fromEntries(formData.entries());
		msg.time = moment().format('HH:mm  DD-MM-YY');
		msg.type = 'send';
		msg.name = this.user.name;

		this.websocket.send(JSON.stringify(msg));

		this.chatForm.querySelector('textarea').value = '';
	}

	renderMessage(msg) {
		let li;
		if (msg.name === this.user.name) {
			li = new MessageItem(msg).getMessageElement(true);
		} else {
			li = new MessageItem(msg).getMessageElement();
		}
		this.chatMessageListElement.insertAdjacentElement('beforeend', li);
	}

	renderUsers() {
		if (this.onlineListElement) {
			this.onlineListElement.remove();
			this.onlineListElement = null;
		}
		const ul = document.createElement('ul');
		ul.classList.add('chat__online-list');

		this.onlineUsers.forEach((user) => {
			const li = document.createElement('li');
			if (user.name === this.user.name) {
				li.classList.add('chat__online-name', 'chat__online-name_you');
				li.textContent = user.name;
				ul.insertAdjacentElement('afterbegin', li);
			} else {
				li.classList.add('chat__online-name');
				li.textContent = user.name;
				ul.insertAdjacentElement('beforeend', li);
			}
		});

		this.chatBoard.querySelector('.chat__online').insertAdjacentElement('beforeend', ul);
		this.onlineListElement = ul;
	}

	onExit() {
		const msg = {
			type: 'exit',
			user: this.user,
		};

		this.websocket.send(JSON.stringify(msg));
		this.websocket.close();
	}
}
