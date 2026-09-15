import { IEvents } from '../base/events';
import {
	AppEvent,
	BuyerField,
	FormErrors,
	IBuyer,
	IBuyerModel,
	IOrderData,
	PaymentMethod,
} from '../../types';
import { paymentMethods } from '../../utils/constants';

/**
 * Модель покупателя: данные для оформления заказа и их валидация.
 */
export class BuyerModel implements IBuyerModel {
	protected data: IBuyer = BuyerModel.empty();

	constructor(protected events: IEvents) {}

	protected static empty(): IBuyer {
		return { payment: null, address: '', email: '', phone: '' };
	}

	setField(field: BuyerField, value: string): void {
		if (field === 'payment') {
			this.data.payment = BuyerModel.toPayment(value);
		} else {
			this.data[field] = value.trim();
		}
		this.events.emit(AppEvent.BuyerChanged);
	}

	/** Приводит строку к способу оплаты, неизвестное значение сбрасывает */
	protected static toPayment(value: string): PaymentMethod | null {
		const method = paymentMethods.find((item) => item === value);
		return method ?? null;
	}

	getData(): IBuyer {
		return { ...this.data };
	}

	/** Ошибки всех незаполненных полей */
	validate(): FormErrors {
		const errors: FormErrors = {};
		if (!this.data.payment) errors.payment = 'Выберите способ оплаты';
		if (!this.data.address) errors.address = 'Необходимо указать адрес';
		if (!this.data.email) errors.email = 'Необходимо указать email';
		if (!this.data.phone) errors.phone = 'Необходимо указать телефон';
		return errors;
	}

	/** Данные для заказа или null, если данные не прошли проверку */
	getOrderData(): IOrderData | null {
		const { payment, address, email, phone } = this.data;
		if (Object.keys(this.validate()).length > 0 || payment === null) return null;
		return { payment, address, email, phone };
	}

	clear(): void {
		this.data = BuyerModel.empty();
		this.events.emit(AppEvent.BuyerChanged);
	}
}
