const config = {
  host: 'localhost',
  port: 9076,
  isSecure: false,
  prefix: ''
};

require.config({
  baseUrl: (config.isSecure ? 'https://' : 'http://') + config.host + (config.port ? ':' + config.port : '') + config.prefix + 'resources',
  paths: {
    local: 'http://localhost:8000/build/'
  }
});

function main() {

}
