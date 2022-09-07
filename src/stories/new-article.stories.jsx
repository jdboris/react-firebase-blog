// NOTE: Must import the theme stylesheet first to allow others to overwrite
import theme from "../themes/theme-1/theme.module.scss";

import { App } from "../components/app";
import { MemoryRouter } from "react-router-dom";

export default {
  title: "New Article",
  component: App,
};

const Template = (args) => (
  // https://chestozo.medium.com/how-to-mock-location-inside-storybook-stories-76a7c0705354
  <MemoryRouter initialEntries={["/article/new"]}>
    <App {...args} />
  </MemoryRouter>
);

export const NormalApp = Template.bind({});
NormalApp.args = { theme };
