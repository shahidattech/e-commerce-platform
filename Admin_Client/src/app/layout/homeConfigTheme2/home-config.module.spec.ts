import { HomeConfigTheme2Module } from './home-config.module';

describe('HomeConfigTheme2Module', () => {
  let homeConfigTheme2Module: HomeConfigTheme2Module;

  beforeEach(() => {
    homeConfigTheme2Module = new HomeConfigTheme2Module();
  });

  it('should create an instance', () => {
    expect(homeConfigTheme2Module).toBeTruthy();
  });
});
