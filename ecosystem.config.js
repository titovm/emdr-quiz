module.exports = {
  apps: [
    {
      name: "emdr-test",
      script: "npm",
      args: "start",
      env: {
        PORT: 3001,
        NODE_ENV: "production"
      }
    }
  ]
};