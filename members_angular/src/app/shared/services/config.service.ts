import { Injectable } from '@angular/core';
import { InConfiguration } from '../interfaces/config.interface';

@Injectable()
export class ConfigService {

    public configData: InConfiguration;

    constructor() {
        this.setConfigData();
    }

    setConfigData() {
        this.configData = {
            layout: {
                variant: 'light', // options:  light & dark
                theme_color: 'white', // options:  white, black, purple, blue, cyan, green, orange
                logo_bg_color: 'white', // options:  white, black, purple, blue, cyan, green, orange
                sidebar: {
                    collapsed: false, // options:  true & false
                    backgroundColor: 'light', // options:  light & dark
                }
            }
        }
    }
}
