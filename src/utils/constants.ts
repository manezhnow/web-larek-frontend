import { PaymentMethod, ProductCategory } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
	currency: 'синапсов',
	pricelessLabel: 'Бесценно',
};

/** Соответствие категории товара модификатору CSS-класса */
export const categoryModifiers: Record<ProductCategory, string> = {
	'софт-скил': 'soft',
	'хард-скил': 'hard',
	другое: 'other',
	дополнительное: 'additional',
	кнопка: 'button',
};

/** Соответствие имени кнопки в форме способу оплаты */
export const paymentButtons: Record<string, PaymentMethod> = {
	card: 'online',
	cash: 'offline',
};

/** Допустимые способы оплаты */
export const paymentMethods: PaymentMethod[] = Object.values(paymentButtons);
