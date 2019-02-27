/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

module.extends = {};
require("spinal-env-drive-core");

function concat_lib(lib) {
  for (var key in lib) {
    module.exports[key] = lib[key];
  }
}
concat_lib(require("./downloadHttpPathFile.js"));
concat_lib(require("./uploadHttpPathFile.js"));

window.spinalDrive_Env.add_applications(
  "FileExplorer",
  new module.exports.FileExplorerDownloadHttpPathFile()
);
console.log(module.exports);

window.spinalDrive_Env.add_applications(
  "FileExplorerCurrDir",
  new module.exports.FileExplorerUploadHttpPathFile()
);

window.spinalDrive_Env.context_file_exp_app_icon["HttpPath"] =
  "content_copy";
window.spinalDrive_Env.context_file_exp_app_icon["Synchronized Directory"] =
  "folder_shared";
