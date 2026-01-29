const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Web: zustand bản ESM (esm/*.mjs) dùng import.meta → lỗi. Ép Metro dùng bản CJS.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'zustand' || moduleName.startsWith('zustand/')) {
    try {
      const filePath = require.resolve(moduleName);
      if (filePath && !filePath.includes('esm')) {
        return { type: 'sourceFile', filePath };
      }
    } catch (_) {}
  }
  return originalResolveRequest ? originalResolveRequest(context, moduleName, platform) : context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
