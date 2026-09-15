import { CardMedia } from './cardMedia';
import { ICardActions } from '../../types';

/**
 * Карточка в каталоге на главной странице.
 */
export class CardCatalog extends CardMedia<object> {
	constructor(container: HTMLElement, actions: ICardActions) {
		super(container);
		container.addEventListener('click', actions.onClick);
	}
}
