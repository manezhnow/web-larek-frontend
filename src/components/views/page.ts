import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { classModifiers } from '../../utils/constants';
import { AppEvent, IPageView } from '../../types';

/**
 * Главная страница: каталог, счётчик корзины и блокировка прокрутки.
 */
export class Page extends Component<IPageView> {
	protected counterElement: HTMLElement;
	protected catalogElement: HTMLElement;
	protected wrapperElement: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.counterElement = ensureElement('.header__basket-counter', container);
		this.catalogElement = ensureElement('.gallery', container);
		this.wrapperElement = ensureElement('.page__wrapper', container);
		this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);

		this.basketButton.addEventListener('click', () => {
			this.events.emit(AppEvent.BasketOpen);
		});
	}

	set counter(value: number) {
		this.setText(this.counterElement, value);
	}

	set catalog(items: HTMLElement[]) {
		this.catalogElement.replaceChildren(...items);
	}

	set locked(value: boolean) {
		this.toggleClass(this.wrapperElement, classModifiers.pageLocked, value);
	}
}
