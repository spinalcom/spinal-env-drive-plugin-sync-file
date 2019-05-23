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

require("spinal-core-connectorjs");
var SpinalDrive_App = require("spinal-env-drive-core").SpinalDrive_App;
const JSpath = require('path');
const axios = require("axios");

class SpinalDrive_App_UploadHttpPathFile extends SpinalDrive_App {
  constructor() {
    super(
      "UploadHttpPathFile",
      "Upload a file",
      51,
      "cloud_upload",
      "Upload a file"
    );
    this.order_priority = 5;
  }
  action(obj) {
    const curDir = obj.model;
    const fs_path = obj.scope.fs_path;
    if (curDir._server_id === fs_path[0]._server_id) { // dir === home
      return false;
    }

    const file = window.FileSystem._objects[fs_path[fs_path.length - 1]._server_id];
    const info = file._info;
    const username = obj.scope.user.username;
    const path_array = [];
    const folderhomeName = `${username} (home)`
    for (let idx = 0; idx < fs_path.length; idx++) {
      const elem = fs_path[idx];
      if (elem.name === "home" || elem.name === folderhomeName) {
        path_array.push("/__users__");
        path_array.push(username);
      } else if (elem.name === "root") {
         path_array.push("/");
     } else {
        path_array.push(elem.name);
      }
    }

    const element = document.createElement("input");
    element.setAttribute("type", "file");
    element.multiple = true;

    const path = info.host.get() + '/upload/' + encodeURIComponent(JSpath.resolve(
      ...path_array));

    element.style.display = "none";
    document.body.appendChild(element);
    element.click();

    element.addEventListener('change', (e) => {
      const files = e.target.files;
      document.body.removeChild(element);
      var formData = new FormData();
      for (let idx = 0; idx < files.length; idx++) {
        const element = files[idx];
        formData.append(element.name, element);
      }
      axios.post(path, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }, false);
  }

  /**
   * method to know if the app is needed to be shown.
   * @param {Object} d node of the tree selectionned
   * @returns {boolean}
   * @memberof SpinalDrive_App_UploadHttpPathFile
   */
  is_shown(obj) {
    const curDir = obj.model;
    const fs_path = obj.scope.fs_path;
    if (curDir._server_id === fs_path[0]._server_id) { // dir === home
      return false;
    }

    const file = window.FileSystem._objects[fs_path[fs_path.length - 1]._server_id];

    const info = file._info;

    if (info &&
      info.model_type && (info.model_type.get() === 'Directory' || info.model_type.get() === 'Synchronized Directory') &&
      info.synchronised && info.synchronised.get() === true
    ) {
      return true;
    }
    return false;
  }
}

module.exports.FileExplorerUploadHttpPathFile = SpinalDrive_App_UploadHttpPathFile;
