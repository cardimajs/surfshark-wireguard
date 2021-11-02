const util = require('util');
const exec = util.promisify(require('child_process').exec);
export default exec