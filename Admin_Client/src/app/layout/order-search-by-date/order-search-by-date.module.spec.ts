import { OrderSearchByDateModule } from './order-search-by-date.module';

describe('OrderSearchByDateModule', () => {
  let orderSearchByDateModule: OrderSearchByDateModule;

  beforeEach(() => {
    orderSearchByDateModule = new OrderSearchByDateModule();
  });

  it('should create an instance', () => {
    expect(orderSearchByDateModule).toBeTruthy();
  });
});
