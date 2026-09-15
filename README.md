# Проектная работа «Веб-ларёк»

Интернет-магазин с товарами для веб-разработчиков: каталог, карточка товара, корзина и оформление заказа в два шага. В отличие от предыдущих проектов приложение построено на собственной MVP-архитектуре с брокером событий и полностью типизировано.

Стек: HTML, SCSS, TypeScript, Webpack.

## Запуск

Нужны Node.js 18+ и npm.

1. Создайте в корне файл `.env` по образцу `.env.example`:

   ```
   API_ORIGIN=https://larek-api.nomoreparties.co
   ```

2. Установите зависимости и запустите dev-сервер:

   ```
   npm install
   npm run start
   ```

Сборка: `npm run build`. Линтер: `npm run lint`.

## Структура проекта

- `src/index.ts` — точка входа и презентер
- `src/types/index.ts` — типы данных, интерфейсы и имена событий
- `src/components/base/` — базовый код: `Api`, `EventEmitter`, `Component`
- `src/components/models/` — слой данных
- `src/components/services/` — работа с сервером
- `src/components/views/` — слой отображения, один класс на файл
- `src/utils/` — константы и утилиты
- `src/pages/index.html` — разметка и шаблоны
- `src/scss/`, `src/common.blocks/` — стили

## Архитектура

Паттерн **MVP (Model — View — Presenter)**:

- **Model** хранит данные и правила: каталог, корзину, покупателя. О DOM не знает, об изменениях сообщает событием.
- **View** отвечает только за свой фрагмент интерфейса: принимает данные через `render()`, о действиях пользователя сообщает событием или колбэком. Бизнес-логики и запросов к серверу в представлениях нет.
- **Presenter** (`src/index.ts`) создаёт модели, представления и API, подписывается на события и связывает слои.

Слои общаются через брокер `EventEmitter` (паттерн **Observer**). Классы не создают друг друга: зависимости передаются в конструктор.

```
Пользователь ─► View ─(событие действия)─► Presenter ─(вызов метода)─► Model
                 ▲                            │                          │
                 └──── render(данные) ◄───────┴───◄─(событие изменения)──┘
                                              └─► LarekApi ─► сервер
```

Пример, нажатие «Купить»: `CardPreview` вызывает колбэк, презентер генерирует `card:toggle`, берёт выбранный товар из `CatalogModel` и вызывает `BasketModel.add()`. Модель генерирует `basket:changed`, презентер обновляет счётчик в `Page`, список в `Basket` и кнопку в `CardPreview`.

## Базовый код

**`Api`** — HTTP-клиент на `fetch`. `get(uri)`, `post(uri, data, method)`, `protected handleResponse(response)` возвращает JSON или отклоняет промис с текстом ошибки.

**`EventEmitter`** — брокер событий, реализует `IEvents`: `on(event, callback)`, `off(event, callback)`, `emit(event, data?)`, `onAll(callback)`, `offAll()`, `trigger(event, context?)`.

**`Component<T>`** — абстрактный базовый класс представлений, `T` — данные, которые компонент отображает.
- `protected constructor(container: HTMLElement)`
- `render(data?: Partial<T>): HTMLElement` — записывает данные в сеттеры и возвращает корневой элемент
- `protected setText`, `setImage`, `setDisabled`, `toggleClass` — работа с DOM

Каждое представление ищет свои DOM-элементы один раз в конструкторе и хранит их в полях.

## Модели

Каждая модель получает `events: IEvents` в конструктор и реализует собственный интерфейс (`ICatalogModel`, `IBasketModel`, `IBuyerModel`).

**`CatalogModel`** — каталог и товар для просмотра.
- `setItems(items: IProduct[])` → `catalog:changed`
- `getItems(): IProduct[]`, `getItem(id): IProduct | undefined`
- `setPreview(id)` → `preview:changed`, `getPreview(): IProduct | null`

**`BasketModel`** — корзина. Все изменяющие методы генерируют `basket:changed`.
- `add(item)` — не добавляет повторно и не добавляет товар без цены
- `remove(id)`, `clear()`, `has(id): boolean`
- `getItems(): IProduct[]`, `getCount(): number`, `getTotal(): number`

**`BuyerModel`** — данные покупателя.
- `setField(field: BuyerField, value)` → `buyer:changed`; для `payment` принимает только значения из `paymentMethods`, иначе сбрасывает в `null`
- `getData(): IBuyer` — копия данных
- `validate(): FormErrors` — ошибки по незаполненным полям
- `getOrderData(): IOrderData | null` — данные для заказа, если валидация пройдена
- `clear()` → `buyer:changed`

## Сервисы

**`LarekApi`** наследует `Api`, реализует `ILarekApi`. Используется только презентером.
- `constructor(cdn: string, baseUrl: string, options?: RequestInit)`
- `getProducts(): Promise<IProduct[]>` — `GET /product/`, к изображениям добавляется адрес CDN
- `orderProducts(order: IOrderRequest): Promise<IOrderResult>` — `POST /order`

