import { Card } from './card';
import { ensureElement } from '../../utils/utils';
import { ICardActions, ICardView } from '../../types';

/**
 * Строка товара в корзине.
 */
export class CardBasket extends Card<Pick<ICardView, 'index'>> {
	protected indexElement: HTMLElement;
	protected deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions: ICardActions) {
		super(container);
		this.indexElement = ensureElement('.basket__item-index', container);
		this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
		this.deleteButton.addEventListener('click', actions.onClick);
	}

	set index(value: number) {
		this.setText(this.indexElement, value);
	}
}
