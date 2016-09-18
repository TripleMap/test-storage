var mongoose = require('mongoose');
var Testcase = require('../../models/Testcase.js');

var testcases = {
 
  /* 
   * Get all testcases 
   * 
   */
  getAll: function(req, res) {
    Testcase.find(function (err, testcases) {
      if (err) return err; // TODO check proper error handling
      res.json(testcases);
    }); 
  },
 
  /* 
   * Get single testcase 
   * 
   */

  getOne: function(req, res) {
     Testcase.findById(req.params.id, function (err, testcase) {
      if (err) return err; // TODO check proper error handling
      res.json(testcase);
    });
  },
 
  /* 
   * Create testcase 
   * 
   */

  create: function(req, res) {
    Testcase.create(req.body, function (err, createTestcase) {
      if (err) return err;
      res.json(createTestcase);
    });
  },

  /* 
   * Update testcase 
   * 
   */
 
  update: function(req, res) {
    // TODO need security check (user input) for update
    Testcase.findById( req.params.id, function ( err, testcase ){
     testcase.parentId = req.body.parentId;
     testcase.name = req.body.name;
     testcase.description = req.body.description;
     testcase.prerequisites = req.body.prerequisites;
     testcase.actual = req.body.actual;
     testcase.expected = req.body.expected;
     testcase.updated = Date.now();

     testcase.save( function ( err, testcase, count ){
      if (err) return err; // TODO check proper error handling
      res.json(testcase);
     });
    });
  },

  /* 
   * delete testcase 
   * 
   */
 
  delete: function(req, res) {
    Testcase.findByIdAndRemove(req.params.id, function (err, testcase) {
      if (err) return err;
      res.json(true);
    });
  }
};
 
module.exports = testcases;
