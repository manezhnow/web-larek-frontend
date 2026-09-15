/**
 * Базовый компонент отображения.
 * Хранит корневой DOM-элемент и предоставляет инструменты для работы с ним.
 * Данные в компонент попадают через сеттеры, вызываемые методом render.
 */
export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	/** Установить текстовое содержимое */
	protected setText(element: HTMLElement, value: unknown): void {
		if (element) element.textContent = String(value);
	}

	/** Установить изображение с альтернативным текстом */
	protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
		if (!element) return;
		element.src = src;
		if (alt !== undefined) element.alt = alt;
	}

	/** Сменить статус блокировки */
	protected setDisabled(element: HTMLElement, state: boolean): void {
		if (!element) return;
		if (state) element.setAttribute('disabled', 'disabled');
		else element.removeAttribute('disabled');
	}

	/** Переключить CSS-класс */
	protected toggleClass(element: HTMLElement, className: string, force?: boolean): void {
		element.classList.toggle(className, force);
	}

	/** Обновить данные компонента и вернуть корневой элемент */
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
