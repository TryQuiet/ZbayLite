import {
  Theme as MUITheme,
  ThemeOptions as MUIThemeOptions,
} from "@material-ui/core/styles/createMuiTheme";
import {
  Typography as MUITypography,
  TypographyOptions as MUITypographyOptions,
} from "@material-ui/core/styles/createTypography";
import {
  Palette as MUIPalette,
  PaletteOptions as MUIPaletteOptions,
} from "@material-ui/core/styles/createPalette";
/**
 * 
 declare module "@material-ui/core/styles/createMuiTheme" {
     interface Theme extends MUITheme {
         typography: {
             fontStyle: string;
            };
        }
        interface ThemeOptions extends MUIThemeOptions {
            typography?: {
                fontStyle?: string;
            };
        }
    }
       */
declare module "@material-ui/core/styles/createTypography" {
  interface Typography extends MUITypography {
    fontStyle: string;
    fontWeight: string;
    useNextVariants: boolean;
  }
  interface TypographyOptions extends MUITypographyOptions {
    fontStyle?: string;
    fontWeight?: string;
    useNextVariants?: boolean;
  }
}

declare module "@material-ui/core/styles/createPalette" {
  interface Palette extends MUIPalette {
    colors: { [key: string]: string };
  }
  interface PaletteOptions extends MUIPaletteOptions {
    colors?: { [key: string]: string };
  }
}
