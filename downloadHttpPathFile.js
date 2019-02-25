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

class SpinalDrive_App_DownloadHttpPathFile extends SpinalDrive_App {
  constructor() {
    super(
      "DownloadHttpPathFile",
      "Download the file",
      51,
      "cloud_download",
      "Download the file"
    );
    this.order_priority = 5;
  }
  action(obj) {
    let mdDialog = obj.scope.injector.get("$mdDialog");
    let f = window.FileSystem._objects[obj.file._server_id];
    var confirm = mdDialog
      .confirm()
      .title("Do you want download " + f.name.get() + " ?")
      .ariaLabel("Download")
      .clickOutsideToClose(true)
      .ok("Download!")
      .cancel("Cancel");

    mdDialog.show(confirm).then(
      function() {
        f.load((httpPath)=> {
          if (f._info.model_type.get() == "HttpPath") {
            const element = document.createElement("a");
            const path = httpPath.host + '/' +
              encodeURIComponent(httpPath.httpRootPath.get()) + '/' +
              encodeURIComponent(httpPath.httpRoot.get());
            element.setAttribute("href", path);
            element.setAttribute("download", f.name.get());
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }

        });
      },
      function() {}
    );
  }

  /**
   * method to know if the app is needed to be shown.
   * @param {Object} d node of the tree selectionned
   * @returns {boolean}
   * @memberof SpinalDrive_App_DownloadHttpPathFile
   */
  is_shown(d) {
    if (d && d.file && d.file._server_id) {
      let file = window.FileSystem._objects[d.file._server_id];
      if (file) {
        if (file instanceof File) {

          if (file._info.model_type && file._info.model_type.get() === "HttpPath") {
            return true;
          }
        }
      }
    }
    return false;
  }
}

module.exports.FileExplorerDownloadHttpPathFile = SpinalDrive_App_DownloadHttpPathFile;
