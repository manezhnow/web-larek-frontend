import { BuyerField, PaymentMethod, ProductCategory } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

/** Пути запросов к серверу */
export const apiEndpoints = {
	products: '/product/',
	order: '/order',
};

/** Тексты интерфейса */
export const settings = {
	currency: 'синапсов',
	pricelessLabel: 'Бесценно',
	emptyBasketLabel: 'Корзина пуста',
	writeOffLabel: 'Списано',
	errorsSeparator: '; ',
	catalogErrorLabel: 'Не удалось загрузить каталог:',
};

/** Локаль для разделения разрядов в цене */
export const priceLocale = 'ru-RU';

/** Клавиши, которые обрабатывают представления */
export const keyNames = {
	escape: 'Escape',
};

/** Суффикс имени события отправки формы: `${name}:submit` */
export const submitEventSuffix = ':submit';

/** Надписи на кнопке детальной карточки товара */
export const previewButtonLabels = {
	buy: 'Купить',
	remove: 'Убрать',
	unavailable: 'Недоступно',
};

/** Тексты ошибок валидации данных покупателя */
export const validationErrors: Record<BuyerField, string> = {
	payment: 'Выберите способ оплаты',
	address: 'Необходимо указать адрес',
	email: 'Необходимо указать email',
	phone: 'Необходимо указать телефон',
};

/** Модификаторы CSS-классов, переключаемые представлениями */
export const classModifiers = {
	pageLocked: 'page__wrapper_locked',
	modalActive: 'modal_active',
	paymentActive: 'button_alt-active',
	categoryPrefix: 'card__category_',
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
