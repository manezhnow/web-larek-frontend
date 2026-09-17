import { Api, ApiListResponse } from '../base/api';
import { ILarekApi, IOrderRequest, IOrderResult, IProduct } from '../../types';
import { apiEndpoints } from '../../utils/constants';

/**
 * API магазина: получение каталога и оформление заказа.
 * Дополняет пути к изображениям адресом CDN.
 */
export class LarekApi extends Api implements ILarekApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProducts(): Promise<IProduct[]> {
		return this.get(apiEndpoints.products).then((data) =>
			(data as ApiListResponse<IProduct>).items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderProducts(order: IOrderRequest): Promise<IOrderResult> {
		return this.post(apiEndpoints.order, order).then((data) => data as IOrderResult);
	}
}
