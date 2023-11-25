import { SlideShowModule } from './slideShow.module';

describe('FormModule', () => {
    let formModule: SlideShowModule;

    beforeEach(() => {
        formModule = new SlideShowModule();
    });

    it('should create an instance', () => {
        expect(formModule).toBeTruthy();
    });
});
