import "../css/global.css";
// NOTE: Must import the theme stylesheet first to allow others to overwrite
import theme from "../themes/theme-1/theme.module.scss";

import { BrowserRouter as Router } from "react-router-dom";
import { App } from "../components/app";

export default {
  title: "App",
  component: App,
};

const Template = (args) => (
  // https://chestozo.medium.com/how-to-mock-location-inside-storybook-stories-76a7c0705354
  <Router>
    <App {...args} />
  </Router>
);

export const NormalApp = Template.bind({});
NormalApp.args = { theme };
