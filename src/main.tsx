import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#8ac7e8',
      main: '#0086cd',
      dark: '#005f92',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);
