import { IEvents } from '../base/events';
import { AppEvent, ICatalogModel, IProduct } from '../../types';

/**
 * Модель каталога: список товаров и товар, выбранный для просмотра.
 */
export class CatalogModel implements ICatalogModel {
	protected items: IProduct[] = [];
	protected preview: IProduct | null = null;

	constructor(protected events: IEvents) {}

	setItems(items: IProduct[]): void {
		this.items = items;
		this.events.emit(AppEvent.CatalogChanged);
	}

	getItems(): IProduct[] {
		return [...this.items];
	}

	getItem(id: string): IProduct | undefined {
		return this.items.find((item) => item.id === id);
	}

	setPreview(id: string): void {
		const item = this.getItem(id);
		if (!item) return;
		this.preview = item;
		this.events.emit(AppEvent.PreviewChanged);
	}

	getPreview(): IProduct | null {
		return this.preview;
	}
}
