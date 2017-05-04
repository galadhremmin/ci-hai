import React from 'react';

/**
 * Provides functionality to sync form components with component state.
 */
export class EDStatefulFormComponent extends React.Component {

    /**
     * Handles form components' onChange-event.
     * @param {Event} ev 
     * @param {number|date|undefined} dataType 
     */
    onChange(ev, dataType) {
        const target = ev.target;
        const type = target.nodeName.toUpperCase();

        let name = target.name;
        let value = undefined;

        if (type === 'INPUT') {

            value = target.value;

            if (/^true$/i.test(value)) {
                value = true;
            } else if (/^false$/.test(value)) {
                value = false;
            } else if (/^[0-9]+$/.test(value)) {
                value = parseInt(value, 10);
            }

            if (/^checkbox|radio$/i.test(target.type)) {
                value = target.checked ? value || true : ((value === true) ? false : null);
            }

        } else if (type === 'SELECT') {
            value = target.options[target.selectedIndex].value;
        } else {
            value = target.value;
        }

        if (value === undefined) {
            return;
        }

        if (dataType !== undefined) {
            switch (dataType) {
                case 'number':
                    value = parseInt(value, 10);
                    break;
                case 'date':
                    value = Date.parse(value);
                    break;
            }
        }

        // look for dots in the name. If they exists, the name is actually a path:
        if (name.indexOf('.') > -1) {
            const parts = name.split('.');
            name = parts[0];
            
            let ptr = this.state[name] || {};
            for (let i = 1; i < parts.length - 1; i += 1) {
                ptr[parts[i]] = ptr[parts[i]] || {};

                ptr = ptr[parts[i]];
            }

            ptr[parts[parts.length - 1]] = value;
            value = ptr;
        } 

        this.setState({
            [name]: value
        });
    }
}