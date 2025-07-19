const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api", // Substitua pelo caminho correto da sua API
    createProxyMiddleware({
      target: "http://srv-wms.produtiva.agro:3333",
      changeOrigin: true,
    })
  );
};
