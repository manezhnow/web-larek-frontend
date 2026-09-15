import { Component } from '../base/component';
import { ensureElement, formatPrice } from '../../utils/utils';
import { settings } from '../../utils/constants';
import { ISuccessActions, ISuccessView } from '../../types';

/**
 * Сообщение об успешном оформлении заказа.
 */
export class Success extends Component<ISuccessView> {
	protected descriptionElement: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this.descriptionElement = ensureElement('.order-success__description', container);
		this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
		this.closeButton.addEventListener('click', actions.onClick);
	}

	set total(value: number) {
		this.setText(
			this.descriptionElement,
			`Списано ${formatPrice(value, settings.currency, settings.pricelessLabel)}`
		);
	}
}
