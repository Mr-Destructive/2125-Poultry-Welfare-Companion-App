const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // resolve: {
  //   alias: {
  //       'react-native': 'react-native-web',
  //       ...
  //       'react-native-maps': 'react-native-web-maps',
  //   }
  // }
  // Customize the config before returning it.
  return config;
};
