import { Form } from './form';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IContactsFormView } from '../../types';

/**
 * Второй шаг оформления: email и телефон.
 */
export class ContactsForm extends Form<IContactsFormView> {
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.emailInput = ensureElement<HTMLInputElement>('input[name=email]', container);
		this.phoneInput = ensureElement<HTMLInputElement>('input[name=phone]', container);
	}

	set email(value: string) {
		this.emailInput.value = value;
	}

	set phone(value: string) {
		this.phoneInput.value = value;
	}
}
