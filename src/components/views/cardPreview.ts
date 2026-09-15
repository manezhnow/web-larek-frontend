import { CardMedia } from './cardMedia';
import { ensureElement } from '../../utils/utils';
import { ICardActions, ICardView } from '../../types';

/**
 * Детальная карточка товара в модальном окне.
 */
export class CardPreview extends CardMedia<Pick<ICardView, 'description' | 'inBasket'>> {
	protected descriptionElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;
	protected isPriceless = false;
	protected isInBasket = false;

	constructor(container: HTMLElement, actions: ICardActions) {
		super(container);
		this.descriptionElement = ensureElement('.card__text', container);
		this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);
		this.buttonElement.addEventListener('click', actions.onClick);
	}

	set description(value: string) {
		this.setText(this.descriptionElement, value);
	}

	set price(value: number | null) {
		super.price = value;
		this.isPriceless = value === null;
		this.updateButton();
	}

	set inBasket(value: boolean) {
		this.isInBasket = value;
		this.updateButton();
	}

	protected updateButton(): void {
		this.setDisabled(this.buttonElement, this.isPriceless);
		if (this.isPriceless) this.setText(this.buttonElement, 'Недоступно');
		else this.setText(this.buttonElement, this.isInBasket ? 'Убрать' : 'Купить');
	}
}
