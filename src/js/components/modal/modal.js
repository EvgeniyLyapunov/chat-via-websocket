import './modal.css';

class Modal {
  constructor(context) {
    this.context = context;
    this.modal = null;
    this.btn = null;

    this.bindToDOM = this.bindToDOM.bind(this);
    this.onSetUserName = this.onSetUserName.bind(this);
    this.onNameIsFail = this.onNameIsFail.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  init() {
    this.bindToDOM();
    this.onSetUserName();
  }

  bindToDOM() {
    this.modal = document.createElement('modal');
    this.modal.classList.add('modal');
    this.context.container.insertAdjacentElement('afterBegin', this.modal);
  }

  /**
	 * метод выводит в модальное окно форму для ввода и отправки ника для фхода в чат
	 */
  onSetUserName() {
    if (this.btn) {
      this.btn.removeEventListener('click', this.onSetUserName);
      this.btn = null;
    }

    this.modal.innerHTML = `
			<form class="enter-form">
				<label class="enter-form__label-box">
					<span class="enter-form__label">Выберите псевдоним</span>
					<input class="enter-form__input" type="text" name="name">
				</label>
				<button class="enter-form__btn" type="submit">Продолжить</button>
			</form>
		`;

    this.form = this.modal.querySelector('.enter-form');
    this.form.addEventListener('submit', this.onSubmit);
  }

  /**
	 * метод отсылает введённые данные на сервер
	 * @param e объект события submit
	 */
  onSubmit(e) {
    e.preventDefault();

    const userInput = new FormData(this.form);
    const data = Object.fromEntries(userInput.entries());
    data.name = data.name.trim();

    if (data.name === '') {
      return;
    }

    this.context.onEnterChatHandler(data);
  }

  /**
	 * метод выводит в модальное окно сообщение "имя уже существует" и кнопку "повторить"
	 */
  onNameIsFail() {
    this.form.removeEventListener('submit', this.onSubmit);
    const width = this.form.offsetWidth;
    const height = this.form.offsetHeight;

    this.modal.innerHTML = `
			<div class="failed-name__modal" style="width: ${width}px; height: ${height}px">
				<span class="failed-name__info">Такой ник уже онлайн!</span>
        <span class="failed-name__info">Попробуйте ещё раз</span>
				<button class="failed-name__btn">Продолжить</button>
			</div>
		`;

    this.btn = this.modal.querySelector('.failed-name__btn');
    this.btn.addEventListener('click', this.onSetUserName);
  }

  /**
	 * метод удаляет модальное окно
	 */
  onClose() {
    this.modal.remove();
    this.modal = null;
  }
}

export default Modal;
