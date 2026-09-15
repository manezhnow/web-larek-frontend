import { IEvents } from '../base/events';
import { AppEvent, IBasketModel, IProduct } from '../../types';

/**
 * Модель корзины: хранит выбранные товары и считает итоговую стоимость.
 */
export class BasketModel implements IBasketModel {
	protected items: IProduct[] = [];

	constructor(protected events: IEvents) {}

	getItems(): IProduct[] {
		return [...this.items];
	}

	add(item: IProduct): void {
		if (this.has(item.id) || item.price === null) return;
		this.items = [...this.items, item];
		this.changed();
	}

	remove(id: string): void {
		this.items = this.items.filter((item) => item.id !== id);
		this.changed();
	}

	clear(): void {
		this.items = [];
		this.changed();
	}

	has(id: string): boolean {
		return this.items.some((item) => item.id === id);
	}

	getCount(): number {
		return this.items.length;
	}

	getTotal(): number {
		return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
	}

	protected changed(): void {
		this.events.emit(AppEvent.BasketChanged);
	}
}
