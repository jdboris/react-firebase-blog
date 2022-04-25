import { App } from "../components/app";
import theme from "../css/theme.module.scss";

export default {
  title: "App",
  component: App,
};

const Template = (args) => <App {...args} />;

export const NormalApp = Template.bind({});
NormalApp.args = { theme };
