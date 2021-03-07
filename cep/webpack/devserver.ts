import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';

export function startWebpackDevServer(config: webpack.Configuration) {
    const { host, port } = config.devServer!;

    return new Promise<void>((resolve, reject) => {
        new WebpackDevServer(webpack(config))
            .listen(port!, host!, (err: any) => {
                if (err) {
                    reject(err);
                    return;
                }

                console.log(`Listening at ${config.devServer?.openPage}`);
            })
            .on('close', resolve);
    });
}
