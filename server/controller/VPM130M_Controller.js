const manager = require('../manager/VPM130M_Manager');

exports.processMain = (res, req) => {
    return null;
};

exports.processQuery = (res, req) => {
    manager.processQuery();
}

exports.processAddSave = (res, req) => {
    manager.processAddSave();
};