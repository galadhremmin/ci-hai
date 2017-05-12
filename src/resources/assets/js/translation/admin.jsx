import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import EDConfig from 'ed-config';
import { saveState, loadState } from 'ed-session-storage-state';
import EDTranslationAdminReducer from './reducers/admin';
import EDTranslationForm from './components/forms';

window.addEventListener('load', function () {
    let preloadedState = undefined;

    const translationDataContainer = document.getElementById('ed-preloaded-translation');
    if (translationDataContainer) {
        const translationData = JSON.parse(translationDataContainer.textContent);

        preloadedState = {
            ...translationData,
            languages: EDConfig.languages()    
        };
    }

    const store = createStore(EDTranslationAdminReducer, preloadedState,
        applyMiddleware(thunkMiddleware)
    );

    ReactDOM.render(
        <Provider store={store}>
            <EDTranslationForm />
        </Provider>,
        document.getElementById('ed-translation-form')
    );
});