## Представления

```
Component<T>
├── Page              главная: catalog, counter, locked; клик по корзине → basket:open
├── Modal             окно: content; open(content?) → modal:open; close() → modal:close
├── Basket            корзина: items, total; «Оформить» → order:open
├── Success           итог заказа: total; кнопка → actions.onClick
├── Card<T>           абстрактная: id, title, price («Бесценно» при null)
│   ├── CardBasket    строка корзины: index; удаление → actions.onClick
│   └── CardMedia<T>  абстрактная: category (CSS-модификатор), image
│       ├── CardCatalog   карточка каталога; клик → actions.onClick
│       └── CardPreview   превью: description, inBasket; без цены кнопка «Недоступно»
└── Form<T>           абстрактная: valid, errors; ввод → form:change; отправка → `${name}:submit`
    ├── OrderForm     payment, address; клик по кнопке оплаты → form:change
    └── ContactsForm  email, phone
```

Конструкторы: `Page`, `Modal`, `Basket`, `OrderForm`, `ContactsForm` получают `(container, events: IEvents)`; карточки и `Success` получают `(container, actions)` с колбэком `onClick`. Модальное окно закрывается по крестику, клику на оверлей и клавише Escape; пустая корзина показывает «Корзина пуста» и блокирует «Оформить».

## Типы данных

Все типы в `src/types/index.ts`.

```ts
type ProductCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка';

interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: ProductCategory;
	price: number | null; // null — товар без цены, купить нельзя
}

type PaymentMethod = 'online' | 'offline';

interface IBuyer {
	payment: PaymentMethod | null;
	address: string;
	email: string;
	phone: string;
}

type BuyerField = keyof IBuyer;
type FormErrors = Partial<Record<BuyerField, string>>;

/** Проверенные данные покупателя */
interface IOrderData extends Omit<IBuyer, 'payment'> {
	payment: PaymentMethod;
}

interface IOrderRequest extends IOrderData {
	total: number;
	items: string[];
}

interface IOrderResult {
	id: string;
	total: number;
}
```

Интерфейсы классов: `ILarekApi`, `ICatalogModel`, `IBasketModel`, `IBuyerModel`.

Данные представлений:

| Тип | Поля |
| --- | --- |
| `IPageView` | `catalog: HTMLElement[]`, `counter: number`, `locked: boolean` |
| `IModalView` | `content: HTMLElement` |
| `ICardView extends IProduct` | `inBasket: boolean`, `index: number`; карточки берут нужные поля через `Pick` |
| `IBasketView` | `items: HTMLElement[]`, `total: number` |
| `IFormState` | `valid: boolean`, `errors: string[]` |
| `IOrderFormView` | `Pick<IBuyer, 'payment' \| 'address'>` |
| `IContactsFormView` | `Pick<IBuyer, 'email' \| 'phone'>` |
| `ISuccessView` | `total: number` |
| `ICardActions`, `ISuccessActions` | `onClick` |
| `IProductIdEvent` | `{ id: string }` |
| `IFormChangeEvent` | `{ field: BuyerField; value: string }` |

## События

Имена собраны в перечислении `AppEvent`.

| Событие | Источник | Данные | Реакция презентера |
| --- | --- | --- | --- |
| `catalog:changed` | `CatalogModel` | — | отрисовать карточки в `Page` |
| `preview:changed` | `CatalogModel` | — | открыть `CardPreview` в `Modal` |
| `basket:changed` | `BasketModel` | — | обновить счётчик, `Basket`, кнопку превью |
| `buyer:changed` | `BuyerModel` | — | проверить данные, обновить формы |
| `card:select` | `CardCatalog` (колбэк) | `{ id }` | `CatalogModel.setPreview(id)` |
| `card:toggle` | `CardPreview` (колбэк) | — | добавить или убрать товар из корзины |
| `card:remove` | `CardBasket` (колбэк) | `{ id }` | `BasketModel.remove(id)` |
| `basket:open` | `Page` | — | открыть `Basket` |
| `order:open` | `Basket` | — | открыть `OrderForm` |
| `form:change` | `Form` | `{ field, value }` | `BuyerModel.setField()` |
| `order:submit` | `OrderForm` | — | открыть `ContactsForm` |
| `contacts:submit` | `ContactsForm` | — | отправить заказ (кнопка блокируется на время запроса), очистить корзину и покупателя, показать `Success` |
| `modal:open` / `modal:close` | `Modal` | — | заблокировать или разблокировать прокрутку |

## Утилиты и константы

- `ensureElement`, `ensureAllElements`, `cloneTemplate`, `createElement` — работа с DOM
- `formatPrice(price, currency, priceless)` — цена с разделением разрядов или «Бесценно»
- `API_URL`, `CDN_URL`, `settings` — адреса и подписи
- `categoryModifiers` — категория → CSS-модификатор
- `paymentButtons` — имя кнопки → способ оплаты, `paymentMethods` — список допустимых способов оплаты
