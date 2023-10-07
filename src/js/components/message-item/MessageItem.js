import './message-item.css';

class MessageItem {
  constructor(message) {
    this.message = message;
  }

  getMessageElement(position = false) {
    const li = document.createElement('li');

    if (position) {
      li.classList.add('msg-el', 'msg-el_pos');
      li.innerHTML = `
        <div class="msg-el__info-box msg-el__info-box_pos">
          <span class="msg-el__info-name msg-el__info-name_pos">you</span>
          <span class="msg-el__info-date">${this.message.time}</span>
        </div>
        <span class="msg-el__text msg-el__text_pos">${this.message.message}</span>
      `;

      return li;
    }

    li.classList.add('msg-el');
    li.innerHTML = `
			<div class="msg-el__info-box">
				<span class="msg-el__info-name">${this.message.name}</span>
				<span class="msg-el__info-date">${this.message.time}</span>
			</div>
			<span class="msg-el__text">${this.message.message}</span>
		`;

    return li;
  }
}

export default MessageItem;
