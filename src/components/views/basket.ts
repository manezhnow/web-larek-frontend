import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { createElement, ensureElement, formatPrice } from '../../utils/utils';
import { settings } from '../../utils/constants';
import { AppEvent, IBasketView } from '../../types';

/**
 * Содержимое корзины: список товаров, итоговая сумма и кнопка оформления.
 */
export class Basket extends Component<IBasketView> {
	protected listElement: HTMLElement;
	protected totalElement: HTMLElement;
	protected orderButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.listElement = ensureElement('.basket__list', container);
		this.totalElement = ensureElement('.basket__price', container);
		this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);

		this.orderButton.addEventListener('click', () => {
			this.events.emit(AppEvent.OrderOpen);
		});
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this.listElement.replaceChildren(...items);
		} else {
			this.listElement.replaceChildren(
				createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' })
			);
		}
		this.setDisabled(this.orderButton, items.length === 0);
	}

	set total(value: number) {
		this.setText(this.totalElement, formatPrice(value, settings.currency, settings.pricelessLabel));
	}
}
