const log = require("../logger");
const {createStack} = require("./bacnet-stack");
const { addDp, read } = require("../background-store");
const Device = require('./objects/DEVICE');
const logger = require("../logger");

class BacnetDevice {
  
  start() {
    log.info("starting shoko bacnet stack");
    try {
      if(this.bacstack) throw 'stack is already running!' 
      this.bacstack = createStack();
      let device = read('dp').find(dp=>dp.oid === '8:0');
      if(device){
        let model = device.properties.find(p=>p.id === 70);
        logger.debug(`restored device object ${model.value}`)
      } else {
        let device = new Device(0); 
        addDp(device);
        let model = device.properties.find(p=>p.id === 70);
        logger.debug(`created new default device ${model.value}`)
      }
      return 'started';
    } catch (err) {
      log.error(`start shoko bacnet stack failed: ${err}`);
      return `start shoko bacnet stack failed: ${err}`
    }
  }

  stop() {
    log.info("stopping shoko bacnet stack");
    try {
      if(!this.bacstack) throw 'stack was already stopped!' 
      this.bacstack.close();
      this.bacstack = null;
      return 'stopped';
    } catch (err) {
      log.error(`stopping shoko bacnet stack failed: ${err}`);
      return `stopping shoko bacnet stack failed: ${err}`
    }
  }
  
}

module.exports = BacnetDevice;
