import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { classModifiers, keyNames } from '../../utils/constants';
import { AppEvent, IModalView } from '../../types';

/**
 * Модальное окно. Отображает переданное содержимое,
 * закрывается по крестику, клику по оверлею и клавише Escape.
 */
export class Modal extends Component<IModalView> {
	protected closeButton: HTMLButtonElement;
	protected contentElement: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
		this.contentElement = ensureElement('.modal__content', container);

		this.closeButton.addEventListener('click', () => this.close());
		this.container.addEventListener('mousedown', (event) => {
			if (event.target === this.container) this.close();
		});
		this.handleEscape = this.handleEscape.bind(this);
	}

	set content(value: HTMLElement) {
		this.contentElement.replaceChildren(value);
	}

	open(content?: HTMLElement): void {
		if (content) this.content = content;
		if (this.isOpen()) return;
		this.toggleClass(this.container, classModifiers.modalActive, true);
		document.addEventListener('keydown', this.handleEscape);
		this.events.emit(AppEvent.ModalOpen);
	}

	close(): void {
		if (!this.isOpen()) return;
		this.toggleClass(this.container, classModifiers.modalActive, false);
		document.removeEventListener('keydown', this.handleEscape);
		this.contentElement.replaceChildren();
		this.events.emit(AppEvent.ModalClose);
	}

	isOpen(): boolean {
		return this.container.classList.contains(classModifiers.modalActive);
	}

	protected handleEscape(event: KeyboardEvent): void {
		if (event.key === keyNames.escape) this.close();
	}
}
