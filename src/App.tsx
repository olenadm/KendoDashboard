import React from "react";

import { HashRouter, Switch, Route } from 'react-router-dom';
import DrawerRouterContainer from "./Components/DrawerRouterContainer";

import Dashboard from "./pages/Dashboard";
import Info from "./pages/Info";
import Profile from "./pages/Profile";


import { AppContext } from './Components/AppContext';

import { countries } from './resources/countries';
import { IntlProvider, load, LocalizationProvider, loadMessages } from '@progress/kendo-react-intl';

import likelySubtags from 'cldr-core/supplemental/likelySubtags.json';
import currencyData from 'cldr-core/supplemental/currencyData.json';
import weekData from 'cldr-core/supplemental/weekData.json';

import frNumbers from 'cldr-numbers-full/main/fr/numbers.json';
import frLocalCurrency from 'cldr-numbers-full/main/fr/currencies.json';
import frCaGregorian from 'cldr-dates-full/main/fr/ca-gregorian.json';
import frDateFields from'cldr-dates-full/main/fr/dateFields.json';

import usNumbers from 'cldr-numbers-full/main/en/numbers.json';
import usLocalCurrency from 'cldr-numbers-full/main/en/currencies.json';
import usCaGregorian from 'cldr-dates-full/main/en/ca-gregorian.json';
import usDateFields from'cldr-dates-full/main/en/dateFields.json';
import esNumbers from 'cldr-numbers-full/main/es/numbers.json';
import esLocalCurrency from 'cldr-numbers-full/main/es/currencies.json';
import esCaGregorian from 'cldr-dates-full/main/es/ca-gregorian.json';
import esDateFields from'cldr-dates-full/main/es/dateFields.json';

import { enMessages } from './messages/en-US';
import { frMessages } from './messages/fr';
import { esMessages } from './messages/es';

import 'hammerjs';


load(
  likelySubtags,
  currencyData,
  weekData,
  frNumbers,
  frLocalCurrency,
  frCaGregorian,
  frDateFields,
  usNumbers,
  usLocalCurrency,
  usCaGregorian,
  usDateFields,
  esNumbers,
  esLocalCurrency,
  esCaGregorian,
  esDateFields
);

loadMessages(esMessages, 'es');
loadMessages(frMessages, 'fr');
loadMessages(enMessages, 'en-US');



const App = () => {

  const [contextState, setContextState] = React.useState({
    languageId: "en",
    localeId: 'en-US',
    firstName: 'Olena',
    lastName: 'Dmytrenko',
    middleName: '',
    email: 'olenad@gmail.com',
    phoneNumber: '0994347376',
    avatar: null,
    country: countries[38].name,
    isInPublicDirectory: true,
    biography: '',
    teamId: 1
});

const onLanguageChange = React.useCallback(
  (event:any) => { setContextState({...contextState, localeId: event.value.localeId}) },
  [contextState, setContextState]
);
const onProfileChange = React.useCallback(
  (event:any) => {
      setContextState({...contextState, ...event.dataItem});
  },
  [contextState, setContextState]
);


  
 

  return (
    <div className="App">
            <LocalizationProvider language={contextState.localeId}>
                <IntlProvider locale={contextState.localeId}>
                <AppContext.Provider value={{...contextState, onLanguageChange, onProfileChange}}>
                        <HashRouter>
                            <DrawerRouterContainer>
                                <Switch>
                                    <Route exact={true} path="/" component={Dashboard}  />                                   
                                    <Route exact={true} path="/profile" component={Profile} />
                                    <Route exact={true} path="/wishboard" component={Info} />

                                </Switch>
                            </DrawerRouterContainer>
                        </HashRouter>
                    </AppContext.Provider>
                </IntlProvider>
            </LocalizationProvider>
        </div>
    );
  
}

export default App;
