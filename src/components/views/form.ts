import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { AppEvent, BuyerField, IFormChangeEvent, IFormState } from '../../types';

/**
 * Базовая форма: отслеживает ввод, отправку, состояние кнопки и ошибки.
 * Событие отправки формируется из имени формы: `${name}:submit`.
 */
export abstract class Form<T> extends Component<IFormState & T> {
	protected submitButton: HTMLButtonElement;
	protected errorsElement: HTMLElement;

	protected constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
		this.errorsElement = ensureElement('.form__errors', container);

		this.container.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			this.emitChange(target.name as BuyerField, target.value);
		});

		this.container.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected emitChange(field: BuyerField, value: string): void {
		this.events.emit<IFormChangeEvent>(AppEvent.FormChange, { field, value });
	}

	set valid(value: boolean) {
		this.setDisabled(this.submitButton, !value);
	}

	set errors(value: string[]) {
		this.setText(this.errorsElement, value.join('; '));
	}
}
