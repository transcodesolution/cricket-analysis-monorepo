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

const orange: MantineColorsTuple = [
  '#ffe5d0', '#fdd7b5', '#fac897', '#f5b16f', '#f59a42',
  '#f2801a', '#E87722', '#cba181', '#b75410', '#9c4509',
];

const yellow: MantineColorsTuple = [
  '#F6E7B4', '#fff3cc', '#ffeeaa', '#ffe47f', '#ffdb55',
  '#ffd22b', '#FDF3C0', '#e6c966', '#ccb342', '#b29d1f',
];

const richBlue: MantineColorsTuple = [
  '#e0f0ff', '#c2e0ff', '#a3cfff', '#b3e0ff', '#7ec6f7',
  '#389ee1', '#0074c1', '#0066a8', '#00598f', '#1E88E5',
];

// Light Blue (Ball 4, 5)
const lightBlue: MantineColorsTuple = [
  '#f0f4f8', '#dce6ef', '#c2e8ff', '#ade0ff', '#99d8ff',
  '#BBDEFB', '#b3e0ff', '#5db1e0', '#3799d1', '#1a83c2',
];

export const theme: MantineThemeOverride = createTheme({
  colors: {
    primary,
    gray,
    customBlue,
    orange,
    yellow,
    richBlue,
    lightBlue,
  },
  primaryColor: 'primary',
  defaultRadius: 'md',
});
