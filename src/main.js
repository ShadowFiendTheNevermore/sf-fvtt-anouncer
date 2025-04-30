import { TextAreaSettingsForm } from "./settings/TextAreaSettingsForm.js";

// @ts-check

const MODULE_ID = 'sf-fvtt-anouncer';
const ENABLE_FOR_PLAYER_SETTING_KEY = `${MODULE_ID}-enable-for-player-`;
const ENABLE_ANOUNCEMENTS_SETTING_KEY = 'is-enabled';
const TEMPLATE_SETTING_KEY = 'sf-fvtt-anonce-template';

Hooks.once('setup', async () => {
    registerSettings();
});

Hooks.once('ready', async () => {
    if(!checkApplicable()) {
        return;
    }

    const gm = game.users?.activeGM
    const player = game.users?.current;

    // @ts-ignore
    const compiledTemplate = Handlebars.compile(game.settings.get(MODULE_ID, TEMPLATE_SETTING_KEY));

    if (player && checkUserIsEnabled(player)) {
        const html = await compiledTemplate({
            user: player
        });

        await ChatMessage.create({
            content: html,
            whisper: [player.id, gm.id]
        });
    }
});


let registerSettings = () => {
    game.settings?.register(MODULE_ID, ENABLE_ANOUNCEMENTS_SETTING_KEY, {
        name: `Enable anouncements`,
        hint: `By default is disabled because you have to setup module settings`,
        scope: 'world',
        config: true,
        type: Boolean,
        restricted: true,
        default: false,
        requiresReload: true
    });

    // @ts-ignore
    game.settings.register(MODULE_ID, TEMPLATE_SETTING_KEY, {
        name: `template`,
        scope: 'world',
        config: false,
        type: String,
        restricted: true,
        default: ""
    });

    //@ts-ignore
    game.settings?.registerMenu(MODULE_ID, 'templateSettings', {
        name: "Настройка шаблона",
        label: "Настроить шаблон",
        icon: "fas fa-cogs",
        type: TextAreaSettingsForm,
        restricted: true
    });

    game.users?.forEach(user => {
        const settingKey = ENABLE_FOR_PLAYER_SETTING_KEY + user.id;

        game.settings.register(MODULE_ID, settingKey, {
            name: `Пользователь: ${user.name}`,
            hint: `Будет ли пользователь получать уведомления (если снять, уведомления не будет)`,
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
            restricted: true
        });
    });
};

/**
 * @param {User} user - The user to check
 * @returns {Boolean} - Whether the user is a Enabled
 */
let checkUserIsEnabled = (user) => {
    if (!user || !game.settings) {
        return false;
    }

    // @ts-ignore
    return Boolean(game.settings.get(MODULE_ID, ENABLE_FOR_PLAYER_SETTING_KEY + user.id));
}


let checkApplicable = () => {
    console.log("APPLICABLE VALUE STATUS |", game.settings.get(MODULE_ID, TEMPLATE_SETTING_KEY));
    if (! game.settings || 
        ! Boolean(game.settings.get(MODULE_ID, TEMPLATE_SETTING_KEY))
    ) {
        return false;
    }

    //@ts-ignore
    return Boolean(game.settings.get(MODULE_ID, ENABLE_ANOUNCEMENTS_SETTING_KEY));
}
