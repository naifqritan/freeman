import os from "os";
import fs from "fs";
import path from "path";

import { IKeyMap } from "models";
import { ConfigManager, PlatformHelper } from "objects";

/**
 * Manages parsing key maps from application and user settings files.
 */
class KeysManager {

    /**
     * A base config manager held as an instance variable.
     */
    private configManager: ConfigManager;

    /**
     * Gets the name of the key map file depending on the current platform.
     */
    private get keysFile(): string {
        const platform = os.platform();
        if (PlatformHelper.isUnix(platform)) {
            return "keys.linux.json";
        } else {
            return "keys.windows.json";
        }
    }

    /**
     * Initialises an instance of the KeysManager class.
     */
    public constructor() {
        this.configManager = new ConfigManager();
    }

    /**
     * Retrieves application and user-specific key map settings files.
     *
     * @returns - a fully-formed key map object, or null if no settings could
     *      be read
     */
    public retrieve(): IKeyMap | null {
        const applicationKeys = this.parseApplicationKeys();
        const userKeys = this.parseUserKeys();

        if (applicationKeys && userKeys) {
            return { ...applicationKeys, ...userKeys };
        }

        return applicationKeys || userKeys || null;
    }

    /**
     * Parses application key map settings file.
     *
     * @returns - a fully-formed key map object, or null if no settings could
     *      be read
     */
    private parseApplicationKeys(): IKeyMap | null {
        const fileName = path.join(
            this.configManager.applicationDataDirectory,
            this.configManager.applicationName,
            this.keysFile);

        if (!fs.existsSync(fileName)) {
            return null;
        }

        const applicationKeys = fs.readFileSync(fileName, "utf-8");
        return JSON.parse(applicationKeys);
    }

    /**
     * Parses user-specific key map settings file.
     *
     * @returns - a fully-formed key map object, or null if no settings could
     *      be read
     */
    private parseUserKeys(): IKeyMap | null {
        const fileName = path.join(
            this.configManager.userDataDirectory,
            this.configManager.applicationName,
            this.keysFile);

        if (!fs.existsSync(fileName)) {
            return null;
        }

        const userKeys = fs.readFileSync(fileName, "utf-8");
        return JSON.parse(userKeys);
    }
}

export default KeysManager;