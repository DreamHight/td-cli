import path from 'path';
import fs from 'fs-extra';
import axios, { AxiosResponse } from 'axios';
import { input, select } from '@inquirer/prompts';
import { clone } from '../utils/clone';
import { name, version } from '../../package.json';
import chalk from 'chalk';
import { gt } from 'lodash';
import log from '../utils/log';

export interface ITemplateInfo {
  name: string;         // 模板名称
  downloadUrl: string;  // 模板下载地址
  description: string;  // 模板描述
  branch: string;       // 模板名称
}

export const templates: Map<string, ITemplateInfo> = new Map([
  ['Vue3-Vite-TypeScript-Pinia', {
    name: 'Vue3-Vite-TypeScript-Pinia',
    downloadUrl: 'https://gitee.com/dreamhights/element-plus-pro.git',
    description: 'Vue3 + Vite + TypeScript + Pinia 技术栈的Web项目模板',
    branch: 'master'
  }],
  ['Vue3-Vite-TypeScript-Pinia-Mobile', {
    name: 'Vue3-Vite-TypeScript-Pinia-Mobile',
    downloadUrl: 'https://gitee.com/dreamhights/element-plus-pro.git',
    description: 'Vue3 + Vite + TypeScript + Pinia 技术栈的Web移动端项目模板',
    branch: 'master'
  }],
  ['React19-Vite-TypeScript-Zustand', {
    name: 'React19-Vite-TypeScript-Zustand',
    downloadUrl: 'https://gitee.com/dreamhights/element-plus-pro.git',
    description: 'React19 + Vite + TypeScript + Zustand 技术栈的Web项目模板',
    branch: 'master'
  }],
  ['Vue2-Webpack-JavaScript-Vuex', {
    name: 'Vue2-Webpack-JavaScript-Vuex',
    downloadUrl: 'https://gitee.com/dreamhights/element-plus-pro.git',
    description: 'Vue2 + Webpack + JavaScript + Vuex 技术栈的Web项目模板',
    branch: 'master'
  }],
]);

export const isOverWrite = (fileName: string) =>{
  return select({
    message: `是否覆盖 ${fileName} 文件夹？`,
    choices: [
      { name: '覆盖', value: true },
      { name: '取消', value: false },
    ]
  });
}

export const getNpmInfo = async (npmName: string) => {
  const npmUrl = `https://registry.npmjs.org/${npmName}`;
  let res = {};
  try {
    res = await axios.get(npmUrl);
  } catch (error) {
    // log.error(error as string)
  }
  return res;
}
export const getNpmLatestVersion = async (name: string) => {
  const { data } = (await getNpmInfo(name)) as AxiosResponse;
  return data['dist-tags'].latest;
}
export const checkVersion = async (name: string, currentVersion: string) => {
  const latestVersion = await getNpmLatestVersion(name);
  const need = gt(latestVersion, currentVersion);
  if(need) {
    log.info(`检测到 tdczw 最新版:${chalk.blueBright(latestVersion)} 当前版本:${chalk.blueBright(currentVersion)} ~`);
    log.info(`可使用 ${chalk.yellow('pnpm')} install tdczw-cli@latest 更新 ~`);
  }
  return need;
}

export const create = async (projectName?: string) => {
  let newProjectName: string = projectName || '';
  const templateList = Array.from(templates).map((item: [string, ITemplateInfo]) => {
    const [name, info] = item;
    return {
      name,
      value: name,
      description: info.description,
    };
  });

  if(!newProjectName) {
    newProjectName = await input({message: '请输入项目名称'});
  }

  // 如果文件夹存在，则提示用户是否覆盖
  const filePath: string = path.resolve(process.cwd(), newProjectName);
  if (fs.existsSync(filePath)) {
    const run: boolean = await isOverWrite(newProjectName);
    if (run) {
      await fs.remove(filePath);
    } else {
      return;
    }
  }

  // 检查版本更新
  await checkVersion(name, version);

  const templateName: string = await select({
    message: '请选择项目模板',
    choices: templateList,
  });
  const info: ITemplateInfo | undefined = templates.get(templateName);

  if(!info) {
    throw new Error('模板不存在');
  }

  clone(info.downloadUrl, newProjectName, ['-b', info.branch]);
}