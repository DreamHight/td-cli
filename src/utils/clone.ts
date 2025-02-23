import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
import createLogger from "progress-estimator";
import chalk from 'chalk';
const figlet = require('figlet');
// import figlet from 'figlet';
import log from './log';

// 初始化进度条
const logger = createLogger({
  spinner: {
    interval: 100,
    frames: '⠋,'.repeat(10).slice(0, -1).split(',').map(item => {
      return chalk.green(item);
    }),
  }
});

const printer = async () => {
  const data = await figlet('欢迎使用tdczw-cli脚手架');
  console.log(chalk.rgb(40, 156, 193).visible(data));
}

const gitOptions: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(),    // 当前工作目录
  binary: 'git',             // 指定 git 二进制文件的路径
  maxConcurrentProcesses: 6, // 同时运行的最大并发子进程数
}
export const clone = async (url: string, projectName: string, options: string[]) => {
  const git: SimpleGit = simpleGit(gitOptions);
  try {
    await logger(git.clone(url, projectName, options), '代码下载中...', {
      estimate: 8000, // 预计耗时
    });
    log.success(`项目创建成功 ${chalk.blueBright(projectName)}`);
    log.success(`执行以下命令启动项目：`);
    log.info(`cd ${chalk.blueBright(projectName)}`);
    log.info(`${chalk.yellow('pnpm')} install`);
    log.info(`${chalk.yellow('pnpm')} run dev`);

    await printer();
  } catch (error) {
    log.error(chalk.red('代码下载失败'));
  }
}