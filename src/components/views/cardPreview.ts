import { CardMedia } from './cardMedia';
import { ensureElement } from '../../utils/utils';
import { ICardActions, ICardView } from '../../types';

/**
 * Детальная карточка товара в модальном окне.
 */
export class CardPreview extends CardMedia<Pick<ICardView, 'description' | 'button' | 'buttonDisabled'>> {
	protected descriptionElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, actions: ICardActions) {
		super(container);
		this.descriptionElement = ensureElement('.card__text', container);
		this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);
		this.buttonElement.addEventListener('click', actions.onClick);
	}

	set description(value: string) {
		this.setText(this.descriptionElement, value);
	}

	set button(value: string) {
		this.setText(this.buttonElement, value);
	}

	set buttonDisabled(value: boolean) {
		this.setDisabled(this.buttonElement, value);
	}
}
