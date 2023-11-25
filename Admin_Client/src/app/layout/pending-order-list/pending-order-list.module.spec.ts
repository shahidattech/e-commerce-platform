import { PendingOrderListModule } from './pending-order-list.module';

describe('OrderListModule', () => {
  let OrderListModule: PendingOrderListModule;

  beforeEach(() => {
    OrderListModule = new PendingOrderListModule();
  });

  it('should create an instance', () => {
    expect(PendingOrderListModule).toBeTruthy();
  });
});
