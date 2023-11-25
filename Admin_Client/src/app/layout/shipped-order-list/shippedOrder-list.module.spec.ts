import { shippedOrderListModule } from './shippedOrder-list.module';

describe('OrderListModule', () => {
  let OrderListModule: shippedOrderListModule;

  beforeEach(() => {
    OrderListModule = new shippedOrderListModule();
  });

  it('should create an instance', () => {
    expect(shippedOrderListModule).toBeTruthy();
  });
});
