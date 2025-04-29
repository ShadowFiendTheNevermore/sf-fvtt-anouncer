const MODULE_ID = 'sf-fvtt-anouncer';
const TEMPLATE_SETTING_KEY = 'sf-fvtt-anonce-template';
export class TextAreaSettingsForm extends FormApplication {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: MODULE_ID + '-template-settings',
            title: "Настройки Шаблона",
            template: `modules/${MODULE_ID}/src/templates/settings.hbs`,
            width: 600,
            closeOnSubmit: true,
            resizable: true,
            popOut: true,
        });
    }
  
    getData(options) {
        return {
            template: game.settings.get(MODULE_ID, TEMPLATE_SETTING_KEY)
        };
    }
  
    async _updateObject(event, formData) {
        await game.settings.set(MODULE_ID, TEMPLATE_SETTING_KEY, formData.template);
    }
}