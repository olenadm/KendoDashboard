import React from 'react';

export const AppContext = React.createContext({
    languageId: 'en',
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phoneNumber: '',
    avatar: null,
    country: '',
    isInPublicDirectory: false,
    biography: '',
    teamId: 0,
    onLanguageChange: (e) => {},
    onProfileChange: (e) => {}
});

AppContext.displayName = 'AppContext';