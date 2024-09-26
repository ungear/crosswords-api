export interface AppConfig {
  port: number;
}
const DEFAULT_CONFIG: AppConfig = {
  port: 3000,
} 

export function getConfig(): AppConfig{
  const processArgs = getProcessarguments();
  const config = {...DEFAULT_CONFIG};

  config.port = processArgs.port && typeof processArgs.port === "string"
    ? parseInt(processArgs.port)
    : config.port;

  return config;
}

function getProcessarguments(): {[key: string]: string | boolean}{
  const originalArgs = process.argv.slice(2);
  const result = originalArgs.reduce((acc, cur) => {
    if(cur.indexOf("=") === -1){
      acc[cur] = true;
    } else {
      const [name, value] = cur.split("=");
      acc[name] = value;
    }
    return acc;
  }, {} as {[key: string]: string | boolean})
  return result;
}