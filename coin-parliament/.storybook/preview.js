import "../src/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import { BrowserRouter } from "react-router-dom";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        ss
        <Story />
      </BrowserRouter>
    ),
  ],
};

export const decorators = [
  (Story, parameters) => {
    const { args } = parameters;
    return (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    );
  },
];
