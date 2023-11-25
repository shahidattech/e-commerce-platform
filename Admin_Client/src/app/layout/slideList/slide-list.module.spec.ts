import { SlideListModule } from './slide-list.module';

describe('SlideListModule', () => {
  let slideListModule: SlideListModule;

  beforeEach(() => {
    slideListModule = new SlideListModule();
  });

  it('should create an instance', () => {
    expect(slideListModule).toBeTruthy();
  });
});
