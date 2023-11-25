import { SliderAddModule } from './slider-add.module';

describe('FormModule', () => {
    let formModule: SliderAddModule;

    beforeEach(() => {
        formModule = new SliderAddModule();
    });

    it('should create an instance', () => {
        expect(formModule).toBeTruthy();
    });
});
