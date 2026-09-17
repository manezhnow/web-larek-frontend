// ---------- Данные ----------

/** Категория товара (значения приходят с сервера) */
export type ProductCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка';

/** Товар каталога */
export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: ProductCategory;
	/** null — «бесценный» товар, купить его нельзя */
	price: number | null;
}

/** Способ оплаты */
export type PaymentMethod = 'online' | 'offline';

/** Данные покупателя, собираемые на шагах оформления */
export interface IBuyer {
	payment: PaymentMethod | null;
	address: string;
	email: string;
	phone: string;
}

/** Поля покупателя */
export type BuyerField = keyof IBuyer;

/** Ошибки валидации по полям покупателя */
export type FormErrors = Partial<Record<BuyerField, string>>;

/** Проверенные данные покупателя, готовые к отправке */
export interface IOrderData extends Omit<IBuyer, 'payment'> {
	payment: PaymentMethod;
}

/** Тело запроса на оформление заказа */
export interface IOrderRequest extends IOrderData {
	total: number;
	items: string[];
}

/** Ответ сервера на оформление заказа */
export interface IOrderResult {
	id: string;
	total: number;
}

// ---------- Сервисы ----------

/** Интерфейс API магазина */
export interface ILarekApi {
	getProducts(): Promise<IProduct[]>;
	orderProducts(order: IOrderRequest): Promise<IOrderResult>;
}

// ---------- Модели ----------

/** Интерфейс модели каталога */
export interface ICatalogModel {
	setItems(items: IProduct[]): void;
	getItems(): IProduct[];
	getItem(id: string): IProduct | undefined;
	setPreview(id: string): void;
	getPreview(): IProduct | null;
}

/** Интерфейс модели корзины */
export interface IBasketModel {
	getItems(): IProduct[];
	add(item: IProduct): void;
	remove(id: string): void;
	clear(): void;
	has(id: string): boolean;
	getCount(): number;
	getTotal(): number;
}

/** Интерфейс модели покупателя */
export interface IBuyerModel {
	setField(field: BuyerField, value: string): void;
	getData(): IBuyer;
	validate(): FormErrors;
	getOrderData(): IOrderData | null;
	clear(): void;
}

// ---------- Данные для отображения ----------

export interface IPageView {
	catalog: HTMLElement[];
	counter: number;
	locked: boolean;
}

export interface IModalView {
	content: HTMLElement;
}

/** Данные карточки: товар и состояние отображения */
export interface ICardView extends IProduct {
	/** Надпись на кнопке карточки в превью */
	button: string;
	/** Заблокирована ли кнопка карточки в превью */
	buttonDisabled: boolean;
	/** Порядковый номер в корзине */
	index: number;
}

/** Обработчики действий карточки */
export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export type IOrderFormView = Pick<IBuyer, 'payment' | 'address'>;

export type IContactsFormView = Pick<IBuyer, 'email' | 'phone'>;

export interface ISuccessView {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

// ---------- События ----------

/** Имена событий приложения */
export enum AppEvent {
	CatalogChanged = 'catalog:changed',
	PreviewChanged = 'preview:changed',
	BasketChanged = 'basket:changed',
	BuyerChanged = 'buyer:changed',

	CardSelect = 'card:select',
	CardToggle = 'card:toggle',
	CardRemove = 'card:remove',

	BasketOpen = 'basket:open',
	OrderOpen = 'order:open',
	OrderSubmit = 'order:submit',
	ContactsSubmit = 'contacts:submit',
	FormChange = 'form:change',

	ModalOpen = 'modal:open',
	ModalClose = 'modal:close',
}

/** Полезная нагрузка событий с идентификатором товара */
export interface IProductIdEvent {
	id: string;
}

/** Изменение поля формы */
export interface IFormChangeEvent {
	field: BuyerField;
	value: string;
}
