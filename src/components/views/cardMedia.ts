import { Card } from './card';
import { ensureElement } from '../../utils/utils';
import { categoryModifiers } from '../../utils/constants';
import { ICardView, ProductCategory } from '../../types';

/** Данные карточки с изображением */
export type CardMediaView = Pick<ICardView, 'category' | 'image'>;

/**
 * Карточка с категорией и изображением (общая часть каталога и превью).
 */
export abstract class CardMedia<T> extends Card<CardMediaView & T> {
	protected categoryElement: HTMLElement;
	protected imageElement: HTMLImageElement;

	protected constructor(container: HTMLElement) {
		super(container);
		this.categoryElement = ensureElement('.card__category', container);
		this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
	}

	set title(value: string) {
		super.title = value;
		this.imageElement.alt = value;
	}

	set category(value: ProductCategory) {
		this.setText(this.categoryElement, value);
		Object.entries(categoryModifiers).forEach(([name, modifier]) => {
			this.toggleClass(this.categoryElement, `card__category_${modifier}`, name === value);
		});
	}

	set image(value: string) {
		this.setImage(this.imageElement, value);
	}
}
