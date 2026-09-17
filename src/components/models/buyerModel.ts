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
import { paymentMethods, validationErrors } from '../../utils/constants';

/**
 * Модель покупателя: данные для оформления заказа и их валидация.
 */
export class BuyerModel implements IBuyerModel {
	protected data: IBuyer = BuyerModel.createEmpty();

	constructor(protected events: IEvents) {}

	/** Создаёт пустые данные покупателя */
	protected static createEmpty(): IBuyer {
		return { payment: null, address: '', email: '', phone: '' };
	}

	setField(field: BuyerField, value: string): void {
		if (field === 'payment') {
			this.data.payment = BuyerModel.parsePayment(value);
		} else {
			this.data[field] = value.trim();
		}
		this.events.emit(AppEvent.BuyerChanged);
	}

	/** Приводит строку к способу оплаты, неизвестное значение сбрасывает */
	protected static parsePayment(value: string): PaymentMethod | null {
		const method = paymentMethods.find((item) => item === value);
		return method ?? null;
	}

	getData(): IBuyer {
		return { ...this.data };
	}

	/** Ошибки всех незаполненных полей */
	validate(): FormErrors {
		const errors: FormErrors = {};
		if (!this.data.payment) errors.payment = validationErrors.payment;
		if (!this.data.address) errors.address = validationErrors.address;
		if (!this.data.email) errors.email = validationErrors.email;
		if (!this.data.phone) errors.phone = validationErrors.phone;
		return errors;
	}

	/** Данные для заказа или null, если данные не прошли проверку */
	getOrderData(): IOrderData | null {
		const { payment, address, email, phone } = this.data;
		if (Object.keys(this.validate()).length > 0 || payment === null) return null;
		return { payment, address, email, phone };
	}

	clear(): void {
		this.data = BuyerModel.createEmpty();
		this.events.emit(AppEvent.BuyerChanged);
	}
}
