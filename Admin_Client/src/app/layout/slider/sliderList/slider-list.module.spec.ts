import { SliderListModule } from './slider-list.module';

describe('SliderListModule', () => {
  let sliderListModule: SliderListModule;

  beforeEach(() => {
    sliderListModule = new SliderListModule();
  });

  it('should create an instance', () => {
    expect(sliderListModule).toBeTruthy();
  });
});
