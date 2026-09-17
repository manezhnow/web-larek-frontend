import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/services/larekApi';
import { CatalogModel } from './components/models/catalogModel';
import { BasketModel } from './components/models/basketModel';
import { BuyerModel } from './components/models/buyerModel';
import { Page } from './components/views/page';
import { Modal } from './components/views/modal';
import { Basket } from './components/views/basket';
import { CardCatalog } from './components/views/cardCatalog';
import { CardPreview } from './components/views/cardPreview';
import { CardBasket } from './components/views/cardBasket';
import { OrderForm } from './components/views/orderForm';
import { ContactsForm } from './components/views/contactsForm';
import { Success } from './components/views/success';
import { API_URL, CDN_URL, previewButtonLabels } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import {
	AppEvent,
	BuyerField,
	ICardView,
	IFormChangeEvent,
	IFormState,
	IProduct,
	IProductIdEvent,
} from './types';

// ---------- Инфраструктура ----------

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

// ---------- Модели ----------

const catalog = new CatalogModel(events);
const basket = new BasketModel(events);
const buyer = new BuyerModel(events);

// ---------- Шаблоны ----------

const templates = {
	cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
	cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
	cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
	basket: ensureElement<HTMLTemplateElement>('#basket'),
	order: ensureElement<HTMLTemplateElement>('#order'),
	contacts: ensureElement<HTMLTemplateElement>('#contacts'),
	success: ensureElement<HTMLTemplateElement>('#success'),
};

// ---------- Постоянные представления ----------

const page = new Page(document.body, events);
const modal = new Modal(ensureElement('#modal-container'), events);
const basketView = new Basket(cloneTemplate(templates.basket), events);
const orderForm = new OrderForm(cloneTemplate(templates.order), events);
const contactsForm = new ContactsForm(cloneTemplate(templates.contacts), events);
const preview = new CardPreview(cloneTemplate(templates.cardPreview), {
	onClick: () => events.emit(AppEvent.CardToggle),
});
const success = new Success(cloneTemplate(templates.success), {
	onClick: () => modal.close(),
});

// ---------- Вспомогательные функции ----------

const orderFields: BuyerField[] = ['payment', 'address'];
const contactsFields: BuyerField[] = ['email', 'phone'];

/** Проверяет, что текст ошибки задан */
function isErrorText(value: string | undefined): value is string {
	return value !== undefined && value !== '';
}

/**
 * Состояние кнопки детальной карточки:
 * товар без цены купить нельзя, товар из корзины можно убрать.
 */
function getPreviewButtonState(item: IProduct): Pick<ICardView, 'button' | 'buttonDisabled'> {
	if (item.price === null) {
		return { button: previewButtonLabels.unavailable, buttonDisabled: true };
	}
	return {
		button: basket.has(item.id) ? previewButtonLabels.remove : previewButtonLabels.buy,
		buttonDisabled: false,
	};
}

/**
 * Состояние формы по её полям: доступность отправки и список ошибок.
 * При showErrors === false форма считается проверенной, но ошибки не показываются.
 */
function getFormState(fields: BuyerField[], showErrors: boolean): IFormState {
	const errors = buyer.validate();
	const messages = fields.map((field) => errors[field]).filter(isErrorText);
	return { valid: messages.length === 0, errors: showErrors ? messages : [] };
}

// ---------- Изменения моделей ----------

events.on(AppEvent.CatalogChanged, () => {
	page.render({
		catalog: catalog.getItems().map((item) =>
			new CardCatalog(cloneTemplate(templates.cardCatalog), {
				onClick: () => events.emit<IProductIdEvent>(AppEvent.CardSelect, { id: item.id }),
			}).render({
				title: item.title,
				price: item.price,
				category: item.category,
				image: item.image,
			})
		),
	});
});

events.on(AppEvent.PreviewChanged, () => {
	const item = catalog.getPreview();
	if (!item) return;
	modal.open(
		preview.render({
			title: item.title,
			price: item.price,
			category: item.category,
			image: item.image,
			description: item.description,
			...getPreviewButtonState(item),
		})
	);
});

events.on(AppEvent.BasketChanged, () => {
	page.render({ counter: basket.getCount() });
	basketView.render({
		total: basket.getTotal(),
		items: basket.getItems().map((item, index) =>
			new CardBasket(cloneTemplate(templates.cardBasket), {
				onClick: () => events.emit<IProductIdEvent>(AppEvent.CardRemove, { id: item.id }),
			}).render({ title: item.title, price: item.price, index: index + 1 })
		),
	});

	const item = catalog.getPreview();
	if (item) preview.render(getPreviewButtonState(item));
});

events.on(AppEvent.BuyerChanged, () => {
	orderForm.render({
		payment: buyer.getData().payment,
		...getFormState(orderFields, true),
	});
	contactsForm.render(getFormState(contactsFields, true));
});

// ---------- Действия пользователя ----------

events.on<IProductIdEvent>(AppEvent.CardSelect, ({ id }) => {
	catalog.setPreview(id);
});

events.on(AppEvent.CardToggle, () => {
	const item = catalog.getPreview();
	if (!item) return;
	if (basket.has(item.id)) basket.remove(item.id);
	else basket.add(item);
});

events.on<IProductIdEvent>(AppEvent.CardRemove, ({ id }) => {
	basket.remove(id);
});

events.on(AppEvent.BasketOpen, () => {
	modal.open(basketView.render());
});

events.on(AppEvent.OrderOpen, () => {
	const { payment, address } = buyer.getData();
	modal.open(orderForm.render({ payment, address, ...getFormState(orderFields, false) }));
});

events.on<IFormChangeEvent>(AppEvent.FormChange, ({ field, value }) => {
	buyer.setField(field, value);
});

events.on(AppEvent.OrderSubmit, () => {
	const { email, phone } = buyer.getData();
	modal.open(contactsForm.render({ email, phone, ...getFormState(contactsFields, false) }));
});

events.on(AppEvent.ContactsSubmit, () => {
	const order = buyer.getOrderData();
	if (!order) return;

	// Блокируем кнопку, чтобы заказ не ушёл на сервер дважды
	contactsForm.render({ valid: false });

	api
		.orderProducts({
			...order,
			total: basket.getTotal(),
			items: basket.getItems().map((item) => item.id),
		})
		.then((result) => {
			basket.clear();
			buyer.clear();
			modal.open(success.render({ total: result.total }));
		})
		.catch((error) => {
			contactsForm.render({ valid: true, errors: [String(error)] });
		});
});

events.on(AppEvent.ModalOpen, () => {
	page.render({ locked: true });
});

events.on(AppEvent.ModalClose, () => {
	page.render({ locked: false });
});

// ---------- Старт ----------

basketView.render({ items: [], total: 0 });

api
	.getProducts()
	.then((items) => catalog.setItems(items))
	.catch((error) => console.error('Не удалось загрузить каталог:', error));
