import process from 'child_process';
import chalk from 'chalk';
import ora from 'ora';

const spinner: ora.Ora = ora({
  text: chalk.green('tdczw-cli 正在更新...'),
  spinner: {
    interval: 300,
    frames: '⠋,'.repeat(10).slice(0, -1).split(',').map(item => {
      return chalk.blue(item);
    }),
  },
});

export const update = () => {
  spinner.start();
  process.exec('npm install tdczw-cli@latest -g', (error) => {
    spinner.stop();
    if (error) {
      spinner.fail();
      console.log(chalk.red('更新失败'), error);
      return;
    } else {
      spinner.succeed();
      console.log(chalk.green('更新成功'));
    }
  });
}