import { BrowserRouter as Router } from "react-router-dom";
import { App } from "../components/app";
import theme from "../themes/theme-1/theme.module.scss";

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
