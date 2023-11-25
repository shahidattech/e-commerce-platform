import { OrderListModule } from './order-list.module';

describe('OrderListModule', () => {
  let orderListModule: OrderListModule;

  beforeEach(() => {
    orderListModule = new OrderListModule();
  });

  it('should create an instance', () => {
    expect(orderListModule).toBeTruthy();
  });
});
