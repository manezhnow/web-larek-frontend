import { Component } from '../base/component';
import { ensureElement, formatPrice } from '../../utils/utils';
import { settings } from '../../utils/constants';
import { ICardView } from '../../types';

/** Данные, общие для всех карточек */
export type CardBaseView = Pick<ICardView, 'id' | 'title' | 'price'>;

/**
 * Базовая карточка товара: название и цена.
 */
export abstract class Card<T> extends Component<CardBaseView & T> {
	protected titleElement: HTMLElement;
	protected priceElement: HTMLElement;

	protected constructor(container: HTMLElement) {
		super(container);
		this.titleElement = ensureElement('.card__title', container);
		this.priceElement = ensureElement('.card__price', container);
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id ?? '';
	}

	set title(value: string) {
		this.setText(this.titleElement, value);
	}

	set price(value: number | null) {
		this.setText(this.priceElement, formatPrice(value, settings.currency, settings.pricelessLabel));
	}
}
