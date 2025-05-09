import { createTheme, MantineColorsTuple, MantineThemeOverride } from '@mantine/core';

const primary: MantineColorsTuple = [
  '#c5dbf6', // 0 - lightest (used for active bg)
  '#a3c4f3',
  '#7faae9',
  '#5890e1',
  '#3579dc',
  '#1664d7',
  '#005bc4', // 6 - your brand primary 
  '#004eaa',
  '#004290',
  '#003775', // 9 - darkest
];

const gray: MantineColorsTuple = [
  '#f7f7f8',
  '#f7f7f8', //bg color
  '#f1f3f5',
  '#e9ecef',
  '#dee2e6',
  '#D5D5D5', //border coloe
  '#E6E6E6',
  '#71717A',
  '#11181C',
  '#343a40',
];

const customBlue: MantineColorsTuple = [
  '#d0e5ff',
  '#a8ccff',
  '#7fb2ff',
  '#5599ff',
  '#2c80ff',
  '#006FEE',  // Base shade
  '#0063d6',
  '#0057be',
  '#004ba6',
  '#003f8e',
];

export const theme: MantineThemeOverride = createTheme({
  colors: {
    primary,
    gray,
    customBlue
  },
  primaryColor: 'primary',
  defaultRadius: 'md',
});
