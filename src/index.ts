import { Command } from 'commander';
import { version } from '../package.json';
import { create } from './command/create';
import { update } from './command/update';

const program = new Command('tdczw');
program.version(version, '-v --version');

program.command('update')
  .description('更新脚手架')
  .action(() => {
    update();
  });

program.command('create')
  .description('创建一个新项目模板')
  .argument('[name]', '项目名称')
  .action(dirName => {
    create(dirName);
  });

// parse 会解析 process.argv 中的内容
program.parse();