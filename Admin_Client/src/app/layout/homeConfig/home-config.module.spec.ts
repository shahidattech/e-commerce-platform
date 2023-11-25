import { HomeConfigModule } from './home-config.module';

describe('HomeConfigModule', () => {
  let homeConfigModule: HomeConfigModule;

  beforeEach(() => {
    homeConfigModule = new HomeConfigModule();
  });

  it('should create an instance', () => {
    expect(homeConfigModule).toBeTruthy();
  });
});
