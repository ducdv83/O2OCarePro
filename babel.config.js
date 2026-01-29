module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'react-native-css-interop' }],
    ],
    plugins: [
      require('react-native-css-interop/dist/babel-plugin').default,
      ['@babel/plugin-transform-react-jsx', { runtime: 'automatic', importSource: 'react-native-css-interop' }],
      'babel-plugin-transform-import-meta',
      'react-native-reanimated/plugin', // phải để cuối
    ],
  };
};

