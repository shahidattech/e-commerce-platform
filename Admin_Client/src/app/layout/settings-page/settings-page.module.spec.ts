import { SettingsPageModule } from './settings-page.module';

describe('SettingsPageModule', () => {
    let settingsPageModule: SettingsPageModule;

    beforeEach(() => {
        settingsPageModule = new SettingsPageModule();
    });

    it('should create an instance', () => {
        expect(settingsPageModule).toBeTruthy();
    });
});
