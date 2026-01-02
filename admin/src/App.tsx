import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import russianMessages from 'ra-language-russian';

// Настройка провайдера для нашего API
const dataProvider = jsonServerProvider('http://localhost:3004/api');

// Русификация интерфейса
const messages = {
  ru: russianMessages,
};

const App = () => (
  <Admin 
    dataProvider={dataProvider}
    locale="ru"
    i18nProvider={{ locale: 'ru', messages }}
    title="GrinderMaster Админка"
  >
    <Resource name="products" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
    <Resource name="services" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
    <Resource name="categories" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
    <Resource name="requests" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
  </Admin>
);

export default App;
