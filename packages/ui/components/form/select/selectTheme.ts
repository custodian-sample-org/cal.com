import type { GroupBase, SelectComponentsConfig, MenuPlacement } from "react-select";

import { InputComponent, OptionComponent } from "./components";

export const getReactSelectProps = ({
  components,
  menuPlacement = "auto",
}: {
  components: SelectComponentsConfig<Option, IsMulti, Group>;
  menuPlacement?: MenuPlacement;
}) => {
    menuPlacement,
    components: {
      Input: InputComponent,
      Option: OptionComponent,
      ...components,
    },
    unstyled: true,
  };
