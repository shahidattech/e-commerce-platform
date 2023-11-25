import { CustomerListModule } from './customer-list.module';

describe('CustomerListModule', () => {
  let ReviewProductListModule: CustomerListModule;

  // beforeEach(() => {
  //   ReviewProductListModule = new ReviewProductListModule();
  // });

  it('should create an instance', () => {
    expect(CustomerListModule).toBeTruthy();
  });
});
