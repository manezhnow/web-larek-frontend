import { Form } from './form';
import { IEvents } from '../base/events';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { classModifiers, paymentButtons } from '../../utils/constants';
import { IOrderFormView, PaymentMethod } from '../../types';

/**
 * Первый шаг оформления: способ оплаты и адрес доставки.
 */
export class OrderForm extends Form<IOrderFormView> {
	protected paymentButtonElements: HTMLButtonElement[];
	protected addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.paymentButtonElements = ensureAllElements<HTMLButtonElement>('.order__buttons .button', container);
		this.addressInput = ensureElement<HTMLInputElement>('input[name=address]', container);

		this.paymentButtonElements.forEach((button) => {
			button.addEventListener('click', () => {
				this.emitChange('payment', paymentButtons[button.name]);
			});
		});
	}

	set payment(value: PaymentMethod | null) {
		this.paymentButtonElements.forEach((button) => {
			this.toggleClass(button, classModifiers.paymentActive, paymentButtons[button.name] === value);
		});
	}

	set address(value: string) {
		this.addressInput.value = value;
	}
}
