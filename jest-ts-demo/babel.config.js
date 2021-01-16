module.exports = {
    presets: [
        //使其能够兼容当前的 Node 版本
        ['@babel/preset-env',{targets: {node: 'current'}}],
        '@babel/preset-typescript'
    ],
  };