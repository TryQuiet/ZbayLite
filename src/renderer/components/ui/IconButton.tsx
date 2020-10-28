import React from "react";
import IconButtonMui from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import { IIconButtonProps } from "./IconButton.d";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 6,
    color: theme.typography.body1.color,
  },
}));

export const IconButton: React.FC<IIconButtonProps> = ({
  children,
  ...props
}) => {
  const classes = useStyles({});
  return (
    <IconButtonMui classes={{ root: classes.root }} {...props}>
      {children}
    </IconButtonMui>
  );
};

export default IconButton;
